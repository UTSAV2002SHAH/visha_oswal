"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { ProfilePage } from '@/components/features/profile/ProfilePage';

/**
 * Dynamic profile page route
 * Handles /profile/[username]
 */
const UserProfilePage: React.FC = () => {
    const params = useParams();
    const username = params.username as string;

    return <ProfilePage targetUsername={username} />;
};

export default UserProfilePage;
