import { Box, Typography, Avatar, Stack, Chip } from "@mui/material";

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

export default function PersonaCharacter() {
    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "600px",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                textAlign: "left",
            }}
        >
            <Stack direction="row" spacing={3} alignItems="center">
                {/* Persona Avatar */}
                <Avatar
                    src={personaData.image}
                    alt={personaData.name}
                    sx={{
                        width: 100,
                        height: 100,
                    }}
                />

                {/* Persona Details */}
                <Box>
                    <Typography variant="h4" sx={{ color: "#333333", fontWeight: 500 }}>
                        {personaData.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666666", mt: 1 }}>
                        {personaData.bio}
                    </Typography>
                </Box>
            </Stack>

            {/* Persona Traits */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ color: "#333333", fontWeight: 500 }}>
                    Traits
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {personaData.traits.map((trait, index) => (
                        <Chip
                            key={index}
                            label={trait}
                            sx={{
                                backgroundColor: "#80DEEA",
                                color: "white",
                                borderRadius: "12px",
                            }}
                        />
                    ))}
                </Stack>
            </Box>

            {/* Persona Stats */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ color: "#333333", fontWeight: 500 }}>
                    Stats
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    {Object.entries(personaData.stats).map(([key, value]) => (
                        <Typography key={key} variant="body1" sx={{ color: "#666666" }}>
                            {key}: {value}
                        </Typography>
                    ))}
                </Stack>
            </Box>

            {/* Persona Character Fields */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ color: "#333333", fontWeight: 500 }}>
                    Character
                </Typography>
                {Object.entries(personaData.character).map(([key, value]) => (
                    <Box key={key} sx={{ mt: 1 }}>
                        <Typography variant="body1" sx={{ color: "#666666" }}>
                            <strong>{key}:</strong>{" "}
                            {Array.isArray(value) ? value.join(", ") : value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
