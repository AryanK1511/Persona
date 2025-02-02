import { NextApiRequest, NextApiResponse } from "next";

// Mock JSON data for the Persona profile (replace with actual data from your backend)
const personaData = {
    name: "Luna",
    image: "/persona-avatar.png", // Replace with the actual image path
    bio: "A cheerful and curious companion who loves helping you stay organized and connected.",
    traits: ["Friendly", "Creative", "Tech-Savvy"],
    stats: {
        level: 5,
        mood: "Happy",
        energy: 85,
    },
    character: {
        favoriteActivities: ["Reading", "Coding", "Exploring"],
        personalityType: "INFP",
        hobbies: ["Photography", "Gardening"],
        motto: "Stay curious!",
    },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(personaData);
}
