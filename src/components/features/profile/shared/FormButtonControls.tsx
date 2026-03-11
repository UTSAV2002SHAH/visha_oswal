import React from 'react';

interface FormButtonControlsProps {
    onCancel: () => void;
    onSave: () => void;
    onDelete?: () => void;
    saveLabel?: string;
    cancelLabel?: string;
    deleteLabel?: string;
}

/**
 * Reusable form button controls (Cancel, Save, Delete)
 * Provides consistent button styling and layout
 */
export const FormButtonControls: React.FC<FormButtonControlsProps> = ({
    onCancel,
    onSave,
    onDelete,
    saveLabel = 'Save',
    cancelLabel = 'Cancel',
    deleteLabel = 'Delete',
}) => {
    return (
        <div className="flex justify-end gap-3 pt-4">
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="border border-red-400 text-red-500 font-semibold px-5 py-2 rounded-full hover:bg-red-50 transition-colors mr-auto"
                >
                    {deleteLabel}
                </button>
            )}
            <button
                onClick={onCancel}
                className="border border-gray-400 text-gray-600 font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                {cancelLabel}
            </button>
            <button
                onClick={onSave}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold px-6 py-2 rounded-full hover:scale-105 transition-transform duration-200"
            >
                {saveLabel}
            </button>
        </div>
    );
};
