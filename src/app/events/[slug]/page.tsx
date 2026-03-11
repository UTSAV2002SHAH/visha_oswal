"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DateBlock } from '@/components/ui/DateBlock';
import { getImageUrl } from '@/lib/image-utils';

interface EventDetail {
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
    location: string;
    tags: string[];
    link?: string;
    status: 'upcoming' | 'ongoing' | 'past';
}

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${params.slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setEvent(data);
                } else if (res.status === 404) {
                    setNotFound(true);
                }
            } catch (error) {
                console.error('Failed to fetch event:', error);
            } finally {
                setLoading(false);
            }
        };
        if (params.slug) fetchEvent();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 pb-20 px-4 max-w-4xl mx-auto animate-pulse">
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-6" />
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6" />
                <div className="space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
                </div>
            </div>
        );
    }

    if (notFound || !event) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Event Not Found</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => router.push('/events')}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors"
                >
                    ← Back to Events
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-20">
            {/* Banner Image */}
            <div className="relative w-full h-64 sm:h-80 lg:h-96">
                <img
                    src={getImageUrl(event.imageUrl)}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Back Button */}
                <button
                    onClick={() => router.push('/events')}
                    className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    ← Back
                </button>

                {/* Status Badge on Banner */}
                <div className="absolute bottom-4 left-4">
                    <StatusBadge status={event.status} />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        {event.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400">
                        <DateBlock startDate={event.startDate} endDate={event.endDate} />
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span>{event.location}</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {event.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Description */}
                    <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {event.description}
                        </p>
                    </div>

                    {/* External Link / CTA */}
                    {event.link && (
                        <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            Register Now
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
