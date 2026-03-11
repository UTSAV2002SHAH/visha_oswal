import React from 'react';

interface ProfileInfoProps {
    name: string;
    username?: string;
    headline: string;
    city: string;
    connections: number;
    onEditClick?: () => void;
}

/**
 * Profile information display (name, username, headline, city, connections)
 * Shows default placeholders for empty fields
 */
export const ProfileInfo: React.FC<ProfileInfoProps> = ({
    name,
    username,
    headline,
    city,
    connections,
    onEditClick,
}) => {
    return (
        <>
            <div className="flex justify-end">
                {onEditClick && (
                    <button
                        onClick={onEditClick}
                        className="text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all transform hover:scale-110"
                        aria-label="Edit profile header"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="pt-16">
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300 leading-tight">
                        {name || 'Your Name'}
                    </h1>
                    {username && (
                        <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 tracking-wide">
                            @{username}
                        </p>
                    )}
                </div>
                <p className="text-md text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">
                    {headline || 'Your Headline'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
                    {city || 'Your City'}
                </p>
            </div>
        </>
    );
};
