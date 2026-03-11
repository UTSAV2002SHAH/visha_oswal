"use client";

import React, { useState, useEffect } from 'react';
import { EventCard, EventCardData } from '@/components/features/events/EventCard';
import { EventFilterTabs } from '@/components/features/events/EventFilterTabs';
import { CalendarIcon } from '@/components/ui/icons/CalendarIcon';

type EventStatus = 'all' | 'ongoing' | 'upcoming' | 'past';

export default function EventsPage() {
    const [events, setEvents] = useState<EventCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<EventStatus>('all');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = activeTab === 'all'
        ? events
        : events.filter((e) => e.status === activeTab);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Events</h1>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Stay updated with ongoing and upcoming events.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="mb-8">
                <EventFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Event Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse">
                            <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.slug} event={event} />
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                        <CalendarIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        No events found
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {activeTab === 'all'
                            ? 'There are no events to display right now.'
                            : `No ${activeTab} events at the moment.`}
                    </p>
                </div>
            )}
        </div>
    );
}
