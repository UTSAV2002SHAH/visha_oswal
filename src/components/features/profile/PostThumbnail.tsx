"use client";

import React from 'react';

interface Post {
    _id: string;
    content: string;
    imageUrl: string;
    likesCount: number;
    commentsCount?: number;
    createdAt: string;
}

interface PostThumbnailProps {
    post: Post;
    onClick: (post: Post) => void;
}

export const PostThumbnail: React.FC<PostThumbnailProps> = ({ post, onClick }) => {
    return (
        <button
            onClick={() => onClick(post)}
            className="relative aspect-square w-full group overflow-hidden bg-slate-100 transition-all active:scale-[0.98]"
        >
            {/* Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={post.imageUrl}
                alt="Post thumbnail"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                <div className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001Z" />
                    </svg>
                    <span>{post.likesCount}</span>
                </div>
                {/* 
                <div className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383L12 21.75l-3.674-4.637c-1.162-.114-2.304-.24-3.43-.376C2.96 16.445 1.5 14.713 1.5 12.766V6.74c0-1.946 1.37-3.678 3.348-3.97ZM12 7.125a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-1.5 0V7.875a.75.75 0 0 1 .75-.75Zm0 3.375a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-1.5 0V11.25a.75.75 0 0 1 .75-.75Zm0 3.375a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-1.5 0V14.625a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    <span>0</span>
                </div>
                */}
            </div>
        </button>
    );
};
