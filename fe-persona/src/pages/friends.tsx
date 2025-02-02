"use client";

import React, { useEffect, useState } from 'react';
import MyFriends from '../app/components/MyFriends';
import { useSession } from 'next-auth/react';
import { Container, Typography } from '@mui/material';
import { ExtendedUser } from '../app/models/user';

const Friends: React.FC = () => {
    const { data: session, status } = useSession();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return (
            <Container>
                <Typography variant="h2" sx={{ mb: 3 }}>
                    My Friends
                </Typography>
                <Typography>Please log in to see your friends.</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h2" sx={{ mb: 3 }}>
                My Friends
            </Typography>
            <MyFriends
                user={
                    session && session.user
                        ? {
                            ...(session.user as ExtendedUser),
                            id: (session.user as ExtendedUser).id || '',
                            name: session.user.name || '',
                        } as ExtendedUser
                        : null
                }
            />
        </Container>
    );
};

export default Friends;