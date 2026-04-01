"use client";

import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

interface ProfilePostCardProps {
    post: {
        _id: string;
        content: string;
        imageUrl: string;
        likesCount: number;
        createdAt: string;
    };
    onDelete?: (id: string) => void;
    onEdit?: (post: any) => void;
}

const ProfilePostCard: React.FC<ProfilePostCardProps> = ({ post, onDelete, onEdit }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetchWithAuth(`/api/posts/${post._id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success("Post deleted successfully");
                if (onDelete) onDelete(post._id);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to delete post");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Something went wrong while deleting");
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Minimal Header for Profile */}
            <div className="p-4 flex items-center justify-between border-b border-slate-50">
                <span className="text-xs font-medium text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 animate-in fade-in zoom-in duration-75">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    if (onEdit) onEdit(post);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                                Edit post
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Delete post
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-3">
                <p className="text-slate-800 text-sm whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Image */}
            <div className="w-full bg-slate-50 aspect-video relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.imageUrl} alt="Post content" className="w-full h-auto max-h-[400px] object-cover" />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <button className="flex items-center gap-1.5 text-slate-600 hover:text-saffron-600 transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    <span className="text-sm font-medium">{post.likesCount} <span className="hidden sm:inline">Likes</span></span>
                </button>
            </div>
        </div>
    );
};

export default ProfilePostCard;
