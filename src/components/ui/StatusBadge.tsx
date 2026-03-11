import React from 'react';

interface StatusBadgeProps {
    status: 'upcoming' | 'ongoing' | 'past';
}

const statusConfig = {
    ongoing: {
        label: 'Ongoing',
        bg: 'bg-emerald-100 dark:bg-emerald-900/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        dot: 'bg-emerald-500',
        animate: true,
    },
    upcoming: {
        label: 'Upcoming',
        bg: 'bg-blue-100 dark:bg-blue-900/40',
        text: 'text-blue-700 dark:text-blue-300',
        dot: 'bg-blue-500',
        animate: false,
    },
    past: {
        label: 'Past',
        bg: 'bg-slate-100 dark:bg-slate-700/50',
        text: 'text-slate-500 dark:text-slate-400',
        dot: 'bg-slate-400',
        animate: false,
    },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const config = statusConfig[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${config.animate ? 'animate-pulse' : ''}`} />
            {config.label}
        </span>
    );
};
