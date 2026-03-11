import React from 'react';

interface FormInputProps {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    required?: boolean;
}

/**
 * Reusable form input component with consistent styling
 */
export const FormInput: React.FC<FormInputProps> = ({
    name,
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    disabled = false,
    required = false,
}) => {
    return (
        <div className="flex-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
                {required && <span className="text-orange-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-gray-900 dark:text-white transition-colors duration-200"
            />
        </div>
    );
};
