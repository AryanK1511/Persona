import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Avatar,
    ListItemAvatar,
    TextField,
    IconButton,
} from '@mui/material';
import { Chat, Delete } from '@mui/icons-material';
import { ExtendedUser } from '../models/user';

interface Friend {
    id: string;
    name: string;
    avatar?: string;
}

const MyFriends: React.FC<{ user: ExtendedUser | null }> = ({ user }) => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (user) {
            const fetchFriends = async () => {
                try {
                    const response = await fetch(`/api/friends?userId=${user.id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch friends');
                    }
                    const data = await response.json();
                    setFriends(data.friends);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                } finally {
                    setLoading(false);
                }
            };

            fetchFriends();
        } else {
            setLoading(false);
        }
    }, [user]);

    const filteredFriends = friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleMessage = (friendId: string) => {
        // Implement messaging functionality
        console.log(`Message friend with ID: ${friendId}`);
    };

    const handleRemove = (friendId: string) => {
        // Implement friend removal functionality
        console.log(`Remove friend with ID: ${friendId}`);
    };

    if (!user) {
        return (
            <Container>
                <Typography variant="h2">My Friends</Typography>
                <Typography>Please log in to see your friends.</Typography>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container>
                <Typography variant="h2">My Friends</Typography>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h2">My Friends</Typography>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h2" sx={{ mb: 3 }}>
                My Friends
            </Typography>

            {/* Search Bar */}
            <TextField
                label="Search friends"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Friends List */}
            <List>
                {filteredFriends.length > 0 ? (
                    filteredFriends.map((friend) => (
                        <ListItem
                            key={friend.id}
                            secondaryAction={
                                <>
                                    {/* Friend Actions */}
                                    <IconButton edge="end" aria-label="message" onClick={() => handleMessage(friend.id)}>
                                        <Chat />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(friend.id)}>
                                        <Delete />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src={friend.avatar} alt={friend.name} />
                            </ListItemAvatar>
                            <ListItemText primary={friend.name} />
                        </ListItem>
          ))
        ) : (
          <Typography>No friends found.</Typography>
        )}
      </List>
    </Container>
  );
};

export default MyFriends;