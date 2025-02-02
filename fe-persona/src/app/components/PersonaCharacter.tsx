import { Box, Typography, Avatar, Stack, Chip, Paper, Divider } from "@mui/material";

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

interface PersonaCharacterProps {
    persona: {
        name: string;
        image: string;
        bio: string;
        traits?: string[];
        stats?: Record<string, number | string>;
        character?: Record<string, any>;
    };
}

export default function PersonaCharacter({ persona }: PersonaCharacterProps) {
    return (
        <Paper
            elevation={3}
            sx={{
                width: "100%",
                maxWidth: "600px",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "24px",
                textAlign: "left",
            }}
        >
            {/* Persona Avatar and Name */}
            <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                    src={persona.image}
                    alt={persona.name}
                    sx={{
                        width: 100,
                        height: 100,
                        border: "4px solid #7C4DFF", // Add a border to the avatar
                    }}
                />
                <Box>
                    <Typography variant="h4" sx={{ color: "#333333", fontWeight: 500 }}>
                        {persona.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666666", mt: 1 }}>
                        {persona.bio}
                    </Typography>
                </Box>
            </Stack>

            <Divider sx={{ my: 3 }} /> {/* Divider between sections */}

            {/* Persona Traits */}
            {persona.traits && persona.traits.length > 0 && (
                <Box sx={{ mt: 3, textAlign: "center" }}> {/* Center the content */}
                    <Typography variant="h6" sx={{ color: "#333333", fontWeight: 500 }}>
                        Traits
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", justifyContent: "center" }}> {/* Center the chips */}
                        {persona.traits.map((trait, index) => (
                            <Chip
                                key={index}
                                label={trait}
                                sx={{
                                    backgroundColor: "#80DEEA",
                                    color: "white",
                                    borderRadius: "12px",
                                    margin: "4px", // Add margin for better spacing
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            )}

            <Divider sx={{ my: 3 }} /> {/* Divider between sections */}

            {/* Persona Character Fields */}
            {persona.character && Object.keys(persona.character).length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ color: "#333333", fontWeight: 500 }}>
                        Character
                    </Typography>
                    {Object.entries(persona.character).map(([key, value]) => (
                        <Box key={key} sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ color: "#666666" }}>
                                <strong>{key}:</strong>{" "}
                                {Array.isArray(value) ? value.join(", ") : value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
}