"use client";

import React, { useState } from 'react';
import { ProfileSectionCard } from '../shared/ProfileSectionCard';
import { AboutDisplay } from './AboutDisplay';
import { AboutEditForm } from './AboutEditForm';
import { UserIcon } from '@/components/ui/icons/UserIcon';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

interface AboutSectionProps {
    initialAbout: string;
    onUpdate: () => void;
    isEditable?: boolean;
}

/**
 * About section container component
 * Manages edit state and API calls
 */
export const AboutSection: React.FC<AboutSectionProps> = ({
    initialAbout,
    onUpdate,
    isEditable = true,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(initialAbout);

    const handleSave = async () => {
        try {
            const response = await fetchWithAuth('/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ about: editedText }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to update about section');
            }

            toast.success('About section updated successfully!');
            onUpdate(); // Refresh user data
            setIsEditing(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update about section');
        }
    };

    const handleCancel = () => {
        setEditedText(initialAbout); // Reset to original
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setEditedText(initialAbout); // Initialize with current value
        setIsEditing(true);
    };

    return (
        <ProfileSectionCard
            title="About"
            icon={<UserIcon className="w-6 h-6" />}
            showEdit={isEditable}
            onEditClick={handleEditClick}
            isFormOpen={isEditing}
        >
            {isEditing ? (
                <AboutEditForm
                    value={editedText}
                    onChange={setEditedText}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <AboutDisplay text={initialAbout} />
            )}
        </ProfileSectionCard>
    );
};
