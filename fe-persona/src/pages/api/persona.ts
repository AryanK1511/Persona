import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI as string;
if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await connectToDatabase();
        const database = client.db("PersonaMongoCluster"); // ✅ Use correct database name
        const users = database.collection("users");
        const personas = database.collection("personas");

        const userId = req.query.userId as string;
        if (!userId || !ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        console.log(`[INFO] Fetching user with ID: ${userId}`);

        // Find the user by _id
        const user = await users.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            console.log(`[ERROR] No user found with ID: ${userId}`);
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`[SUCCESS] User found: ${JSON.stringify(user)}`);

        // Ensure personaId exists and is a valid ObjectId
        if (!user.personaId || !ObjectId.isValid(user.personaId.toString())) {
            console.log(`[WARN] User does not have a valid personaId`);
            return res.status(404).json({ message: "Persona not found" });
        }

        // Convert personaId to string before passing to ObjectId
        const personaIdString = user.personaId.toString();
        console.log(`[INFO] Fetching persona with ID: ${personaIdString}`);

        // Fetch the persona using the personaId from the user document
        const persona = await personas.findOne({ _id: new ObjectId(personaIdString) });

        if (!persona) {
            console.log(`[ERROR] Persona not found for user ID: ${userId}`);
            return res.status(404).json({ message: "Persona not found" });
        }

        console.log(`[SUCCESS] Persona found: ${JSON.stringify(persona)}`);

        res.status(200).json(persona);
    } catch (error) {
        console.error(`[ERROR] Error fetching persona:`, error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
