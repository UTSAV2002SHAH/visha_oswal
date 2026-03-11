import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification.model";

export async function GET(req: NextRequest) {
    try {
        let userAuth;
        try {
            userAuth = verifyAuth(req);
        } catch (authErr) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = userAuth.id;

        await connectDB();

        // Fetch notifications for the logged-in user, populate sender details
        const notifications = await Notification.find({ receiver: userId })
            .sort({ createdAt: -1 })
            .populate("sender", "name username profilePictureUrl") // Only grab safe, useful fields
            .limit(50); // Sensible limit

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        let userAuth;
        try {
            userAuth = verifyAuth(req);
        } catch (authErr) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = userAuth.id;

        const data = await req.json();
        const { notificationId, action } = data; // action should be "accept" or "reject"

        if (!notificationId || !action) {
            return NextResponse.json({ error: "notificationId and action are required" }, { status: 400 });
        }

        await connectDB();

        if (action === "accept") {
            const { approveRelationshipRequest } = await import("@/lib/utils/family");
            await approveRelationshipRequest(notificationId, userId);
            return NextResponse.json({ message: "Relationship request accepted successfully" });
        } else if (action === "reject") {
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return NextResponse.json({ error: "Notification not found" }, { status: 404 });
            }

            // Security check for rejection as well
            if (notification.receiver.toString() !== userId) {
                return NextResponse.json({ error: "Unauthorized to reject this notification" }, { status: 403 });
            }

            notification.status = "REJECTED";
            notification.isRead = true;
            await notification.save();

            // Note: We leave the sender's profile's "PENDING" status as is, so they see it was rejected.
            // A more complex system might delete the pending data from the sender's profile here.

            return NextResponse.json({ message: "Relationship request rejected" });
        } else if (action === "read") {
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return NextResponse.json({ error: "Notification not found" }, { status: 404 });
            }

            if (notification.receiver.toString() !== userId) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            notification.isRead = true;
            await notification.save();
            return NextResponse.json({ message: "Notification marked as read" });
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Error updating notification:", error);
        return NextResponse.json(
            { error: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
