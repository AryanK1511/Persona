import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoClient, ObjectId } from "mongodb";

interface ExtendedUser {
    id: string;
    name: string;
    email: string;
    picture: string;
    friends: string[];
}

const uri = process.env.MONGODB_URI as string;
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                const client = await connectToDatabase();
                const database = client.db("PersonaMongoCluster");
                const collection = database.collection("users");

                console.log(`[INFO] Signing in user: ${user.email}`);

                const existingUser = await collection.findOne({ email: user.email });

                if (!existingUser) {
                    console.log(`[INFO] User not found, creating new user: ${user.email}`);
                    const result = await collection.insertOne({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        friends: [],
                        personaId: new ObjectId().toString(), // Ensure personaId is set as ObjectId
                    });

                    (user as ExtendedUser).id = result.insertedId.toString(); // Ensure ID is set
                    console.log(`[INFO] New user created with ID: ${result.insertedId}`);
                } else {
                    (user as ExtendedUser).id = existingUser._id.toString(); // Assign the existing MongoDB _id
                    console.log(`[INFO] Existing user found with ID: ${existingUser._id}`);
                }

                return true;
            } catch (error) {
                if (error instanceof Error) {
                    console.error(`[ERROR] Error signing in user: ${error.message}`, error);
                } else {
                    console.error(`[ERROR] Error signing in user:`, error);
                }
                return false;
            }
        },

        async jwt({ token, user }) {
            if (user) {
                token.user = {
                    id: (user as ExtendedUser).id,  // Ensure id is included
                    name: user.name,
                    email: user.email,
                    picture: user.image,
                };
                console.log(`[INFO] JWT token created for user: ${user.email}`);
            }
            return token;
        },

        async session({ session, token }) {
            if (token.user) {
                const user = token.user as ExtendedUser;
                session.user = {
                    id: user.id,  // Ensure id is set
                    name: user.name,
                    email: user.email,
                    image: user.picture,  // Ensure image is set
                };
                console.log(`[INFO] Session created for user: ${user.email}`);
            }
            return session;
        },
    },
    debug: true,
});