"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { LogoutIcon } from '@/components/ui/icons/LogoutIcon';
import { BellIcon } from '@/components/ui/icons/BellIcon';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { getImageUrl } from '@/lib/image-utils';
import toast from 'react-hot-toast';

// Inline icons
const ChevronRight = () => (
    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const ArrowLeft = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

export default function SettingsPage() {
    const { user, setIsLoggedIn } = useAppContext();
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoadingNotifs, setIsLoadingNotifs] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('/api/notifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data);
                    setUnreadCount(data.filter((n: any) => !n.isRead).length);
                }
            } catch (e) { /* silent */ } finally {
                setIsLoadingNotifs(false);
            }
        };
        fetchNotifications();
    }, []);

    const handleNotificationAction = async (notificationId: string, action: 'accept' | 'reject') => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notificationId, action })
            });

            if (res.ok) {
                toast.success(action === 'accept' ? 'Request accepted!' : 'Request rejected');
                // Refresh notifications
                const fetchRes = await fetch('/api/notifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (fetchRes.ok) {
                    const data = await fetchRes.json();
                    setNotifications(data);
                    setUnreadCount(data.filter((n: any) => !n.isRead).length);
                }
            } else {
                const errorData = await res.json();
                toast.error(errorData.msg || 'Action failed');
            }
        } catch (e) {
            toast.error('Failed to process action');
        }
    };

    const handleNotificationClick = async (notification: any) => {
        if (notification.type === 'RELATIONSHIP_REQUEST' && notification.status !== 'PENDING') {
            router.push('/profile?tab=family');
        }
        if (!notification.isRead) {
            const token = localStorage.getItem('token');
            try {
                await fetch('/api/notifications', {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notificationId: notification._id, action: 'read' })
                });
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
            } catch (e) { /* silent */ }
        }
    };

    const handleLogout = () => {
        if (!confirm('Are you sure you want to sign out?')) return;
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/');
        toast.success('Logged out successfully');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16 pb-24 sm:pb-8">
            <div className="max-w-2xl mx-auto px-4 py-6">

                {/* Page Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                    >
                        <ArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                </div>

                {/* User Info Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 mb-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-100 dark:border-orange-900">
                        {user.profilePictureUrl ? (
                            <img src={getImageUrl(user.profilePictureUrl)} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">{user.name?.charAt(0)?.toUpperCase()}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{user.name}</p>
                        <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">@{user.username || 'username_not_set'}</p>
                        <button
                            onClick={() => router.push('/profile')}
                            className="text-xs text-slate-400 font-medium mt-1 hover:text-slate-600 dark:hover:text-slate-200 hover:underline"
                        >
                            View Profile
                        </button>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1 mb-2">Appearance</p>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">App Theme</p>
                                <p className="text-xs text-slate-400 mt-0.5">Switch between light and dark mode</p>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 px-1 mb-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Notifications</p>
                        {unreadCount > 0 && (
                            <span className="text-[9px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        {isLoadingNotifs ? (
                            <div className="p-5 space-y-3">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse flex-shrink-0" />
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
                                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`flex flex-col gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!n.isRead ? 'bg-orange-50/10 dark:bg-orange-900/5' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={getImageUrl(n.sender?.profilePictureUrl)}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(n.sender?.name || 'U')}&background=random` }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
                                                    <span className="font-semibold">{n.sender?.name}</span> wants to add you as their{' '}
                                                    <span className="text-orange-600 dark:text-orange-400 font-semibold">{n.metadata?.requestingRelation}</span>.
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            {!n.isRead && <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />}
                                        </div>

                                        {/* Action Buttons for Relationship Requests */}
                                        {n.type === 'RELATIONSHIP_REQUEST' && (
                                            <div className="flex items-center gap-2 ml-12">
                                                {n.status === 'PENDING' ? (
                                                    <>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleNotificationAction(n._id, 'accept'); }}
                                                            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleNotificationAction(n._id, 'reject'); }}
                                                            className="px-4 py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${n.status === 'ACCEPTED' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                        {n.status === 'ACCEPTED' ? 'Accepted' : 'Rejected'}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-12 text-center px-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                    <BellIcon className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">You're all caught up!</p>
                                <p className="text-xs text-slate-400 mt-1">No new notifications</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Section */}
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1 mb-2">Account</p>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-5 py-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                            <LogoutIcon className="w-5 h-5" />
                            <span className="text-sm font-semibold flex-1 text-left">Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* App Version */}
                <p className="text-center text-xs text-slate-400 mt-8">Visha Oswal Community · v1.0</p>
            </div>
        </div>
    );
}
