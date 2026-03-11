import React, { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { FormInput } from '../shared/FormInput';
import { FormButtonControls } from '../shared/FormButtonControls';
import toast from 'react-hot-toast';

interface ProfileInfoEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentData: {
        name: string;
        username: string;
        headline: string;
        city: string;
    };
    onUpdate: () => void;
}
export const ProfileInfoEditModal: React.FC<ProfileInfoEditModalProps> = ({
    isOpen,
    onClose,
    currentData,
    onUpdate,
}) => {
    // ... (state and handlers remain)

    // Handlers (same as before)
    const [formData, setFormData] = useState(currentData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to update profile info');
            }

            toast.success('Profile info updated successfully!');
            onUpdate();
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile info');
        }
    };

    const handleCancel = () => {
        setFormData(currentData); // Reset to original
        onClose();
    };


    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title="Edit Profile Info"
        >
            <div className="space-y-4">
                <FormInput
                    name="name"
                    label="Name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                />
                <FormInput
                    name="username"
                    label="Username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="User Name"
                    required
                />
                <FormInput
                    name="headline"
                    label="Headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="Your Headline"
                />
                <FormInput
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your City"
                />
                <FormButtonControls onCancel={handleCancel} onSave={handleSave} />
            </div>
        </Modal>
    );
};
