"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { getImageUrl } from '@/lib/image-utils';

// Gradient colors per first letter
const getGradient = (name?: string) => {
    const gradients = [
        'from-orange-400 to-amber-400',
        'from-rose-400 to-pink-400',
        'from-violet-400 to-purple-400',
        'from-sky-400 to-blue-400',
        'from-teal-400 to-emerald-400',
    ];
    const index = (name?.charCodeAt(0) || 0) % gradients.length;
    return gradients[index];
};

export const UserMenu: React.FC = () => {
    const { user } = useAppContext();
    const router = useRouter();

    if (!user) return null;

    const initial = user.name?.charAt(0)?.toUpperCase() || 'U';
    const gradient = getGradient(user.name);

    return (
        <button
            id="profile-avatar-btn"
            onClick={() => router.push('/profile')}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-orange-400 transition-all overflow-hidden flex-shrink-0"
            aria-label="Go to my profile"
            title={user.name || 'My Profile'}
        >
            {user.profilePictureUrl ? (
                <img
                    src={getImageUrl(user.profilePictureUrl)}
                    alt="My profile"
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <span className="text-sm font-bold text-white">{initial}</span>
                </div>
            )}
        </button>
    );
};
