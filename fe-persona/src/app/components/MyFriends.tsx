// app/components/MyFriends.tsx (or wherever your MyFriends component lives)
"use client"; // if using Next.js App Router

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
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { ExtendedUser } from '../models/user';
import mqtt from 'mqtt';

interface Friend {
    id: string;
    name: string;
    friends: [{
        schedule: string;
        name: string;
        location: string;
    }]
}

const MyFriends: React.FC<{ user: ExtendedUser | null }> = ({ user }) => {
    const [friends, setFriends] = useState<Friend | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {

        const client = mqtt.connect('ws://localhost:9001');

        client.on('connect', () => {
            if (client.connected) {
                client.subscribe('fe/topic', (err) => {
                    if (err) {
                        console.error('Subscription error:', err);
                    }
                });
            }
        });

        client.on('message', (topic, message) => {
            if (topic === 'fe/topic' && message.toString() === 'refresh') {
                window.location.reload();
            }
        });

        client.on('reconnect', () => {
            console.log('Reconnecting...');
        });

        client.on('offline', () => {
            console.log('Client went offline');
        });



        if (user) {
            const fetchFriends = async () => {
                if (!user?.id) return; // Ensure userId is present

                try {
                    const response = await fetch(`/api/friends?userId=${user.id}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch friends");
                    }
                    const data = await response.json();
                    console.log(data)
                    setFriends(data.realUser);
                } catch (err) {
                    setError(err instanceof Error ? err.message : "An error occurred");
                } finally {
                    setLoading(false);
                }
            };

            fetchFriends();
        } else {
            setLoading(false);
        }

        return () => {
            client.end();
        };
    }, [user]);

    const handleMessage = (friendName: string) => {
        // Implement messaging functionality
        console.log(`Message friend: ${friendName}`);
    };

    const handleRemove = (friendName: string) => {
        // Implement friend removal functionality
        console.log(`Remove friend: ${friendName}`);
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
            {/* Search Bar */}
            <TextField
                label="Search friends"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <List>
                {friends?.friends.map((friend2, index) => (
                    <ListItem
                        key={index}
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="message" onClick={() => handleMessage(friend2.name)}>
                                    <Chat color="primary" />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(friend2.name)}>
                                    <Delete color="error" />
                                </IconButton>
                            </>
                        }
                        sx={{ justifyContent: 'center' }}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>{friend2.name.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography variant="h6" color="textPrimary" align="center">
                                    {friend2.name}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    Schedule: {friend2.schedule ? <CheckIcon style={{ color: 'green', verticalAlign: 'middle' }} /> : <CloseIcon style={{ color: 'red', verticalAlign: 'middle' }} />} | Location: {friend2.location ? <CheckIcon style={{ color: 'green', verticalAlign: 'middle' }} /> : <CloseIcon style={{ color: 'red', verticalAlign: 'middle' }} />}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default MyFriends;
