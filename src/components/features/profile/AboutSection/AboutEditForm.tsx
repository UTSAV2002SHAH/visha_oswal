import React from 'react';
import { FormButtonControls } from '../shared/FormButtonControls';

interface AboutEditFormProps {
    value: string;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

/**
 * Edit form for About section
 * Textarea with save/cancel controls
 */
export const AboutEditForm: React.FC<AboutEditFormProps> = ({
    value,
    onChange,
    onSave,
    onCancel,
}) => {
    return (
        <div className="space-y-4">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-48 p-3 bg-white border border-orange-500 rounded-md focus:ring-2 focus:ring-orange-500 transition-shadow duration-200 ease-in-out text-gray-800"
                aria-label="Edit about section"
                placeholder="Tell us about yourself..."
            />
            <FormButtonControls onCancel={onCancel} onSave={onSave} />
        </div>
    );
};
