import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!; // Ensure this is set in your .env.local file
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            await client.connect();
            const database = client.db('PersonaMongoCluster'); // Use your database name
            const collection = database.collection('users'); // Use your collection name

            const userId = req.query.userId as string;
            const user = await collection.findOne({ id: userId });

            if (user) {
                res.status(200).json({ friends: user.friends || [] });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}