"use client";

import React, { useState, useEffect } from 'react';
import { ProfileSectionCard } from './shared/ProfileSectionCard';
import { FormInput } from './shared/FormInput';
import { FormButtonControls } from './shared/FormButtonControls';
import { UserIcon } from '@/components/ui/icons/UserIcon';
import { ProfileDateSelector } from '@/components/ui/ProfileDateSelector';
import { isProfileComplete } from '@/utils/profile-validation';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

interface PersonalDetails {
    fullName: string;
    gender?: 'Male' | 'Female' | 'Other';
    maritalStatus?: string;
    dateOfBirth?: string;
    cityOfOrigin?: string;
    currentCity?: string;
    contactNumber?: string;
}

interface ProfilePersonalDetailsProps {
    isOwnProfile: boolean;
    data?: PersonalDetails;
    onUpdate?: () => void;
}

export const ProfilePersonalDetails: React.FC<ProfilePersonalDetailsProps> = ({ isOwnProfile, data, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(!data);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<PersonalDetails | null>(data || null);
    const [formData, setFormData] = useState<PersonalDetails | null>(data || null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const fetchProfile = async () => {
        if (data) {
            setIsLoading(false);
            return;
        }
        
        // If not own profile and no data provided, don't fetch (prevents leaking own data to other profiles)
        if (!isOwnProfile) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetchWithAuth('/api/member-profile');
            if (res.ok) {
                const data = await res.json();
                const personal = data.personal || {};
                setProfile(personal);
                setFormData(personal);
            }
        } catch (error) {
            console.error("Failed to fetch personal info", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (data) {
            setProfile(data);
            setFormData(data);
            setIsLoading(false);
        } else if (isOwnProfile) {
            fetchProfile();
        } else {
            setProfile(null);
            setFormData(null);
            setIsLoading(false);
        }
    }, [data, isOwnProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
    };

    const handleSave = async () => {
        if (!formData) return;

        // Validation
        if (!formData.fullName?.trim()) {
            toast.error("Full Name is required");
            return;
        }
        if (!formData.gender) {
            toast.error("Gender is required");
            return;
        }
        if (!formData.contactNumber?.trim()) {
            toast.error("Contact Number is required");
            return;
        }
        if (!formData.dateOfBirth) {
            toast.error("Date of Birth is required");
            return;
        }

        try {
            const response = await fetchWithAuth('/api/member-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ personal: formData }),
            });

            if (!response.ok) throw new Error('Failed to update details');

            toast.success('Personal details updated!');
            setProfile(formData);
            setIsEditing(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            toast.error('Failed to save changes');
        }
    };

    if (isLoading) return null;

    return (
        <ProfileSectionCard
            title="Personal Details"
            icon={<UserIcon className="w-6 h-6" />}
            showEdit={isOwnProfile && !isEditing}
            onEditClick={() => setIsEditing(true)}
            isFormOpen={isEditing}
        >
            {isEditing ? (
                <div className="space-y-4">
                    <FormInput
                        name="fullName"
                        label="Full Name *"
                        value={formData?.fullName || ''}
                        onChange={handleChange}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender *</label>
                            <select
                                name="gender"
                                value={formData?.gender || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-white"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marital Status</label>
                            <select
                                name="maritalStatus"
                                value={formData?.maritalStatus || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-white"
                            >
                                <option value="">Select Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Divorced">Divorced</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth *</label>
                            <ProfileDateSelector
                                value={formData?.dateOfBirth}
                                onSelect={(date) => {
                                    setFormData(prev => prev ? ({ ...prev, dateOfBirth: date }) : null);
                                }}
                            />
                        </div>
                        <FormInput
                            name="contactNumber"
                            label="Contact Number *"
                            value={formData?.contactNumber || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            name="cityOfOrigin"
                            label="City of Origin"
                            value={formData?.cityOfOrigin || ''}
                            onChange={handleChange}
                        />
                        <FormInput
                            name="currentCity"
                            label="Current City"
                            value={formData?.currentCity || ''}
                            onChange={handleChange}
                        />
                    </div>


                    <FormButtonControls onCancel={() => setIsEditing(false)} onSave={handleSave} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <DetailItem label="Full Name" value={profile?.fullName} />
                    <DetailItem label="Gender" value={profile?.gender} />
                    <DetailItem label="Date of Birth" value={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : null} />
                    <DetailItem label="Marital Status" value={profile?.maritalStatus} />
                    <DetailItem label="City of Origin" value={profile?.cityOfOrigin} />
                    <DetailItem label="Current City" value={profile?.currentCity} />
                    <DetailItem label="Contact" value={profile?.contactNumber} />
                </div>
            )}
        </ProfileSectionCard>
    );
};

const DetailItem = ({ label, value }: { label: string, value?: string | null }) => (
    <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-gray-800 dark:text-gray-200 mt-0.5">{value || <span className="italic text-slate-400 font-normal">Not specified</span>}</span>
    </div>
);
