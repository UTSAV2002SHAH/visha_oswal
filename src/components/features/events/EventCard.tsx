"use client";

import React from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DateBlock } from '@/components/ui/DateBlock';
import { getImageUrl } from '@/lib/image-utils';

export interface EventCardData {
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
    location: string;
    tags: string[];
    status: 'upcoming' | 'ongoing' | 'past';
}

interface EventCardProps {
    event: EventCardData;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <Link
            href={`/events/${event.slug}`}
            className="group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            {/* Banner Image */}
            <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img
                    src={getImageUrl(event.imageUrl)}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                    }}
                />
                {/* Status Badge Overlay */}
                <div className="absolute top-3 left-3">
                    <StatusBadge status={event.status} />
                </div>
            </div>

            {/* Content — kept clean and minimal */}
            <div className="p-3 sm:p-4 space-y-2">
                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {event.title}
                </h3>

                {/* Date & Location — stacked on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <DateBlock startDate={event.startDate} endDate={event.endDate} />
                    <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                    <span className="truncate flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0 sm:hidden">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {event.location}
                    </span>
                </div>

                {/* CTA */}
                <div className="pt-1">
                    <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 group-hover:underline">
                        Learn More →
                    </span>
                </div>
            </div>
        </Link>
    );
};
