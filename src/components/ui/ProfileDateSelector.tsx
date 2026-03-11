"use client";

import React, { useState, useEffect } from 'react';

interface ProfileDateSelectorProps {
    value?: string;
    onSelect: (date: string) => void;
}

export const ProfileDateSelector: React.FC<ProfileDateSelectorProps> = ({ value, onSelect }) => {
    // Current date values
    const initialDate = value ? new Date(value) : null;

    const [day, setDay] = useState(initialDate ? initialDate.getUTCDate().toString() : '');
    const [month, setMonth] = useState(initialDate ? (initialDate.getUTCMonth() + 1).toString() : '');
    const [year, setYear] = useState(initialDate ? initialDate.getUTCFullYear().toString() : '');

    // Generate options
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1925 + 1 }, (_, i) => (currentYear - i).toString());

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        if (day && month && year) {
            // Create a date string in YYYY-MM-DD format
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            // Only trigger if it's different from the current value to avoid infinite loops
            if (formattedDate !== value) {
                onSelect(formattedDate);
            }
        }
    }, [day, month, year, onSelect, value]);

    return (
        <div className="grid grid-cols-3 gap-2">
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Day</label>
                <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-white"
                >
                    <option value="">DD</option>
                    {days.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Month</label>
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-white"
                >
                    <option value="">Month</option>
                    {months.map(m => (
                        <option key={m} value={m}>{monthNames[parseInt(m) - 1]}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Year</label>
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-white"
                >
                    <option value="">YYYY</option>
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
