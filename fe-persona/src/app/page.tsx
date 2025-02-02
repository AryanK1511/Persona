"use client"; // Add this directive to make the component a Client Component

import Image from "next/image";
import { Container, Typography, Button, Box, Avatar, Stack, Chip } from "@mui/material";
import { signIn } from "next-auth/react";

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

export default function Home() {
  return (
    <Container
      maxWidth="md"
      sx={{
        padding: "24px",
      }}
    >
      <Box
        className="flex flex-col items-center justify-center min-h-screen gap-8"
        sx={{ textAlign: "center", height: "100%" }}
      >
        {/* Persona Logo with a playful touch */}
        <Box
          sx={{
            borderRadius: "50%",
            backgroundColor: "#7C4DFF",
            padding: "16px",
            boxShadow: "0px 4px 20px rgba(124, 77, 255, 0.3)",
          }}
        >
          <Image
            src="/Persona-Logo-removebg.png"
            alt="Persona logo"
            width={150}
            height={150}
            priority
          />
        </Box>

        {/* Welcome Message */}
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          sx={{ color: "#333333", fontWeight: 300 }}
        >
          Welcome to Persona
        </Typography>
        <Typography
          variant="h5"
          align="center"
          paragraph
          sx={{ color: "#666666", fontWeight: 300 }}
        >
          Connect with your friends and manage your schedule effortlessly.
        </Typography>

        {/* Sign-in Button */}
        <Box className="flex gap-4">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#7C4DFF",
              color: "white",
              borderRadius: "20px",
              padding: "10px 24px",
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "#6E3BFF",
              },
            }}
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </Button>
        </Box>

        {/* Persona Profile Display */}
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
      </Box>
    </Container>
  );
}