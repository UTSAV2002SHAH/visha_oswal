import React from 'react';
import { Experience } from '@/types/profile';
import { ExperienceItem } from './ExperienceItem';

interface ExperienceListProps {
    experiences: Experience[];
    onEditItem: (experience: Experience) => void;
}

export const ExperienceList: React.FC<ExperienceListProps> = ({ experiences, onEditItem }) => {
    return (
        <div className="space-y-6">
            {experiences.map((job) => (
                <ExperienceItem
                    key={job._id}
                    experience={job}
                    onEdit={onEditItem}
                />
            ))}
        </div>
    );
};
