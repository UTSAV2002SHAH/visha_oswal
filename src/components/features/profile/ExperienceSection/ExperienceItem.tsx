import React from 'react';
import { PencilIcon } from '@/components/ui/icons/PencilIcon';
import { Experience } from '@/types/profile';
import { getDurationString } from '@/utils/profileUtils';

interface ExperienceItemProps {
    experience: Experience;
    onEdit: (experience: Experience) => void;
}

export const ExperienceItem: React.FC<ExperienceItemProps> = ({ experience, onEdit }) => {
    return (
        <div className="flex gap-4 group/item">
            <img
                src={experience.logo || 'https://via.placeholder.com/48'}
                alt={`${experience.company} logo`}
                className="w-12 h-12 object-contain mt-1"
            />
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-800">{experience.title}</h3>
                <p className="text-md text-gray-600">{experience.company}</p>
                <p className="text-sm text-gray-500">{getDurationString(experience)}</p>
                <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{experience.description}</p>
            </div>
            <button
                onClick={() => onEdit(experience)}
                className="text-gray-400 hover:text-orange-600 transition-colors opacity-0 group-hover/item:opacity-100"
                aria-label={`Edit ${experience.title}`}
            >
                <PencilIcon className="w-5 h-5" />
            </button>
        </div>
    );
};
