import { Box, Typography, Button } from "@mui/material";

export default function Chat() {
    return (
        <Box
            sx={{
                width: "300px",
                backgroundColor: "#F5F5F5",
                borderLeft: "1px solid #E0E0E0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Box sx={{ padding: "16px", flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Chat with Persona
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    This is a placeholder for the chat component.
                </Typography>
            </Box>
            <Box
                sx={{
                    padding: "8px",
                    borderTop: "1px solid #E0E0E0",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <input
                    type="text"
                    placeholder="Type a message..."
                    style={{
                        flex: 1,
                        padding: "8px",
                        border: "none",
                        outline: "none",
                        borderRadius: "4px",
                        marginRight: "8px",
                    }}
                />
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#7C4DFF",
                        color: "white",
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: "#6E3BFF",
                        },
                    }}
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
}
