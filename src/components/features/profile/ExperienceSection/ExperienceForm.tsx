import React from 'react';
import { CompanyAutocomplete, Company } from '@/components/ui/CompanyAutocomplete';
import { FormInput } from '../shared/FormInput';
import { FormButtonControls } from '../shared/FormButtonControls';
import { Experience } from '@/types/profile';
import { formatDate } from '@/utils/profileUtils';

interface ExperienceFormProps {
    formData: Omit<Experience, '_id'> & { _id?: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCompanySelect: (company: Company) => void;
    onDateClick: (field: 'startDate' | 'endDate', currentDate: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete?: () => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
    formData,
    onChange,
    onCompanySelect,
    onDateClick,
    onSave,
    onCancel,
    onDelete
}) => {
    return (
        <div className="space-y-4">
            <CompanyAutocomplete
                label="Company Name *"
                value={formData.company || ''}
                onValueChange={(value) => onChange({ target: { name: 'company', value } } as any)}
                onSelect={onCompanySelect}
                placeholder="e.g., Google"
            />
            <FormInput
                name="title"
                label="Role / Title *"
                value={formData.title || ''}
                onChange={onChange}
                placeholder="e.g., Senior Frontend Engineer"
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                    <button
                        onClick={() => onDateClick('startDate', formData.startDate)}
                        className="mt-1 block w-full text-left px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                        {formatDate(formData.startDate, 'full')}
                    </button>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <button
                        onClick={() => onDateClick('endDate', formData.endDate || '')}
                        disabled={formData.isCurrent}
                        className="mt-1 block w-full text-left px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                        {formData.isCurrent ? 'Present' : formatDate(formData.endDate || '', 'full')}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
                <input
                    type="checkbox"
                    id="isCurrentExperience"
                    name="isCurrent"
                    checked={formData.isCurrent}
                    onChange={onChange}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="isCurrentExperience" className="text-sm font-medium text-gray-700">I currently work here</label>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={onChange}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
            </div>

            <FormButtonControls
                onCancel={onCancel}
                onSave={onSave}
                onDelete={onDelete}
            />
        </div>
    );
};
