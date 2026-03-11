import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/lib/models/Post.model';
import User from '@/lib/models/User.model'; // Import User to ensure schema is registered
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // 1. Verify User
        const user = verifyAuth(req);

        // 2. Parse Body
        const { content, imageUrl } = await req.json();

        // 3. Validation
        if (!imageUrl) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }
        if (!content) {
            return NextResponse.json({ error: 'Caption is required' }, { status: 400 });
        }

        // 4. Create Post
        const newPost = await Post.create({
            user: user.id,
            content,
            imageUrl,
            likesCount: 0,
        });

        return NextResponse.json(newPost, { status: 201 });

    } catch (error: any) {
        if (error.message === 'No token, authorization denied' || error.message === 'Token is not valid') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Create Post Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Optional: Verify auth if feed is private, but often feed is public or personalized.
        // For now, let's allow fetching without strict auth check for public feed, 
        // or strictly require it. Given the context (Community Platform), let's require auth.
        try {
            verifyAuth(req);
        } catch (e) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch Posts
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('user', 'name profilePictureUrl headline username') // Populate author details
            .lean();

        return NextResponse.json(posts);

    } catch (error) {
        console.error('Get Posts Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
