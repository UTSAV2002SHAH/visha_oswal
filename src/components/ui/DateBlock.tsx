import React from 'react';

interface DateBlockProps {
    startDate: string;
    endDate?: string;
}

export const DateBlock: React.FC<DateBlockProps> = ({ startDate, endDate }) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    const day = start.getDate();
    const month = start.toLocaleDateString('en-US', { month: 'short' });

    // Check if multi-day event
    const isMultiDay = end && start.toDateString() !== end.toDateString();
    const endDay = end ? end.getDate() : null;
    const endMonth = end ? end.toLocaleDateString('en-US', { month: 'short' }) : null;

    return (
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {isMultiDay ? (
                <span>
                    {month} {day} – {endMonth === month ? '' : `${endMonth} `}{endDay}
                </span>
            ) : (
                <span>{month} {day}</span>
            )}
        </div>
    );
};
