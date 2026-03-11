import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import PostCard from '../../PostCard';
import { SpinnerIcon } from '../../ui/icons/SpinnerIcon';
import { getImageUrl } from '@/lib/image-utils';

interface Post {
    _id: string;
    user: {
        _id: string;
        name: string;
        profilePictureUrl?: string;
        headline?: string;
    };
    content: string;
    imageUrl: string;
    likesCount: number;
    createdAt: string;
}

const UserFeed: React.FC = () => {
    const { user, openCreatePostModal } = useAppContext();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();

                // Construct full URLs if stored as keys
                const processedPosts = data.map((post: Post) => ({
                    ...post,
                    imageUrl: getImageUrl(post.imageUrl)
                }));

                setPosts(processedPosts);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen w-full bg-slate-50 pt-24 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Welcome back, {user?.name || 'Member'}!
                    </h1>
                    <div
                        onClick={openCreatePostModal}
                        className="mt-4 flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {user?.profilePictureUrl ? (
                                <img src={getImageUrl(user.profilePictureUrl)} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-saffron-100 text-saffron-600 font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        <p className="text-slate-500 font-medium">Start a post...</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Feed */}
                    <div className="md:col-span-2">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <SpinnerIcon className="w-8 h-8 text-saffron-600 animate-spin" />
                            </div>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))
                        ) : (
                            <div className="bg-white p-8 rounded-xl text-center text-slate-500 border border-slate-200">
                                No posts yet. Be the first to share!
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="hidden md:block space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-2">Community Updates</h3>
                            <p className="text-sm text-slate-500">Upcoming events and announcements will appear here.</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <p className="text-xs text-slate-400">© 2026 Visha Oswal Community</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserFeed;
