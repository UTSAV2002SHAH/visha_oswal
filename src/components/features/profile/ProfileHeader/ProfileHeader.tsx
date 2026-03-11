import React from 'react';
import { useRouter } from 'next/navigation';
import { ProfileBanner } from './ProfileBanner';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileInfo } from './ProfileInfo';
import { ProfileUser } from '@/types/profile';

const SettingsIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

interface ProfileHeaderProps {
    user: ProfileUser;
    onInfoEdit?: () => void;
    onLogout?: () => void;
    onSettingsOpen?: () => void;
    isEditable?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user,
    onInfoEdit,
    isEditable = false,
}) => {
    const router = useRouter();

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden mb-6 transition-colors duration-300 border border-transparent dark:border-slate-700">
            <ProfileBanner bannerImageUrl={user.bannerImageUrl} isEditable={isEditable} />
            <div className="p-6 relative">
                <ProfileAvatar profilePictureUrl={user.profilePictureUrl} isEditable={isEditable} />
                <ProfileInfo
                    name={user.name}
                    username={user.username}
                    headline={user.headline}
                    city={user.city}
                    connections={user.connections}
                    onEditClick={onInfoEdit}
                />

                {/* Settings gear — navigates to /settings page */}
                {isEditable && (
                    <button
                        onClick={() => router.push('/settings')}
                        className="absolute bottom-6 right-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-orange-800 transition-all hover:scale-110"
                        title="Settings"
                        aria-label="Go to settings"
                    >
                        <SettingsIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};
