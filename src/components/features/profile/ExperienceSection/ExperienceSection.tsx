import React, { useState } from 'react';
import { BriefcaseIcon } from '@/components/ui/icons/BriefcaseIcon';
import { ProfileSectionCard } from '../shared/ProfileSectionCard';
import { ExperienceList } from './ExperienceList';
import { ExperienceForm } from './ExperienceForm';
import { Experience } from '@/types/profile';
import { Company } from '@/components/ui/CompanyAutocomplete';
import { DatePicker } from '@/components/ui/DatePicker';
import { formatDate } from '@/utils/profileUtils';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

interface ExperienceSectionProps {
    experiences: Experience[];
    onUpdate: () => void;
}

const initialExperienceState: Omit<Experience, '_id'> = {
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
    logo: 'https://via.placeholder.com/48',
    isCurrent: false
};

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, onUpdate }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Experience, '_id'> & { _id?: string }>(initialExperienceState);

    // Date Picker State (Local to this section)
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [datePickerField, setDatePickerField] = useState<'startDate' | 'endDate' | null>(null);
    const [datePickerInitialDate, setDatePickerInitialDate] = useState<string | undefined>(undefined);

    const handleAddClick = () => {
        setFormData(initialExperienceState);
        setEditingId(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (exp: Experience) => {
        setEditingId(exp._id);
        setFormData({
            ...exp,
            startDate: formatDate(exp.startDate, 'api'),
            endDate: exp.endDate ? formatDate(exp.endDate, 'api') : '',
        });
        setIsFormOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = (e.target as HTMLInputElement);
            setFormData(prev => ({ ...prev, [name]: checked, endDate: checked ? '' : prev.endDate }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCompanySelect = (company: Company) => {
        setFormData(prev => ({ ...prev, company: company.name, logo: company.logo }));
    };

    // API Helpers
    const handleApiCall = async (endpoint: string, method: string, body?: any) => {
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        };
        const response = await fetchWithAuth(endpoint, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'API request failed');
        }
        return response.json();
    };

    const handleSave = async () => {
        if (!formData.title || !formData.company || !formData.startDate) {
            // Ideally show validation error
            return;
        }
        try {
            if (editingId) {
                await handleApiCall(`/api/experience/${editingId}`, 'PUT', formData);
            } else {
                await handleApiCall('/api/experience', 'POST', formData);
            }
            onUpdate();
            handleCancel();
        } catch (error) {
            console.error('Failed to save experience', error);
        }
    };

    const handleDelete = async () => {
        if (!editingId) return;
        try {
            await handleApiCall(`/api/experience/${editingId}`, 'DELETE');
            onUpdate();
            handleCancel();
        } catch (error) {
            console.error('Failed to delete experience', error);
        }
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData(initialExperienceState);
    };

    // Date Picker Logic
    const handleDateClick = (field: 'startDate' | 'endDate', currentDate: string) => {
        setDatePickerField(field);
        setDatePickerInitialDate(currentDate);
        setIsDatePickerOpen(true);
    };

    const handleDateSelect = (date: string | 'present') => {
        if (!datePickerField) return;

        if (date === 'present') {
            if (datePickerField === 'endDate') {
                setFormData(prev => ({ ...prev, isCurrent: true, endDate: '' }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [datePickerField]: date,
                isCurrent: datePickerField === 'endDate' ? false : prev.isCurrent
            }));
        }
        setIsDatePickerOpen(false);
    };

    return (
        <>
            <ProfileSectionCard
                title="Experience"
                icon={<BriefcaseIcon className="w-6 h-6" />}
                showAdd={true}
                showEdit={false} // List items handle their own edit clicks
                onAddClick={handleAddClick}
                isFormOpen={isFormOpen}
            >
                {isFormOpen ? (
                    <ExperienceForm
                        formData={formData}
                        onChange={handleFormChange}
                        onCompanySelect={handleCompanySelect}
                        onDateClick={handleDateClick}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onDelete={editingId ? handleDelete : undefined}
                    />
                ) : (
                    <ExperienceList
                        experiences={experiences}
                        onEditItem={handleEditClick}
                    />
                )}
            </ProfileSectionCard>

            <DatePicker
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onSelect={handleDateSelect}
                initialDate={datePickerInitialDate}
                isEndDate={datePickerField === 'endDate'}
            />
        </>
    );
};
