import React from 'react';

interface AboutDisplayProps {
    text: string;
}

/**
 * Read-only display of About section
 * Shows placeholder text if empty
 */
export const AboutDisplay: React.FC<AboutDisplayProps> = ({ text }) => {
    return (
        <p className="text-gray-700 whitespace-pre-line">
            {text || 'Tell us about yourself...'}
        </p>
    );
};
