"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { BellIcon } from '../ui/icons/BellIcon';
import { getImageUrl } from '@/lib/image-utils';
import { ProfileCompletionGuard } from '@/components/shared/ProfileCompletionGuard';
import { useProfileCompleteness } from '@/hooks/useProfileCompleteness';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

export const NotificationsPanel: React.FC = () => {
    const { user } = useAppContext();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const panelRef = useRef<HTMLDivElement>(null);
    const { isComplete } = useProfileCompleteness();
    const [isGuardOpen, setIsGuardOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetchWithAuth('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.isRead).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationAction = async (notificationId: string, action: 'accept' | 'reject') => {
        if (action === 'accept' && !isComplete) {
            setIsGuardOpen(true);
            return;
        }
        try {
        const res = await fetchWithAuth('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId, action })
            });

            if (res.ok) {
                toast.success(action === 'accept' ? 'Relationship accepted!' : 'Request ignored');
                fetchNotifications(); // Refresh list
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
            try {
                await fetchWithAuth('/api/notifications', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notificationId: notification._id, action: 'read' })
                });
                fetchNotifications();
            } catch (error) {
                console.error('Failed to mark as read', error);
            }
        }
        if (notification.type !== 'RELATIONSHIP_REQUEST' || notification.status !== 'PENDING') {
            setIsOpen(false);
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Button */}
            <button
                id="notifications-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
            >
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Mobile backdrop */}
                    <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsOpen(false)} />

                    <div className="
                        fixed left-0 right-0 bottom-0 z-50 
                        md:absolute md:left-auto md:right-0 md:bottom-auto md:top-full md:mt-2 
                        w-full md:w-80 
                        bg-white dark:bg-slate-900 
                        rounded-t-2xl md:rounded-xl 
                        shadow-2xl border-t md:border border-slate-100 dark:border-slate-800 
                        max-h-[80vh] md:max-h-[520px] 
                        flex flex-col
                        overflow-hidden
                    ">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Notifications</p>
                                {unreadCount > 0 && (
                                    <span className="text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold px-2 py-0.5 rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {/* Mobile close handle */}
                            <div className="md:hidden w-8 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2" />
                        </div>

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                <div className="p-2 space-y-1">
                                    {notifications.map((n) => (
                                        <div
                                            key={n._id}
                                            onClick={() => handleNotificationClick(n)}
                                            className={`flex flex-col gap-3 p-3 rounded-xl cursor-pointer transition-colors ${n.isRead
                                                ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-70'
                                                : 'bg-orange-50/20 dark:bg-orange-900/10 border-l-2 border-orange-500 hover:bg-orange-100/30 dark:hover:bg-orange-900/20'
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                    <img
                                                        src={getImageUrl(n.sender?.profilePictureUrl)}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(n.sender?.name || 'U')}&background=random` }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-snug">
                                                        <span className="font-bold">{n.sender?.name}</span> wants to add you as their{' '}
                                                        <span className="text-orange-600 dark:text-orange-400 font-bold">{n.metadata?.requestingRelation}</span>.
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                {!n.isRead && <div className="w-2 h-2 rounded-full bg-orange-500 mt-1 flex-shrink-0" />}
                                            </div>

                                            {/* Action Buttons for Relationship Requests */}
                                            {n.type === 'RELATIONSHIP_REQUEST' && (
                                                <div className="flex items-center gap-2 ml-12">
                                                    {n.status === 'PENDING' ? (
                                                        <>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleNotificationAction(n._id, 'accept'); }}
                                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleNotificationAction(n._id, 'reject'); }}
                                                                className="px-3 py-1 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-bold rounded-lg transition-colors"
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
                                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                        <BellIcon className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">You're all caught up!</p>
                                    <p className="text-xs text-slate-400 mt-1">No new notifications</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            <ProfileCompletionGuard
                isOpen={isGuardOpen}
                onClose={() => setIsGuardOpen(false)}
            />
        </div>
    );
};
