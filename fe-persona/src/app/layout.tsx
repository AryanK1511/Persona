"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  Box,
  Avatar,
  Container,
  IconButton,
  Collapse,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Chat from "./components/Chat";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

// Load Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// **Custom Theme**
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#7C4DFF" }, // Violet
    secondary: { main: "#80DEEA" }, // Light Blue
    background: { default: "#F9FAFB", paper: "#FFFFFF" }, // Soft Background
    text: { primary: "#333333", secondary: "#666666" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 600 },
    h2: { fontSize: "2rem", fontWeight: 500 },
    body1: { fontSize: "1rem", fontWeight: 400 },
  },
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Ensure no rendering on the server
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#F9FAFB",
        }}
      >
        <SessionProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* 🔹 Sticky Navigation Bar */}
            <AppBar
              position="sticky"
              elevation={1}
              sx={{
                backgroundColor: "rgba(124, 77, 255, 0.9)", // Semi-transparent
                backdropFilter: "blur(12px)", // Glass effect
                boxShadow: "0 4px 12px rgba(124, 77, 255, 0.2)",
                zIndex: 10,
              }}
            >
              <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Left Side: Logo */}
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  Persona
                </Typography>

                {/* Centered Links */}
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
                  <NavLink href="/">Home</NavLink>
                  <NavLink href="/friends">My Friends</NavLink>
                </Box>

                {/* Right Side: User & Menu */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <UserAvatar />
                  <Menu />
                </Box>
              </Toolbar>
            </AppBar>

            {/* 🔹 Main Content Layout */}
            <Box
              component="main"
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                maxHeight: "calc(100vh - 120px)", // Ensures no overlap with navbar/footer
                overflow: "hidden",
              }}
            >
              {/* Left: Main Content (Expands to fill available space) */}
              <Container
                sx={{
                  flexGrow: 1,
                  minWidth: "60%",
                  overflowY: "auto",
                  maxHeight: "100%", // Prevents overflowing into footer
                }}
              >
                {children}
              </Container>

              {/* Right: Chat Panel (Full Height but stays inside layout) */}
              <Box
                sx={{
                  width: { xs: "100%", md: "350px" }, // Fixed width on desktop
                  display: { xs: "none", md: "flex" }, // Hides on small screens
                  backgroundColor: "background.paper",
                  boxShadow: "-2px 0px 10px rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  maxHeight: "100%", // Keeps chat within the viewport
                  overflowY: "auto",
                }}
              >
                <Chat />
              </Box>
            </Box>

            {/* 🔹 Footer */}
            <Box
              component="footer"
              sx={{
                backgroundColor: "rgba(124, 77, 255, 0.9)",
                color: "white",
                padding: "16px",
                textAlign: "center",
                backdropFilter: "blur(12px)",
                zIndex: 10,
              }}
            >
              <Typography variant="body2">
                © {new Date().getFullYear()} Persona. All rights reserved.
              </Typography>
            </Box>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

/* 🔹 Helper: Navigation Link */
function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <Button
      component={Link}
      href={href}
      sx={{
        color: "white",
        fontWeight: 500,
        textTransform: "none",
        "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
      }}
    >
      {children}
    </Button>
  );
}

/* 🔹 Helper: User Avatar */
function UserAvatar() {
  const { data: session } = useSession();

  if (session?.user?.image) {
    return (
      <Avatar
        src={session.user.image}
        alt={session.user.name || "User Avatar"}
        sx={{ width: 36, height: 36 }}
      />
    );
  }

  return null;
}

/* 🔹 Helper: Menu */
function Menu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton sx={{ color: "white" }} onClick={handleToggle}>
        <MenuIcon />
      </IconButton>
      <Collapse in={open}>
        {session && (
          <Button
            onClick={() => signOut()}
            sx={{
              color: "white",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            Sign out
          </Button>
        )}
      </Collapse>
    </>
  );
}
