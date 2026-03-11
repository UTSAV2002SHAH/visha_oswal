import React from 'react';

interface ProfileActionsProps {
    onLogout: () => void;
    isOwnProfile?: boolean;
}

/**
 * Profile action buttons (Message, Logout, etc.)
 * Adapts based on whether viewing own profile or someone else's
 */
export const ProfileActions: React.FC<ProfileActionsProps> = ({
    onLogout,
    isOwnProfile = true,
}) => {
    return (
        <div className="mt-4 flex flex-wrap gap-3 items-center">
            {isOwnProfile ? (
                <>
                    <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold px-6 py-2 rounded-full hover:scale-105 transition-transform duration-200">
                        Edit Profile
                    </button>
                    <button
                        onClick={onLogout}
                        className="border border-gray-400 text-gray-600 font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold px-6 py-2 rounded-full hover:scale-105 transition-transform duration-200">
                        Message
                    </button>
                    <button className="border border-gray-400 text-gray-600 font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition">
                        Connect
                    </button>
                </>
            )}
        </div>
    );
};
