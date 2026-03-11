"use client";

import React from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/image-utils';

interface SearchResultCardProps {
    user: {
        userId?: string;
        name: string;
        username: string;
        profilePictureUrl: string;
        personal?: {
            currentCity?: string;
            maritalStatus?: string;
        };
    };
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ user }) => {
    return (
        <Link
            href={`/profile/${user.username || user.userId}`}
            className="block group"
        >
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 border border-gray-100 flex items-center gap-4">
                {/* Profile Image */}
                <div className="relative w-16 h-16 flex-shrink-0">
                    <img
                        src={getImageUrl(user.profilePictureUrl) || "/default-avatar.png"}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover border-2 border-gray-50 group-hover:border-orange-100 transition-colors"
                    />
                </div>

                {/* User Info */}
                <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                        {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">@{user.username}</p>

                    {user.personal?.currentCity && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {user.personal.currentCity}
                        </p>
                    )}
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
};
