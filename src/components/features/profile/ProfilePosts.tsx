import React, { useEffect, useState } from 'react';
import { SpinnerIcon } from '../../ui/icons/SpinnerIcon';
import { PostThumbnail } from './PostThumbnail';
import PostDetailModal from './PostDetailModal';
import { useAppContext } from '@/context/AppContext';
import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';

interface Post {
    _id: string;
    content: string;
    imageUrl: string;
    likesCount: number;
    commentsCount?: number;
    createdAt: string;
}

export const ProfilePosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
    const { openCreatePostModal } = useAppContext();

    const fetchPosts = async () => {
        try {
            const response = await fetchWithAuth('/api/users/me/posts');

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to fetch posts');
            }

            const data = await response.json();

            const processedPosts = data.map((post: Post) => ({
                ...post,
                imageUrl: post.imageUrl.startsWith('http')
                    ? post.imageUrl
                    : `${cdnUrl}/${post.imageUrl}`
            }));

            setPosts(processedPosts);
        } catch (err: any) {
            setError(err.message);
            console.error("ProfilePosts Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [cdnUrl]);

    const handleDelete = (postId: string) => {
        setPosts(prev => prev.filter(p => p._id !== postId));
        if (selectedPost?._id === postId) setSelectedPost(null);
    };

    const handleEdit = (post: Post) => {
        setSelectedPost(null); // Close modal before editing
        openCreatePostModal(post);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <SpinnerIcon className="w-8 h-8 animate-spin text-saffron-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100 shadow-sm">
                <p className="text-slate-600 font-medium">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-saffron-600 hover:text-saffron-700 font-semibold mt-2 transition-colors"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">No posts yet</h3>
                <p className="text-slate-500 mt-1">Share your first photo with the community!</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-1 md:gap-4">
                {posts.map((post) => (
                    <PostThumbnail
                        key={post._id}
                        post={post}
                        onClick={(p) => setSelectedPost(p)}
                    />
                ))}
            </div>

            {selectedPost && (
                <PostDetailModal
                    post={selectedPost}
                    isOpen={!!selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
};

