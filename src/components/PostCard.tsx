"use client";

import React from 'react';
/* eslint-disable-next-line @next/next/no-img-element */
import { getImageUrl } from '@/lib/image-utils';
import Link from 'next/link';

interface PostCardProps {
    post: {
        _id: string;
        user: {
            _id: string;
            name: string;
            username?: string;
            profilePictureUrl?: string;
            headline?: string;
        };
        content: string;
        imageUrl: string;
        likesCount: number;
        createdAt: string;
    };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-4 flex items-center gap-3">
                <Link href={`/profile/${post.user.username || post.user._id}`} className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden hover:opacity-80 transition-opacity">
                    {post.user.profilePictureUrl ? (
                        <img src={getImageUrl(post.user.profilePictureUrl)} alt={post.user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-saffron-100 text-saffron-600 font-bold text-sm">
                            {post.user.name.charAt(0)}
                        </div>
                    )}
                </Link>
                <div>
                    <Link href={`/profile/${post.user.username || post.user._id}`} className="font-semibold text-slate-900 text-sm hover:text-saffron-600 transition-colors">
                        {post.user.name}
                    </Link>
                    <p className="text-xs text-slate-500">{post.user.headline || 'Community Member'}</p>
                </div>
                <div className="ml-auto text-xs text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-2">
                <p className="text-slate-800 text-sm mb-3 whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Image */}
            <div className="w-full bg-slate-50 aspect-video relative">
                <img src={getImageUrl(post.imageUrl)} alt="Post content" className="w-full h-auto max-h-[500px] object-cover" />
            </div>

            {/* Footer / Actions */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-slate-600 hover:text-saffron-600 transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    <span className="text-sm font-medium">{post.likesCount} <span className="hidden sm:inline">Likes</span></span>
                </button>

                {/* Add Share/Comment buttons later as needed */}
            </div>
        </div>
    );
};

export default PostCard;
