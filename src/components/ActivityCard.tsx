"use client";

import React, { useState } from 'react';
import { UserIcon } from './ui/icons/UserIcon';
import { EllipsisHorizontalIcon } from './ui/icons/EllipsisHorizontalIcon';
import { HandThumbUpIcon } from './ui/icons/HandThumbUpIcon';
import { ChatBubbleOvalLeftIcon } from './ui/icons/ChatBubbleOvalLeftIcon';
import { ArrowUturnRightIcon } from './ui/icons/ArrowUturnRightIcon';

export interface Post {
    id: number;
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
}

interface ActivityCardProps {
    user: { name: string, avatar: string | null };
    posts: Post[];
    onAddPost: (content: string) => void;
}

const PostItem: React.FC<{ post: Post, user: { name: string, avatar: string | null } }> = ({ post, user }) => {
    return (
        <div className="py-4">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{post.timestamp}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
                            <EllipsisHorizontalIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="mt-2 text-gray-700 whitespace-pre-line text-sm">{post.content}</p>
                    <div className="mt-3 flex items-center text-xs text-gray-500 gap-2">
                        <span>{post.likes} Likes</span>
                        <span>&middot;</span>
                        <span>{post.comments} Comments</span>
                    </div>
                </div>
            </div>
            <div className="mt-2 pl-12">
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-around">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md p-2 transition-colors font-semibold text-sm w-full justify-center">
                        <HandThumbUpIcon className="w-5 h-5" /> Like
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md p-2 transition-colors font-semibold text-sm w-full justify-center">
                        <ChatBubbleOvalLeftIcon className="w-5 h-5" /> Comment
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md p-2 transition-colors font-semibold text-sm w-full justify-center">
                        <ArrowUturnRightIcon className="w-5 h-5" /> Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ user, posts, onAddPost }) => {
    const [postText, setPostText] = useState('');

    const handlePostSubmit = () => {
        if (postText.trim()) {
            onAddPost(postText);
            setPostText('');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Activity</h2>

            <div className="flex gap-3 items-start border-b border-gray-200 pb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-1">
                    {user.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon className="w-7 h-7 text-gray-400" />}
                </div>
                <div className="w-full">
                    <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow duration-200 ease-in-out text-gray-800 text-sm"
                    />
                    <div className="text-right mt-2">
                        <button
                            onClick={handlePostSubmit}
                            disabled={!postText.trim()}
                            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold px-5 py-2 rounded-full hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {posts.map(post => (
                    <PostItem key={post.id} post={post} user={user} />
                ))}
            </div>
        </div>
    );
};
