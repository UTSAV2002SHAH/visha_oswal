"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { HomeIcon } from '../ui/icons/HomeIcon';
import { CreateIcon } from '../ui/icons/CreateIcon';
import { SearchIcon } from '../ui/icons/SearchIcon';
import { UserIcon } from '../ui/icons/UserIcon';
import { CalendarIcon } from '../ui/icons/CalendarIcon';
import { getImageUrl } from '@/lib/image-utils';

export const BottomNav: React.FC = () => {
    const { isLoggedIn, user, openCreatePostModal } = useAppContext();
    const router = useRouter();
    const pathname = usePathname();

    if (!isLoggedIn) return null;

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 safe-area-pb">
            <div className="flex items-center justify-around h-16 px-2">
                {/* Home */}
                <button
                    onClick={() => router.push('/')}
                    className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${isActive('/') ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    aria-label="Home"
                >
                    <HomeIcon className="w-5 h-5" />
                    <span className="text-[9px] font-semibold tracking-wide">Home</span>
                </button>

                {/* Search */}
                <button
                    onClick={() => router.push('/search')}
                    className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${isActive('/search') ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    aria-label="Search"
                >
                    <SearchIcon className="w-5 h-5" />
                    <span className="text-[9px] font-semibold tracking-wide">Search</span>
                </button>

                {/* Create — prominent center button */}
                <button
                    onClick={() => openCreatePostModal()}
                    className="flex flex-col items-center justify-center -mt-5 flex-shrink-0"
                    aria-label="Create Post"
                >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-transform">
                        <CreateIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[9px] font-semibold tracking-wide text-slate-400 mt-1">Create</span>
                </button>

                {/* Events */}
                <button
                    onClick={() => router.push('/events')}
                    className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${isActive('/events') ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    aria-label="Events"
                >
                    <CalendarIcon className="w-5 h-5" />
                    <span className="text-[9px] font-semibold tracking-wide">Events</span>
                </button>

                {/* Profile */}
                <button
                    onClick={() => router.push('/profile')}
                    className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${(isActive('/profile') || isActive('/settings')) ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    aria-label="My Profile"
                >
                    <div className={`w-6 h-6 rounded-full overflow-hidden ${(isActive('/profile') || isActive('/settings')) ? 'ring-2 ring-orange-500 ring-offset-1' : ''}`}>
                        {user?.profilePictureUrl ? (
                            <img src={getImageUrl(user.profilePictureUrl)} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                            </div>
                        )}
                    </div>
                    <span className="text-[9px] font-semibold tracking-wide">Me</span>
                </button>
            </div>
        </nav>
    );
};
