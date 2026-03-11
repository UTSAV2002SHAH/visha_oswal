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
        const { type, user, name, manualImage } = data;

        if (type !== "father" && type !== "mother") {
            return NextResponse.json({ error: "Invalid parent type" }, { status: 400 });
        }
        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        await connectDB();

        // 1. If linking an existing user on the platform, verify they exist and create a Notification
        let status = null;
        if (user) {
            // Verify the target user exists
            const targetUser = await User.findById(user);
            if (!targetUser) {
                return NextResponse.json({ error: "Target platform user not found" }, { status: 404 });
            }

            // Prevent self-linking
            if (userId === user) {
                return NextResponse.json({ error: "Cannot link yourself as a parent" }, { status: 400 });
            }

            // Create the pending notification
            await Notification.create({
                type: "RELATIONSHIP_REQUEST",
                sender: userId,
                receiver: user,
                status: "PENDING",
                metadata: {
                    requestingRelation: type === "father" ? "Father" : "Mother",
                }
            });

            status = "PENDING";
        }

        // 2. Update the user's MemberProfile
        const parentData = {
            user: user ? new mongoose.Types.ObjectId(user) : null,
            name,
            status,
            manualImage: manualImage || null,
        };

        const updateField = type === "father" ? { "family.father": parentData } : { "family.mother": parentData };

        const updatedProfile = await MemberProfile.findOneAndUpdate(
            { userId },
            { $set: updateField },
            { new: true, upsert: true }
        );

        return NextResponse.json({
            message: `${type === "father" ? "Father" : "Mother"} added successfully`,
            profile: updatedProfile
        });

    } catch (error) {
        console.error("Error adding parent:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
