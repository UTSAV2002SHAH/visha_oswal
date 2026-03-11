import React from 'react';

interface ProfileSectionCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    showAdd?: boolean;
    showEdit?: boolean;
    isFormOpen?: boolean;
    onAddClick?: () => void;
    onEditClick?: () => void;
}

/**
 * Reusable card wrapper for profile sections
 * Provides consistent styling and edit/add button placement
 */
export const ProfileSectionCard: React.FC<ProfileSectionCardProps> = ({
    title,
    icon,
    children,
    showAdd = false,
    showEdit = true,
    isFormOpen = false,
    onAddClick,
    onEditClick,
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 transition-colors duration-300 border border-transparent dark:border-slate-700">
            <header className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-gray-500 dark:text-gray-400">{icon}</span>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{title}</h2>
                </div>
                {!isFormOpen && (
                    <div className="flex items-center gap-4">
                        {showAdd && (
                            <button
                                onClick={onAddClick}
                                className="text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all transform hover:scale-125"
                                aria-label={`Add new ${title}`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        )}
                        {showEdit && (
                            <button
                                onClick={onEditClick}
                                className="text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all transform hover:scale-125"
                                aria-label={`Edit ${title}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </header>
            <div>{children}</div>
        </div>
    );
};
