import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import MemberProfile from "@/lib/models/MemberProfile.model";
import Notification from "@/lib/models/Notification.model";
import User from "@/lib/models/User.model";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    try {
        let userAuth;
        try {
            userAuth = verifyAuth(req);
        } catch (authErr) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = userAuth.id;

        const data = await req.json();
        const { user, name, manualImage } = data;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        await connectDB();

        // 1. If linking an existing user on the platform, verify they exist and create a Notification
        let status = null;
        if (user) {
            const targetUser = await User.findById(user);
            if (!targetUser) {
                return NextResponse.json({ error: "Target platform user not found" }, { status: 404 });
            }

            if (userId === user) {
                return NextResponse.json({ error: "Cannot link yourself as a child" }, { status: 400 });
            }

            // Create the pending notification
            await Notification.create({
                type: "RELATIONSHIP_REQUEST",
                sender: userId,
                receiver: user,
                status: "PENDING",
                metadata: {
                    requestingRelation: "Child",
                }
            });

            status = "PENDING";
        }

        // 2. Add child to the user's MemberProfile (Pushes to array instead of overwriting)
        const childData = {
            user: user ? new mongoose.Types.ObjectId(user) : null,
            name,
            status,
            manualImage: manualImage || null,
        };

        const updatedProfile = await MemberProfile.findOneAndUpdate(
            { userId },
            { $push: { "family.children": childData } },
            { new: true, upsert: true }
        );

        return NextResponse.json({
            message: "Child added successfully",
            profile: updatedProfile
        });

    } catch (error) {
        console.error("Error adding child:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
