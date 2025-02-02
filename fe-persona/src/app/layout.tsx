"use client"; // Add this directive to make the component a Client Component

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline } from "@mui/material";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Custom theme with relaxing colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#7C4DFF", // Violet
    },
    secondary: {
      main: "#80DEEA", // Light Blue
    },
    background: {
      default: "#F5F5F5", // Light Gray
    },
    text: {
      primary: "#333333", // Dark Gray
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 300,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 300,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <html lang="en" style={{ height: '100%' }}>
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ height: '100%', margin: 0 }}>
            {/* Navigation Bar */}
            <AppBar position="static" sx={{ backgroundColor: "#7C4DFF" }}>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Persona
                </Typography>
                <Button color="inherit" component={Link} href="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} href="/friends">
                  My Friends
                </Button>
                <Button color="inherit" component={Link} href="/calendar">
                  Calendar
                </Button>
              </Toolbar>
            </AppBar>
            {/* Main Content */}
            <Container sx={{ padding: "24px", backgroundColor: "background.default", minHeight: '100vh' }}>
              {children}
            </Container>
          </body>
        </ThemeProvider>
      </SessionProvider>
    </html>
  );
}