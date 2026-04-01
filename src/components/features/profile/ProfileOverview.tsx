import React from 'react';
import { UserIcon } from '../../ui/icons/UserIcon';
import { BriefcaseIcon } from '../../ui/icons/BriefcaseIcon';
import { GraduationCapIcon } from '../../ui/icons/GraduationCapIcon';
import { PencilIcon } from '../../ui/icons/PencilIcon';
import { PlusIcon } from '../../ui/icons/PlusIcon';
import { SkillsCard } from './SkillsCard';
import { CompanyAutocomplete, Company } from '../../ui/CompanyAutocomplete';
import { DatePicker } from '../../ui/DatePicker';

import { ProfileSectionCard } from './shared/ProfileSectionCard';
import { FormInput } from './shared/FormInput';
import { FormButtonControls } from './shared/FormButtonControls';
import { ProfilePersonalDetails } from './ProfilePersonalDetails';
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

interface ProfileOverviewProps {
    profileData: any;
    isAboutEditing: boolean;
    editedAboutText: string;
    setEditedAboutText: (text: string) => void;
    setIsAboutEditing: (isEditing: boolean) => void;
    handleAboutSave: () => void;

    // Experience Props
    isExperienceFormOpen: boolean;
    experienceFormData: any;
    setExperienceFormData: any;
    handleAddExperienceClick: () => void;
    handleEditExperienceClick: (exp: Experience) => void;
    handleSaveExperience: () => void;
    handleCancelExperience: () => void;
    handleDeleteExperience: () => void;
    editingExperienceId: string | null;
    handleCompanySelect: (company: Company) => void;

    // Education Props
    isEducationFormOpen: boolean;
    educationFormData: any;
    setEducationFormData: any;
    handleAddEducationClick: () => void;
    handleEditEducationClick: (edu: Education) => void;
    handleSaveEducation: () => void;
    handleCancelEducation: () => void;
    handleDeleteEducation: () => void;
    editingEducationId: string | null;

    // Shared Helper Props
    openDatePicker: (target: any, initialDate?: string) => void;
    formatDate: (dateString: string, format?: 'monthYear' | 'full' | 'api') => string;
    getDurationString: (item: any) => string;
    handleFormChange: (e: any, setter: any) => void;

    // Skills Props
    onSkillAdd: (skill: string) => void;
    onSkillDelete: (skill: string) => void;
    isOwnProfile?: boolean;
    onUpdate?: () => void;
}

// --- Sub Components ---
// Removed inline definitions. Imported from ./shared/


export const ProfileOverview: React.FC<ProfileOverviewProps> = (props) => {
    const {
        profileData, isAboutEditing, editedAboutText, setEditedAboutText, setIsAboutEditing, handleAboutSave,
        isExperienceFormOpen, experienceFormData, setExperienceFormData, handleAddExperienceClick, handleEditExperienceClick, handleSaveExperience, handleCancelExperience, handleDeleteExperience, editingExperienceId, handleCompanySelect,
        isEducationFormOpen, educationFormData, setEducationFormData, handleAddEducationClick, handleEditEducationClick, handleSaveEducation, handleCancelEducation, handleDeleteEducation, editingEducationId,
        openDatePicker, formatDate, getDurationString, handleFormChange,
        onSkillAdd, onSkillDelete, isOwnProfile, onUpdate
    } = props;

    // Temporary mock skills data (was in ProfilePage) - assuming we still want to show skills here or pass them in?
    // The previous implementation had mockSidebarData.skills. 
    // We should probably keep SkillsCard here.
    const mockSidebarData = {
        skills: [
            'React', 'TypeScript', 'JavaScript (ES6+)',
            'Node.js', 'UI/UX Design', 'Tailwind CSS',
            'Next.js', 'GraphQL', 'Figma'
        ],
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">

                {/* PERSONAL DETAILS SECTION */}
                <ProfilePersonalDetails 
                    isOwnProfile={!!isOwnProfile} 
                    data={profileData.extendedProfile?.personal} 
                    onUpdate={onUpdate} 
                />

                {/* ABOUT SECTION */}
                <ProfileSectionCard
                    title="About"
                    icon={<UserIcon className="w-6 h-6" />}
                    onEditClick={isOwnProfile ? () => setIsAboutEditing(true) : undefined}
                    onAddClick={() => { }}
                    isFormOpen={isAboutEditing}
                    showEdit={isOwnProfile}
                >
                    {isAboutEditing ? (
                        <div className="space-y-4">
                            <textarea value={editedAboutText} onChange={(e) => setEditedAboutText(e.target.value)} className="w-full h-48 p-3 bg-white dark:bg-slate-700 border border-orange-500 rounded-md focus:ring-2 focus:ring-orange-500 transition-colors duration-200 ease-in-out text-gray-800 dark:text-white" aria-label="Edit about section" />
                            <FormButtonControls onCancel={() => setIsAboutEditing(false)} onSave={handleAboutSave} />
                        </div>
                    ) : (
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{profileData.about}</p>
                    )}
                </ProfileSectionCard>

                {/* EXPERIENCE SECTION */}
                <ProfileSectionCard
                    title="Experience"
                    icon={<BriefcaseIcon className="w-6 h-6" />}
                    showAdd={isOwnProfile}
                    showEdit={false}
                    onAddClick={isOwnProfile ? handleAddExperienceClick : () => { }}
                    isFormOpen={isExperienceFormOpen}
                >
                    {isExperienceFormOpen ? (
                        <div className="space-y-4">
                            <CompanyAutocomplete
                                label="Company Name *"
                                value={experienceFormData.company || ''}
                                onValueChange={(value) => handleFormChange({ target: { name: 'company', value } } as any, setExperienceFormData)}
                                onSelect={handleCompanySelect}
                                placeholder="e.g., Google"
                            />
                            <FormInput name="title" label="Role / Title *" value={experienceFormData.title || ''} onChange={(e) => handleFormChange(e, setExperienceFormData)} placeholder="e.g., Senior Frontend Engineer" />
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date *</label>
                                    <button onClick={() => openDatePicker({ section: 'experience', field: 'startDate' }, experienceFormData.startDate)} className="mt-1 block w-full text-left px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 dark:text-white">
                                        {formatDate(experienceFormData.startDate, 'full')}
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                                    <button onClick={() => openDatePicker({ section: 'experience', field: 'endDate' }, experienceFormData.endDate)} disabled={experienceFormData.isCurrent} className="mt-1 block w-full text-left px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-gray-900 dark:text-white">
                                        {experienceFormData.isCurrent ? 'Present' : formatDate(experienceFormData.endDate, 'full')}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="isCurrentExperience" name="isCurrent" checked={experienceFormData.isCurrent} onChange={(e) => handleFormChange(e, setExperienceFormData)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                <label htmlFor="isCurrentExperience" className="text-sm font-medium text-gray-700 dark:text-gray-300">I currently work here</label>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea name="description" value={experienceFormData.description || ''} onChange={(e) => handleFormChange(e, setExperienceFormData)} rows={4} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 dark:text-white" />
                            </div>
                            <FormButtonControls onCancel={handleCancelExperience} onSave={handleSaveExperience} onDelete={editingExperienceId ? handleDeleteExperience : undefined} />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {profileData.experience.map((job: Experience) => (
                                <div key={job._id} className="flex gap-4 group/item">
                                    <img src={job.logo} alt={`${job.company} logo`} className="w-12 h-12 object-contain mt-1" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{job.title}</h3>
                                        <p className="text-md text-gray-600 dark:text-gray-400">{job.company}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">{getDurationString(job)}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">{job.description}</p>
                                    </div>
                                    {isOwnProfile && (
                                        <button onClick={() => handleEditExperienceClick(job)} className="text-gray-400 hover:text-orange-600 transition-colors opacity-0 group-hover/item:opacity-100" aria-label={`Edit ${job.title}`}>
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ProfileSectionCard>

                {/* EDUCATION SECTION */}
                <ProfileSectionCard
                    title="Education"
                    icon={<GraduationCapIcon className="w-6 h-6" />}
                    showAdd={isOwnProfile}
                    showEdit={false}
                    onAddClick={isOwnProfile ? handleAddEducationClick : () => { }}
                    isFormOpen={isEducationFormOpen}
                >
                    {isEducationFormOpen ? (
                        <div className="space-y-4">
                            <FormInput name="school" label="School / College Name *" value={educationFormData.school || ''} onChange={(e) => handleFormChange(e, setEducationFormData)} placeholder="e.g., Stanford University" />
                            <FormInput name="degree" label="Degree / Board *" value={educationFormData.degree || ''} onChange={(e) => handleFormChange(e, setEducationFormData)} placeholder="e.g., Bachelor of Science" />
                            <FormInput name="fieldOfStudy" label="Field of Study / Branch" value={educationFormData.fieldOfStudy || ''} onChange={(e) => handleFormChange(e, setEducationFormData)} placeholder="e.g., Computer Science" />
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date *</label>
                                    <button onClick={() => openDatePicker({ section: 'education', field: 'startDate' }, educationFormData.startDate)} className="mt-1 block w-full text-left px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 dark:text-white">
                                        {formatDate(educationFormData.startDate, 'full')}
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                                    <button onClick={() => openDatePicker({ section: 'education', field: 'endDate' }, educationFormData.endDate)} disabled={educationFormData.isCurrent} className="mt-1 block w-full text-left px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-gray-900 dark:text-white">
                                        {educationFormData.isCurrent ? 'Present' : formatDate(educationFormData.endDate, 'full')}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="isCurrentEducation" name="isCurrent" checked={educationFormData.isCurrent} onChange={(e) => handleFormChange(e, setEducationFormData)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                <label htmlFor="isCurrentEducation" className="text-sm font-medium text-gray-700 dark:text-gray-300">I'm currently studying here</label>
                            </div>
                            <FormButtonControls onCancel={handleCancelEducation} onSave={handleSaveEducation} onDelete={editingEducationId ? handleDeleteEducation : undefined} />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {profileData.education.map((edu: Education) => (
                                <div key={edu._id} className="flex gap-4 group/item">
                                    <img src={edu.logo} alt={`${edu.school} logo`} className="w-12 h-12 mt-1" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{edu.school}</h3>
                                        <p className="text-md text-gray-600 dark:text-gray-400">{edu.degree}</p>
                                        {edu.fieldOfStudy && <p className="text-md text-gray-600 dark:text-gray-400">{edu.fieldOfStudy}</p>}
                                        <p className="text-sm text-gray-500 dark:text-gray-500">{getDurationString(edu)}</p>
                                    </div>
                                    {isOwnProfile && (
                                        <button onClick={() => handleEditEducationClick(edu)} className="text-gray-400 hover:text-orange-600 transition-colors opacity-0 group-hover/item:opacity-100" aria-label={`Edit ${edu.school}`}>
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ProfileSectionCard>
            </div>

            {/* COMPONENTS - SKILLS */}
            <SkillsCard
                skills={profileData.skills || mockSidebarData.skills}
                onAdd={onSkillAdd}
                onDelete={onSkillDelete}
                isEditable={isOwnProfile}
            />
        </div>
    );
};
