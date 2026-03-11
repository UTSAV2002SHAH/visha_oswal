"use client";

import React from 'react';

type EventStatus = 'all' | 'ongoing' | 'upcoming' | 'past';

interface EventFilterTabsProps {
    activeTab: EventStatus;
    onTabChange: (tab: EventStatus) => void;
}

const tabs: { key: EventStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'ongoing', label: 'Ongoing' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
];

export const EventFilterTabs: React.FC<EventFilterTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-fit">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${activeTab === tab.key
                        ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
