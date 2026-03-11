import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/lib/models/Post.model";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // 1. Get User ID from Token (Secure)
        // verifyAuth throws error if invalid
        let userId: string;
        try {
            const user = verifyAuth(request);
            userId = user.id;
        } catch (e) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Fetch Posts for this user
        const posts = await Post.find({ user: userId })
            .sort({ createdAt: -1 }) // Newest first
            .populate("user", "name profilePictureUrl headline"); // Populate user details for the card

        return NextResponse.json(posts);

    } catch (error: any) {
        console.error("--- PROFILE POSTS API ERROR ---");
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        console.error("-------------------------------");
        return NextResponse.json({
            error: "Backend Error: " + error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
