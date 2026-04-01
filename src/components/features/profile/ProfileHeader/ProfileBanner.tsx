import React, { useRef, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { SpinnerIcon } from '@/components/ui/icons/SpinnerIcon';
import { getImageUrl } from '@/lib/image-utils';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

interface ProfileBannerProps {
    bannerImageUrl?: string;
    isEditable?: boolean;
}

/**
 * Profile banner component with optional edit button
 * Handles empty state gracefully with gradient background
 */
export const ProfileBanner: React.FC<ProfileBannerProps> = ({
    bannerImageUrl,
    isEditable = true,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { fetchUser } = useAppContext();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large. Please select an image under 5MB.');
            return;
        }

        setIsUploading(true);
        try {
            // 1. Get Presigned URL
            const uploadRes = await fetchWithAuth(`/api/upload-url?fileType=${encodeURIComponent(file.type)}&uploadType=banner`);

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
            const profileRes = await fetchWithAuth('/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bannerImageUrl: key })
            });

            if (profileRes.ok) {
                await fetchUser(); // Refresh global user state
            } else {
                const data = await profileRes.json();
                alert(data.msg || 'Failed to update banner image');
            }
        } catch (err) {
            console.error('Banner upload error:', err);
            alert('Something went wrong during upload');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="h-48 bg-gradient-to-r from-orange-200 to-yellow-200 dark:from-slate-800 dark:to-slate-900 relative transition-all duration-300">
            {bannerImageUrl && (
                <img
                    src={getImageUrl(bannerImageUrl)}
                    alt="Profile banner"
                    className="w-full h-full object-cover"
                />
            )}

            {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                    <SpinnerIcon className="w-10 h-10 text-white animate-spin" />
                </div>
            )}

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
                    className="absolute top-4 right-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 shadow-md transition-all transform hover:scale-110 disabled:opacity-50 border border-white dark:border-slate-700"
                    aria-label="Edit banner"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            )}
        </div>
    );
};
