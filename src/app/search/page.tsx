"use client";

import React, { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import { SearchFilters } from '@/components/features/search/SearchFilters';
import { SearchResultCard } from '@/components/features/search/SearchResultCard';
import { toast } from 'react-hot-toast';

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState({
        originCity: "",
        currentCity: ""
    });
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const handleSearch = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // If everything is empty, don't trigger search
        if (!query.trim() && !filters.originCity.trim() && !filters.currentCity.trim()) {
            toast.error("Please enter a name or choose a filter to search");
            return;
        }

        setIsLoading(true);
        setHasSearched(true);
        // On mobile, hide filters after searching to show results
        setShowMobileFilters(false);

        try {
            const params = new URLSearchParams();
            if (query.trim()) params.set("q", query.trim());
            if (filters.originCity.trim()) params.set("originCity", filters.originCity.trim());
            if (filters.currentCity.trim()) params.set("currentCity", filters.currentCity.trim());

            const response = await fetch(`/api/users/search?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setResults(data.data);
            } else {
                toast.error("Failed to fetch search results");
            }
        } catch (error) {
            console.error("Search fetch error:", error);
            toast.error("Something went wrong with the search");
        } finally {
            setIsLoading(false);
        }
    }, [query, filters.originCity, filters.currentCity]);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setQuery("");
        setFilters({ originCity: "", currentCity: "" });
        setResults([]);
        setHasSearched(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-4 py-6 sm:py-8 mt-16">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    {/* Filters Section */}
                    <aside className="w-full lg:w-1/4">
                        {/* Mobile Filter Toggle Button */}
                        <div className="lg:hidden flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Search Results</h2>
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm active:bg-gray-50"
                            >
                                <svg className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                {showMobileFilters ? "Hide Filters" : "Show Filters"}
                            </button>
                        </div>

                        {/* Filters Container */}
                        <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block transition-all`}>
                            <SearchFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClear={handleClearFilters}
                            />
                            <button
                                onClick={() => handleSearch()}
                                disabled={isLoading}
                                className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Apply Filters & Search
                                    </>
                                )}
                            </button>
                        </div>
                    </aside>

                    {/* Search Results Area */}
                    <div className="w-full lg:w-3/4">
                        {/* Search Input Bar - More prominent on mobile */}
                        <form onSubmit={handleSearch} className="relative mb-6 sm:mb-8 group">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full px-12 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium placeholder:text-gray-400"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 rounded-xl font-bold text-sm sm:text-base transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? "..." : "Search"}
                            </button>
                        </form>

                        {/* Mobile Quick Summary */}
                        {hasSearched && !isLoading && !showMobileFilters && (
                            <div className="lg:hidden mb-4 flex justify-between items-center text-xs font-medium text-gray-500 bg-gray-100/50 px-3 py-2 rounded-lg">
                                <span>{results.length} people found</span>
                                {(filters.originCity || filters.currentCity) && (
                                    <span className="text-orange-600">Filters active</span>
                                )}
                            </div>
                        )}

                        {/* Results Grid */}
                        <div className="space-y-3 sm:space-y-4">
                            {!hasSearched && (
                                <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-dashed border-gray-300">
                                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Start Exploring Other Users</h3>
                                    <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto">
                                        Type a name or use the filters to find family members and friends.
                                    </p>
                                </div>
                            )}

                            {hasSearched && !isLoading && results.length === 0 && (
                                <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100">
                                    <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg">No users found.</p>
                                    <button onClick={handleClearFilters} className="mt-4 text-orange-600 hover:underline font-medium text-sm">Clear all filters</button>
                                </div>
                            )}

                            {results.map((profile: any) => (
                                <SearchResultCard key={profile.userId} user={profile} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
