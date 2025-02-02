"use client"; // Add this directive to make the component a Client Component

import Image from "next/image";
import { Container, Typography, Button, Box } from "@mui/material";
import { signIn } from "next-auth/react";
import PersonaCharacter from "./components/PersonaCharacter";

export default function Home() {
  return (
    <Container
      maxWidth="md"
      sx={{
        overflowY: "auto",
        scrollbarWidth: "none",
        paddingY: "5vh"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          textAlign: "center",
        }}
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
        <PersonaCharacter />
      </Box>
    </Container>
  );
}