"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SpinnerIcon } from '../../ui/icons/SpinnerIcon';

type RelationType = 'father' | 'mother' | 'spouse' | 'sibling' | 'child';

interface FamilyMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    relationType: RelationType;
    onSuccess: () => void;
}

export const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({ isOpen, onClose, relationType, onSuccess }) => {
    const [entryMode, setEntryMode] = useState<'platform' | 'manual'>('platform');
    const [isLoading, setIsLoading] = useState(false);

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Platform User State
    const [searchUsername, setSearchUsername] = useState("");
    const [foundUser, setFoundUser] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Manual Entry State
    const [manualName, setManualName] = useState("");

    const getTitle = () => {
        switch (relationType) {
            case 'father': return 'Add Father';
            case 'mother': return 'Add Mother';
            case 'spouse': return 'Add Spouse';
            case 'sibling': return 'Add Sibling';
            case 'child': return 'Add Child';
        }
    };

    const handleSearchUser = async () => {
        if (!searchUsername.trim()) return;
        setIsSearching(true);
        setFoundUser(null);
        try {
            const res = await fetch(`/api/users/profile/${searchUsername.trim()}`);
            if (res.ok) {
                const data = await res.json();
                setFoundUser(data);
            } else {
                toast.error("User not found on the platform.");
            }
        } catch (error) {
            toast.error("Error searching for user.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSave = async () => {
        let payload: any = {};

        if (entryMode === 'platform') {
            if (!foundUser) {
                toast.error("Please search and select a platform user first.");
                return;
            }
            payload = {
                type: relationType === 'father' || relationType === 'mother' ? relationType : undefined,
                user: foundUser._id,
                name: foundUser.name,
            };
        } else {
            if (!manualName.trim()) {
                toast.error("Please enter a name for the family member.");
                return;
            }
            payload = {
                type: relationType === 'father' || relationType === 'mother' ? relationType : undefined,
                user: null, // Manual entries have no user ID
                name: manualName.trim(),
            };
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpointMap: Record<RelationType, string> = {
                father: 'parents',
                mother: 'parents',
                spouse: 'spouse',
                sibling: 'siblings',
                child: 'children'
            };

            const url = `/api/member-profile/family/${endpointMap[relationType]}`;

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Family member added successfully!");
                if (entryMode === 'platform') {
                    toast.success("A relationship request has been sent to the user.");
                }
                onSuccess();
                onClose();
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to add family member");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{getTitle()}</h2>

                {/* Entry Mode Toggle */}
                <div className="flex rounded-md shadow-sm mb-6" role="group">
                    <button type="button" onClick={() => setEntryMode('platform')} className={`px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-l-lg hover:bg-slate-50 dark:hover:bg-slate-800 ${entryMode === 'platform' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-200 dark:border-orange-800 z-10 ring-1 ring-orange-500' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'}`}>
                        Platform Member
                    </button>
                    <button type="button" onClick={() => setEntryMode('manual')} className={`px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-r-lg hover:bg-slate-50 dark:hover:bg-slate-800 ${entryMode === 'manual' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-200 dark:border-orange-800 z-10 ring-1 ring-orange-500' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'}`}>
                        Enter Manually
                    </button>
                </div>

                {entryMode === 'platform' ? (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Search by Username</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchUsername}
                                onChange={(e) => setSearchUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()}
                                placeholder="e.g. utsav_shah"
                                className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                            />
                            <button
                                onClick={handleSearchUser}
                                disabled={isSearching}
                                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {isSearching ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : "Search"}
                            </button>
                        </div>

                        {foundUser && (
                            <div className="mt-4 p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-lg flex items-center gap-4">
                                <img src={foundUser.profilePictureUrl || 'https://via.placeholder.com/48'} className="w-12 h-12 rounded-full object-cover" alt="Profile" />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">{foundUser.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">@{foundUser.username}</p>
                                </div>
                            </div>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                            A relationship request will be sent to this user. They must accept it before they appear publicly on your tree.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                        <input
                            type="text"
                            value={manualName}
                            onChange={(e) => setManualName(e.target.value)}
                            placeholder="Enter their full name"
                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Manual entries appear immediately on your tree but are not linked to any user profile.
                        </p>
                    </div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading || (entryMode === 'platform' && !foundUser) || (entryMode === 'manual' && !manualName.trim())}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && <SpinnerIcon className="w-4 h-4 animate-spin" />}
                        Add {getTitle().replace('Add ', '')}
                    </button>
                </div>
            </div>
        </div>
    );
};
