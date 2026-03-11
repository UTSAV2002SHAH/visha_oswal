"use client";

import React from 'react';

interface ProfileCompletionGuardProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileCompletionGuard: React.FC<ProfileCompletionGuardProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Complete Your Profile</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
                        "Finish your Personal Info Section"
                    </p>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full flex items-center justify-center mx-auto transition-colors"
                        aria-label="Close"
                    >
                        <span className="text-xl font-bold text-slate-600 dark:text-slate-300">X</span>
                    </button>
                    <p className="text-xs text-slate-400 mt-4 italic">
                        Click X to close this message
                    </p>
                </div>
            </div>
        </div>
    );
};
