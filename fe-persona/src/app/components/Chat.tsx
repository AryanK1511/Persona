import { Box, Typography, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function Chat() {
    return (
        <Box
            sx={{
                width: "100%", // Full width
                backgroundColor: "#FFFFFF",
                boxShadow: "-2px 0px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
                display: "flex",
                flexDirection: "column",
                height: "100%", // Takes full available height inside the layout
                overflow: "hidden", // No unwanted scrollbars
                borderTopRightRadius: 0, // Remove border from top right
            }}
        >
            {/* 🔹 Header */}
            <Box
                sx={{
                    padding: "16px",
                    backgroundColor: "#7C4DFF",
                    color: "white",
                    fontWeight: 600,
                }}
            >
                <Typography variant="h6">Chat with Persona</Typography>
            </Box>

            {/* 🔹 Chat Messages (Scrollable) */}
            <Box
                sx={{
                    flex: 1, // Takes remaining space
                    padding: "16px",
                    overflowY: "auto",
                    backgroundColor: "#F9FAFB",
                }}
            >
                <Typography variant="body2" color="textSecondary">
                    This is a placeholder for the chat component.
                </Typography>
            </Box>

            {/* 🔹 Input Field & Send Button */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: "#FFFFFF",
                    borderTop: "1px solid #E0E0E0",
                }}
            >
                <TextField
                    placeholder="Type a message..."
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                        backgroundColor: "#F9FAFB",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#E0E0E0" },
                            "&:hover fieldset": { borderColor: "#B39DDB" },
                            "&.Mui-focused fieldset": { borderColor: "#7C4DFF" },
                        },
                    }}
                />
                <IconButton
                    sx={{
                        backgroundColor: "#7C4DFF",
                        color: "white",
                        marginLeft: "8px",
                        "&:hover": { backgroundColor: "#6E3BFF" },
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
