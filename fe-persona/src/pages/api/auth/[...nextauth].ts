import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoClient } from "mongodb";

interface ExtendedUser {
    id: string;
    name: string;
    email: string;
    picture: string;
    friends: string[];
}

const uri = process.env.MONGODB_URI!;
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
            const client = await connectToDatabase();
            const database = client.db("PersonaMongoCluster");
            const collection = database.collection("users");

            const existingUser = await collection.findOne({ email: user.email });

            if (!existingUser) {
                const result = await collection.insertOne({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    friends: [],
                });

                (user as ExtendedUser).id = result.insertedId.toString(); // Ensure ID is set
            } else {
                (user as ExtendedUser).id = existingUser._id.toString(); // Assign the existing MongoDB _id
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.user = {
                    id: (user as ExtendedUser).id,  // Ensure id is included
                    name: user.name,
                    email: user.email,
                    picture: user.image,
                };
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
            }
            return session;
        },
    },
    debug: true,
});