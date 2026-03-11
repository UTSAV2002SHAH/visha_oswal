"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { LogoutIcon } from '../ui/icons/LogoutIcon';
import { ThemeToggle } from './ThemeToggle';
import toast from 'react-hot-toast';

// Simple inline Settings / Gear icon
const SettingsIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const SettingsMenu: React.FC = () => {
    const { user, setIsLoggedIn } = useAppContext();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/');
        toast.success("Logged out successfully");
        setIsOpen(false);
    };

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            {/* Gear Button */}
            <button
                id="settings-btn"
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors ${isOpen
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                aria-label="Settings"
            >
                <SettingsIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
            </button>

            {/* Settings Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 overflow-hidden">
                    {/* User info mini header */}
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">@{user.username || user.email}</p>
                    </div>

                    {/* Theme Row */}
                    <div className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <span className="text-sm text-slate-700 dark:text-slate-300">App Theme</span>
                        <ThemeToggle />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    {/* Sign Out */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
                    >
                        <LogoutIcon className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};
