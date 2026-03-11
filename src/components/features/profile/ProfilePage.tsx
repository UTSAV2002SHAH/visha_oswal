"use client";

import React, { useState, useEffect } from 'react';
import { PencilIcon } from '../../ui/icons/PencilIcon';
import { CameraIcon } from '../../ui/icons/CameraIcon';
import { UserIcon } from '../../ui/icons/UserIcon';
import { useAppContext } from '@/context/AppContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { SpinnerIcon } from '../../ui/icons/SpinnerIcon';
import toast from 'react-hot-toast';
import { ProfileHeader } from './ProfileHeader/ProfileHeader';
import { ProfileInfoEditModal } from './ProfileHeader/ProfileInfoEditModal';
import { ProfileOverview } from './ProfileOverview';
import { ProfilePosts } from './ProfilePosts';
import { ProfileFamily } from './ProfileFamily';
import { ProfileHeaderSkeleton, ProfileOverviewSkeleton } from '@/components/ui/Skeletons';
import { ProfileDateSelector } from '@/components/ui/ProfileDateSelector';
import { ProfileCompletionGuard } from '@/components/shared/ProfileCompletionGuard';
import { useProfileCompleteness } from '@/hooks/useProfileCompleteness';

// Interfaces
interface Experience {
    _id: string;
    title: string;
    company: string;
    logo: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
}

interface Education {
    _id: string;
    school: string;
    degree: string;
    logo: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    fieldOfStudy?: string;
}

const formatDate = (dateString: string, format: 'monthYear' | 'full' | 'api' = 'monthYear') => {
    if (!dateString) return 'Select a date';
    const date = new Date(dateString);
    if (format === 'monthYear') {
        return date.toLocaleString('default', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    }
    if (format === 'api') {
        return date.toISOString().split('T')[0];
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

const getDurationString = (item: { startDate: string, endDate?: string, isCurrent: boolean }) => {
    if (!item.startDate) return '';
    const start = formatDate(item.startDate, 'monthYear');
    const end = item.isCurrent ? 'Present' : (item.endDate ? formatDate(item.endDate, 'monthYear') : 'N/A');
    return `${start} - ${end}`;
};

interface ProfilePageProps {
    targetUsername?: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ targetUsername }) => {
    const { user: currentUser, setIsLoggedIn, fetchUser: fetchCurrentUser } = useAppContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') as 'overview' | 'posts' | 'family' || 'overview';

    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'family'>(initialTab);

    const [profileData, setProfileData] = useState<any>(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    const [isInfoEditModalOpen, setIsInfoEditModalOpen] = useState(false);

    const [isAboutEditing, setIsAboutEditing] = useState(false);
    const [editedAboutText, setEditedAboutText] = useState("");

    const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
    const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
    const initialExperienceState: Omit<Experience, '_id'> = { title: '', company: '', startDate: '', endDate: '', description: '', logo: 'https://via.placeholder.com/48', isCurrent: false };
    const [experienceFormData, setExperienceFormData] = useState<Omit<Experience, '_id'> & { _id?: string }>(initialExperienceState);

    const [isEducationFormOpen, setIsEducationFormOpen] = useState(false);
    const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
    const initialEducationState: Omit<Education, '_id'> = { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', logo: 'https://via.placeholder.com/48', isCurrent: false };
    const [educationFormData, setEducationFormData] = useState<Omit<Education, '_id'> & { _id?: string }>(initialEducationState);

    const { isComplete, refresh: refreshCompleteness } = useProfileCompleteness();
    const [isGuardOpen, setIsGuardOpen] = useState(false);

    interface DatePickerTarget {
        section: 'experience' | 'education';
        field: 'startDate' | 'endDate';
    }
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [datePickerTarget, setDatePickerTarget] = useState<DatePickerTarget | null>(null);
    const [datePickerInitialDate, setDatePickerInitialDate] = useState<string | undefined>(undefined);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            // Refresh completeness status as well
            refreshCompleteness();

            if (targetUsername) {
                // Fetch public profile
                const res = await fetch(`/api/users/profile/${targetUsername}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfileData(data);
                    setEditedAboutText(data.about || '');

                    // Check if this is the logged-in user's own profile
                    if (currentUser && data._id === currentUser.id) {
                        setIsOwnProfile(true);
                    } else {
                        setIsOwnProfile(false);
                    }
                } else {
                    toast.error("User not found");
                    router.push('/');
                }
            } else if (currentUser) {
                // Own profile from context
                setProfileData(currentUser);
                setEditedAboutText(currentUser.about || '');
                setIsOwnProfile(true);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
            toast.error("An error occurred while loading the profile");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [targetUsername, currentUser]);

    // Update activeTab when query param changes
    useEffect(() => {
        const tabParam = searchParams.get('tab') as 'overview' | 'posts' | 'family';
        if (tabParam && ['overview', 'posts', 'family'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    const handleTabChange = (tab: 'overview' | 'posts' | 'family') => {
        if (tab === 'family' && !isComplete) {
            setIsGuardOpen(true);
            return;
        }
        setActiveTab(tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.pushState({}, '', url.toString());
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/');
        toast.success("Successfully logged out!");
    };

    const handleApiCall = async (endpoint: string, method: string, body?: any) => {
        const token = localStorage.getItem('token');
        const options: RequestInit = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(endpoint, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'API request failed');
        }
        return response.json();
    };

    const handleAboutSave = async () => {
        if (!isOwnProfile) return;
        try {
            await handleApiCall('/api/users/me', 'PUT', { about: editedAboutText });
            fetchCurrentUser();
            setIsAboutEditing(false);
        } catch (error: any) {
            toast.error("Failed to update about section");
        }
    };

    // --- Skills Handlers ---
    const handleSkillAdd = async (skill: string) => {
        const currentSkills: string[] = profileData?.skills || [];
        if (currentSkills.includes(skill)) {
            toast.error('Skill already added');
            return;
        }
        const updatedSkills = [...currentSkills, skill];
        try {
            await handleApiCall('/api/users/me', 'PUT', { skills: updatedSkills });
            fetchCurrentUser();
            toast.success(`"${skill}" added!`);
        } catch (error: any) {
            toast.error('Failed to add skill');
        }
    };

    const handleSkillDelete = async (skill: string) => {
        const currentSkills: string[] = profileData?.skills || [];
        const updatedSkills = currentSkills.filter((s: string) => s !== skill);
        try {
            await handleApiCall('/api/users/me', 'PUT', { skills: updatedSkills });
            fetchCurrentUser();
            toast.success(`"${skill}" removed`);
        } catch (error: any) {
            toast.error('Failed to remove skill');
        }
    };

    // --- Experience Handlers ---
    const handleAddExperienceClick = () => {
        setExperienceFormData(initialExperienceState);
        setEditingExperienceId(null);
        setIsExperienceFormOpen(true);
    };

    const handleEditExperienceClick = (exp: Experience) => {
        setEditingExperienceId(exp._id);
        setExperienceFormData({
            ...exp,
            startDate: formatDate(exp.startDate, 'api'),
            endDate: exp.endDate ? formatDate(exp.endDate, 'api') : '',
        });
        setIsExperienceFormOpen(true);
    };

    const handleSaveExperience = async () => {
        if (!experienceFormData.title || !experienceFormData.company || !experienceFormData.startDate) {
            toast.error("Please fill in all required fields");
            return;
        }
        try {
            if (editingExperienceId) {
                await handleApiCall(`/api/experience/${editingExperienceId}`, 'PUT', experienceFormData);
            } else {
                await handleApiCall('/api/experience', 'POST', experienceFormData);
            }
            fetchCurrentUser();
            handleCancelExperience();
            toast.success("Experience saved successfully");
        } catch (error: any) {
            toast.error("Failed to save experience");
        }
    };

    const handleDeleteExperience = async () => {
        if (!editingExperienceId) return;
        try {
            await handleApiCall(`/api/experience/${editingExperienceId}`, 'DELETE');
            fetchCurrentUser();
            handleCancelExperience();
            toast.success("Experience deleted");
        } catch (error: any) {
            toast.error("Failed to delete experience");
        }
    }

    const handleCancelExperience = () => {
        setIsExperienceFormOpen(false);
        setEditingExperienceId(null);
        setExperienceFormData(initialExperienceState);
    };

    // --- Education Handlers ---
    const handleAddEducationClick = () => {
        setEducationFormData(initialEducationState);
        setEditingEducationId(null);
        setIsEducationFormOpen(true);
    };

    const handleEditEducationClick = (edu: Education) => {
        setEditingEducationId(edu._id);
        setEducationFormData({
            ...edu,
            startDate: formatDate(edu.startDate, 'api'),
            endDate: edu.endDate ? formatDate(edu.endDate, 'api') : '',
        });
        setIsEducationFormOpen(true);
    };

    const handleSaveEducation = async () => {
        if (!educationFormData.school || !educationFormData.degree || !educationFormData.startDate) {
            toast.error("Please fill in all required fields");
            return;
        }
        try {
            if (editingEducationId) {
                await handleApiCall(`/api/education/${editingEducationId}`, 'PUT', educationFormData);
            } else {
                await handleApiCall('/api/education', 'POST', educationFormData);
            }
            fetchCurrentUser();
            handleCancelEducation();
            toast.success("Education saved successfully");
        } catch (error: any) {
            toast.error("Failed to save education");
        }
    };

    const handleDeleteEducation = async () => {
        if (!editingEducationId) return;
        try {
            await handleApiCall(`/api/education/${editingEducationId}`, 'DELETE');
            fetchCurrentUser();
            handleCancelEducation();
            toast.success("Education deleted");
        } catch (error: any) {
            toast.error("Failed to delete education");
        }
    }

    const handleCancelEducation = () => {
        setIsEducationFormOpen(false);
        setEditingEducationId(null);
        setEducationFormData(initialEducationState);
    };

    // --- Common Form Handlers ---
    const openDatePicker = (target: DatePickerTarget, initialDate?: string) => {
        setDatePickerTarget(target);
        setDatePickerInitialDate(initialDate);
        setIsDatePickerOpen(true);
    };

    const handleDateSelect = (date: string | 'present') => {
        if (!datePickerTarget) return;
        const { section, field } = datePickerTarget;
        const targetSetter = section === 'experience' ? setExperienceFormData : setEducationFormData;
        if (date === 'present') {
            if (field === 'endDate') targetSetter((prev: any) => ({ ...prev, isCurrent: true, endDate: '' }));
        } else {
            targetSetter((prev: any) => ({ ...prev, [field]: date, isCurrent: field === 'endDate' ? false : prev.isCurrent }));
        }
        setIsDatePickerOpen(false);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setter: React.Dispatch<React.SetStateAction<any>>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setter((prev: any) => ({ ...prev, [name]: checked, endDate: checked ? '' : prev.endDate }));
        } else {
            setter((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleCompanySelect = (company: { name: string, logo: string }) => {
        setExperienceFormData(prev => ({ ...prev, company: company.name, logo: company.logo }));
    };

    if (isLoading || !profileData) {
        return (
            <div className="container mx-auto max-w-6xl py-24 px-4">
                <ProfileHeaderSkeleton />
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 mb-6 h-14" />
                <ProfileOverviewSkeleton />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl py-24 px-4 pb-28 md:pb-16 animate-fade-in">
            {/* Header Section */}
            {/* Header Section */}
            <ProfileHeader
                user={profileData}
                onInfoEdit={isOwnProfile ? () => setIsInfoEditModalOpen(true) : undefined}
                isEditable={isOwnProfile}
            />

            {/* Modals */}
            {isInfoEditModalOpen && isOwnProfile && (
                <ProfileInfoEditModal
                    isOpen={isInfoEditModalOpen}
                    onClose={() => setIsInfoEditModalOpen(false)}
                    currentData={{
                        name: profileData.name,
                        username: profileData.username,
                        headline: profileData.headline || '',
                        city: profileData.city || '',
                    }}
                    onUpdate={fetchCurrentUser}
                />
            )}


            {/* Date Picker (Fallback for other uses if any) */}
            {isDatePickerOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-4">Select Date</h3>
                        <ProfileDateSelector
                            value={datePickerInitialDate}
                            onSelect={handleDateSelect}
                        />
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setIsDatePickerOpen(false)} className="px-4 py-2 text-slate-500">Close</button>
                        </div>
                    </div>
                </div>
            )}

            <ProfileCompletionGuard
                isOpen={isGuardOpen}
                onClose={() => setIsGuardOpen(false)}
            />

            {/* Tab Navigation — sticky below navbar */}
            <div className="sticky top-16 z-30 bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden mb-6 transition-colors duration-300 border border-transparent dark:border-slate-700">
                <div className="flex border-t border-slate-100 dark:border-slate-700 px-2">
                    <button
                        onClick={() => handleTabChange('overview')}
                        className={`py-4 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors duration-200 flex-1 sm:flex-none ${activeTab === 'overview' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => handleTabChange('posts')}
                        className={`py-4 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors duration-200 flex-1 sm:flex-none ${activeTab === 'posts' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                        Posts
                    </button>
                    <button
                        onClick={() => handleTabChange('family')}
                        className={`py-4 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors duration-200 flex-1 sm:flex-none ${activeTab === 'family' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                        Family
                    </button>
                </div>
            </div>

            <main>
                {activeTab === 'overview' && (
                    <ProfileOverview
                        profileData={profileData}
                        isAboutEditing={isAboutEditing}
                        editedAboutText={editedAboutText}
                        setEditedAboutText={setEditedAboutText}
                        setIsAboutEditing={setIsAboutEditing}
                        handleAboutSave={handleAboutSave}

                        isExperienceFormOpen={isExperienceFormOpen}
                        experienceFormData={experienceFormData}
                        setExperienceFormData={setExperienceFormData}
                        handleAddExperienceClick={isOwnProfile ? handleAddExperienceClick : () => { }}
                        handleEditExperienceClick={isOwnProfile ? handleEditExperienceClick : () => { }}
                        handleSaveExperience={handleSaveExperience}
                        handleCancelExperience={handleCancelExperience}
                        handleDeleteExperience={handleDeleteExperience}
                        editingExperienceId={editingExperienceId}
                        handleCompanySelect={handleCompanySelect}

                        isEducationFormOpen={isEducationFormOpen}
                        educationFormData={educationFormData}
                        setEducationFormData={setEducationFormData}
                        handleAddEducationClick={isOwnProfile ? handleAddEducationClick : () => { }}
                        handleEditEducationClick={isOwnProfile ? handleEditEducationClick : () => { }}
                        handleSaveEducation={handleSaveEducation}
                        handleCancelEducation={handleCancelEducation}
                        handleDeleteEducation={handleDeleteEducation}
                        editingEducationId={editingEducationId}

                        openDatePicker={openDatePicker}
                        formatDate={formatDate}
                        getDurationString={getDurationString}
                        handleFormChange={handleFormChange}
                        onSkillAdd={isOwnProfile ? handleSkillAdd : async () => { }}
                        onSkillDelete={isOwnProfile ? handleSkillDelete : async () => { }}
                        isOwnProfile={isOwnProfile}
                        onUpdate={fetchProfile}
                    />
                )}
                {activeTab === 'posts' && (
                    <ProfilePosts />
                )}
                {activeTab === 'family' && (
                    <ProfileFamily
                        profileData={profileData}
                        isOwnProfile={isOwnProfile}
                        onUpdate={fetchProfile}
                    />
                )}
            </main>


        </div >
    );
};
