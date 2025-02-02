import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!; // Ensure this is set in your .env.local file

// Optional: Use a cached connection for performance in serverless environments
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }
    const client = new MongoClient(uri, {
    });
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const client = await connectToDatabase();
            const database = client.db('PersonaMongoCluster'); // your database name
            const collection = database.collection('users'); // your collection name

            const userId = req.query.userId as string;

            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }

            if (!ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid user ID' });
            }
            // Query using _id (since your document stores _id as "123")
            const user = await collection.findOne({ _id: new ObjectId(userId) });

            if (user) {
                res.status(200).json({ friends: user.friends || [] });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}