import React, { useRef, useState } from 'react';
import { UserIcon } from '@/components/ui/icons/UserIcon';
import { useAppContext } from '@/context/AppContext';
import { SpinnerIcon } from '@/components/ui/icons/SpinnerIcon';
import { getImageUrl } from '@/lib/image-utils';

interface ProfileAvatarProps {
    profilePictureUrl?: string;
    isEditable?: boolean;
}

/**
 * Profile avatar component with camera edit button
 * Shows UserIcon when no profile picture is set
 */
export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    profilePictureUrl,
    isEditable = true,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { fetchUser } = useAppContext();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];

        // Basic validation
        if (file.size > 2 * 1024 * 1024) {
            alert('File is too large. Please select an image under 2MB.');
            return;
        }

        setIsUploading(true);
        const token = localStorage.getItem('token');

        try {
            // 1. Get Presigned URL
            const uploadRes = await fetch(`/api/upload-url?fileType=${encodeURIComponent(file.type)}&uploadType=profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!uploadRes.ok) throw new Error('Failed to get upload URL');
            const { uploadUrl, key } = await uploadRes.json();

            // 2. Upload to S3
            const s3Res = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            if (!s3Res.ok) throw new Error('Failed to upload image to S3');

            // 3. Update User Profile in DB
            const profileRes = await fetch('/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ profilePictureUrl: key })
            });

            if (profileRes.ok) {
                await fetchUser(); // Refresh global user state
            } else {
                const data = await profileRes.json();
                alert(data.msg || 'Failed to update profile picture');
            }
        } catch (err) {
            console.error('Avatar upload error:', err);
            alert('Something went wrong during upload');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="absolute -top-16 left-6">
            <div className="relative">
                <div className="w-32 h-32 bg-gray-200 dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-950 shadow-md flex items-center justify-center overflow-hidden transition-colors duration-300">
                    {profilePictureUrl ? (
                        <img
                            src={getImageUrl(profilePictureUrl)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <UserIcon className="w-20 h-20 text-gray-400 dark:text-gray-600" />
                    )}

                    {isUploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <SpinnerIcon className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept="image/*"
                    className="hidden"
                />

                {isEditable && (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute bottom-1 right-1 bg-white dark:bg-slate-800 p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 shadow-md transition-all transform hover:scale-110 disabled:opacity-50 border border-slate-100 dark:border-slate-700"
                        aria-label="Change profile picture"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};
