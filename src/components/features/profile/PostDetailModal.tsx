"use client";

import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';
import { useAppContext } from '@/context/AppContext';

interface Post {
    _id: string;
    content: string;
    imageUrl: string;
    likesCount: number;
    commentsCount?: number;
    createdAt: string;
}

interface PostDetailModalProps {
    post: Post;
    isOpen: boolean;
    onClose: () => void;
    onDelete?: (postId: string) => void;
    onEdit?: (post: Post) => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, isOpen, onClose, onDelete, onEdit }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const { user } = useAppContext();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Close on click outside or Escape key
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/posts/${post._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success("Post deleted");
                if (onDelete) onDelete(post._id);
                onClose();
            } else {
                toast.error("Failed to delete post");
            }
        } catch (error) {
            toast.error("Error deleting post");
        }
    };

    if (!isOpen || !mounted) return null;

    // Helper for avatar/placeholder
    const firstInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Clickable background to close */}
            <div className="absolute inset-0 z-0" onClick={onClose} />

            {/* Close button (Desktop) */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-all hidden lg:block z-[100001] p-2"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div
                ref={modalRef}
                className="relative z-[100000] bg-white w-[94%] max-w-5xl h-[85dvh] lg:h-[80dvh] rounded-3xl overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] flex flex-col md:flex-row animate-in zoom-in-[0.98] duration-300 ease-out"
            >
                {/* Left Side: Image Container (Seamless border fix) */}
                <div className="h-[45%] md:h-full md:flex-[3] bg-black flex items-center justify-center overflow-hidden border-r border-slate-100">
                    <img
                        src={post.imageUrl}
                        alt="Post detail"
                        className="w-full h-full object-contain pointer-events-none select-none"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=Image+Not+Available';
                        }}
                    />
                </div>

                {/* Right Side: Details Pane */}
                <div className="h-[55%] md:h-full md:flex-[2] flex flex-col bg-white min-w-0">
                    {/* Header (Orange Area: Profile + Caption + Actions) */}
                    <header className="px-5 py-4 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white">
                        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                            {/* User Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-saffron-500 to-orange-400 p-[2px] shadow-sm flex-shrink-0">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    {user?.profilePictureUrl ? (
                                        <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-saffron-600 text-sm font-black">{firstInitial}</span>
                                    )}
                                </div>
                            </div>

                            {/* User Info & Caption */}
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-black text-slate-900 leading-none truncate mb-1">
                                    {user?.name || 'You'}
                                </span>
                                <span className="text-xs text-slate-600 font-medium truncate leading-normal" title={post.content}>
                                    {post.content}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                                onClick={() => onEdit?.(post)}
                                className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-saffron-600 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                            <button onClick={onClose} className="p-2 md:hidden text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </header>

                    {/* Scroll Area (Green Area: Comments ONLY) */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-7 custom-scrollbar bg-white min-h-0">
                        <div className="py-12 flex flex-col items-center justify-center text-slate-300 pointer-events-none select-none">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Comments</p>
                            <div className="w-12 h-0.5 bg-slate-50 rounded-full" />
                            <p className="text-xs font-bold text-slate-300 mt-6">No comments yet</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="p-5 md:p-6 border-t border-slate-50 bg-white shrink-0 mt-auto">
                        <div className="flex items-center gap-5 mb-4">
                            <button className="text-slate-900 hover:text-saffron-500 transition-all hover:scale-125 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            </button>
                            <button className="text-slate-900 hover:text-blue-500 transition-all hover:scale-125 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785 0.534 0.534 0 0 0 .416.858 6.603 6.603 0 0 0 4.226-1.751 0.49 0.49 0 0 1 .33-.143c.13 0 .26.031.379.092 1.248.641 2.665.991 4.12.991Z" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[14px] font-black text-slate-900 tracking-tight">{post.likesCount} likes</p>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                                {new Date(post.createdAt).toLocaleDateString(undefined, {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default PostDetailModal;
