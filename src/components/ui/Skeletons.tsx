import React from 'react';

// Base shimmer wrapper
const Shimmer = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`} />
);

// Circle shimmer
const Circle = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
    const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-24 h-24' };
    return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0 ${sizes[size]}`} />;
};

// --- Profile Header Skeleton ---
export const ProfileHeaderSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden mb-6 border border-transparent dark:border-slate-700">
        {/* Banner */}
        <div className="h-32 sm:h-48 bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="p-6 relative">
            {/* Avatar overlapping banner */}
            <div className="absolute -top-10 sm:-top-14 left-6 w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-600 animate-pulse" />
            <div className="mt-10 sm:mt-14 space-y-2">
                <Shimmer className="h-6 w-40" />
                <Shimmer className="h-4 w-52" />
                <Shimmer className="h-4 w-24" />
            </div>
        </div>
    </div>
);

// --- Feed Post Card Skeleton ---
export const PostCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 space-y-4">
        <div className="flex items-center gap-3">
            <Circle size="md" />
            <div className="space-y-2 flex-1">
                <Shimmer className="h-4 w-1/3" />
                <Shimmer className="h-3 w-1/4" />
            </div>
        </div>
        <div className="space-y-2">
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-5/6" />
            <Shimmer className="h-3 w-3/4" />
        </div>
        {/* Optional image placeholder */}
        <Shimmer className="h-48 w-full rounded-xl" />
        <div className="flex gap-4 pt-1">
            <Shimmer className="h-8 w-16 rounded-full" />
            <Shimmer className="h-8 w-20 rounded-full" />
        </div>
    </div>
);

// --- Feed Skeleton (multiple cards) ---
export const FeedSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => <PostCardSkeleton key={i} />)}
    </div>
);

// --- About Section Skeleton ---
export const AboutSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 space-y-3">
        <Shimmer className="h-5 w-24" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-5/6" />
        <Shimmer className="h-3 w-4/6" />
    </div>
);

// --- Experience/Education Item Skeleton ---
export const ExperienceItemSkeleton: React.FC = () => (
    <div className="flex gap-3">
        <Circle size="md" />
        <div className="flex-1 space-y-1.5">
            <Shimmer className="h-4 w-2/5" />
            <Shimmer className="h-3 w-1/3" />
            <Shimmer className="h-3 w-1/4" />
        </div>
    </div>
);

export const SectionSkeleton: React.FC<{ items?: number }> = ({ items = 2 }) => (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 space-y-5">
        <Shimmer className="h-5 w-32" />
        {Array.from({ length: items }).map((_, i) => (
            <React.Fragment key={i}>
                {i > 0 && <div className="border-t border-slate-100 dark:border-slate-800" />}
                <ExperienceItemSkeleton />
            </React.Fragment>
        ))}
    </div>
);

// --- Full Profile Overview Skeleton ---
export const ProfileOverviewSkeleton: React.FC = () => (
    <div className="space-y-4">
        <AboutSkeleton />
        <SectionSkeleton items={2} />
        <SectionSkeleton items={1} />
    </div>
);
