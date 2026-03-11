"use client";

import React from 'react';

interface SearchFiltersProps {
    filters: {
        originCity: string;
        currentCity: string;
    };
    onFilterChange: (name: string, value: string) => void;
    onClear: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange, onClear }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:sticky lg:top-24">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                <button
                    onClick={onClear}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-6">
                {/* Origin City */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City of Origin</label>
                    <input
                        type="text"
                        placeholder="e.g. Ahmedabad"
                        value={filters.originCity}
                        onChange={(e) => onFilterChange('originCity', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                </div>

                {/* Current City */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current City</label>
                    <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={filters.currentCity}
                        onChange={(e) => onFilterChange('currentCity', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};
