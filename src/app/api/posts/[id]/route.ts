import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/lib/models/Post.model";
import { verifyAuth } from "@/lib/auth";
import { S3Service } from "@/lib/s3-service";

type Params = {
    params: {
        id: string;
    };
};

// DELETE Post
export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const user = verifyAuth(req);
        const { id } = params;

        // 1. Find Post
        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // 2. Authorization Check: Only owner can delete
        if (post.user.toString() !== user.id) {
            return NextResponse.json({ error: "Unauthorized to delete this post" }, { status: 403 });
        }

        // 3. S3 Cleanup: Delete image from S3
        if (post.imageUrl) {
            try {
                // If it's a key (doesn't start with http), delete it
                if (!post.imageUrl.startsWith("http")) {
                    await S3Service.deleteObject(post.imageUrl);
                }
            } catch (s3Error) {
                console.error("Failed to delete S3 object:", s3Error);
                // We proceed with DB deletion anyway, or we could fail. 
                // Usually, DB consistency is prioritized.
            }
        }

        // 4. DB Cleanup: Delete from MongoDB
        await Post.findByIdAndDelete(id);

        return NextResponse.json({ message: "Post deleted successfully" });

    } catch (error: any) {
        console.error("Delete Post Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// UPDATE Post (Caption Only)
export async function PUT(req: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const user = verifyAuth(req);
        const { id } = params;
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        // 1. Find Post
        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // 2. Authorization Check
        if (post.user.toString() !== user.id) {
            return NextResponse.json({ error: "Unauthorized to edit this post" }, { status: 403 });
        }

        // 3. Update Content
        post.content = content;
        await post.save();

        return NextResponse.json(post);

    } catch (error: any) {
        console.error("Update Post Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
