"use client";

import React, { useState, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { CloseIcon } from '../../ui/icons/CloseIcon';
import { SpinnerIcon } from '../../ui/icons/SpinnerIcon';
import { GalleryIcon } from '../../ui/icons/GalleryIcon';

const CreatePostModal: React.FC = () => {
    const { closeCreatePostModal, user, editingPost } = useAppContext();
    const [content, setContent] = useState(editingPost?.content || '');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(editingPost?.imageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEdit = !!editingPost;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isEdit) return; // Cannot change image in edit mode
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            if (isEdit) {
                // Update Path
                const res = await fetch(`/api/posts/${editingPost._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ content })
                });

                if (res.ok) {
                    closeCreatePostModal();
                    window.location.reload();
                } else {
                    const data = await res.json();
                    alert(data.error || "Failed to update post");
                }
            } else {
                // Create Path
                if (!selectedImage || !fileInputRef.current?.files?.[0]) {
                    alert("Please select an image");
                    setIsLoading(false);
                    return;
                }

                const file = fileInputRef.current.files[0];

                // Step 1: Get Presigned URL
                const uploadRes = await fetch(`/api/upload-url?fileType=${encodeURIComponent(file.type)}&uploadType=post`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!uploadRes.ok) throw new Error('Failed to get upload URL');
                const { uploadUrl, key } = await uploadRes.json();

                // Step 2: Upload to S3
                const s3Res = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type }
                });

                if (!s3Res.ok) throw new Error('Failed to upload image to S3');

                // Step 3: Create Post
                const postRes = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        content,
                        imageUrl: key
                    })
                });

                if (postRes.ok) {
                    closeCreatePostModal();
                    setContent('');
                    setSelectedImage(null);
                    window.location.reload();
                } else {
                    const data = await postRes.json();
                    alert(data.msg || "Failed to create post");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to render user avatar
    const renderAvatar = (w: string, h: string, textSize: string) => (
        <div className={`${w} ${h} rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-100`}>
            {user?.profilePictureUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
                <div className={`w-full h-full flex items-center justify-center bg-saffron-100 text-saffron-600 font-bold ${textSize}`}>
                    {user?.name?.charAt(0) || 'U'}
                </div>
            )}
        </div>
    );

    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
    const displayImage = isEdit && selectedImage && !selectedImage.startsWith('data:')
        ? `${cdnUrl}/${selectedImage}`
        : selectedImage;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 md:p-4 animate-fade-in">
            <div className="bg-white md:rounded-2xl shadow-xl w-full h-full md:h-auto md:max-w-2xl relative overflow-hidden flex flex-col md:max-h-[90vh]">

                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        {renderAvatar("w-12", "h-12", "text-lg")}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">{user?.name || 'Member'}</h2>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{isEdit ? 'Editing Post' : 'Creating New Post'}</p>
                        </div>
                    </div>
                    <button onClick={closeCreatePostModal} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-full hover:bg-slate-100">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Header */}
                <div className="md:hidden flex justify-between items-center px-4 py-4 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                        <button onClick={closeCreatePostModal} className="text-slate-500 mr-2">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-slate-800 text-lg">{isEdit ? 'Edit post' : 'Create post'}</span>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-6">
                        <div className="flex gap-3 relative group">
                            <div className="md:hidden pt-1">
                                {renderAvatar("w-10", "h-10", "text-sm")}
                            </div>

                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What do you want to share?"
                                className="w-full min-h-[120px] md:min-h-[160px] resize-none border-none focus:ring-0 focus:outline-none text-slate-700 placeholder-slate-400 text-lg md:text-xl leading-relaxed pt-2"
                                autoFocus
                            />
                        </div>

                        {displayImage && (
                            <div className="relative mt-4 w-full animate-fade-in">
                                <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                                    <img src={displayImage} alt="Selected" className="w-full h-auto object-contain max-h-[400px]" />
                                </div>
                                {!isEdit && (
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 backdrop-blur-sm transition-all"
                                    >
                                        <CloseIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 md:px-6 md:py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none pb-safe">
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            disabled={isEdit}
                        />
                        {!isEdit && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-slate-500 hover:text-saffron-600 hover:bg-saffron-50 dark:hover:bg-saffron-900/20 p-2.5 rounded-full transition-all group"
                                title="Add Photo"
                            >
                                <GalleryIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!content.trim() || isLoading}
                        className="px-6 py-2 rounded-full bg-saffron-600 text-white font-semibold hover:bg-saffron-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-saffron-500/30 flex items-center gap-2 transform active:scale-95 text-sm md:text-base"
                    >
                        {isLoading && <SpinnerIcon className="w-4 h-4 animate-spin" />}
                        {isEdit ? 'Update' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
