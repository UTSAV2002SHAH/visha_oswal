import mongoose from "mongoose";
import MemberProfile from "@/lib/models/MemberProfile.model";
import Notification from "@/lib/models/Notification.model";
import User from "@/lib/models/User.model";

/**
 * Calculates the reciprocal relationship label based on the sender's gender.
 * e.g., If Utsav(Male) requested Alpesh to be his "Father", Alpesh's reciprocal logic
 * means we must add Utsav as a "Son" to Alpesh's family tree.
 */
function getReciprocalRelation(requestingRelation: string, senderGender?: string): string {
    const isMale = senderGender === "Male";

    switch (requestingRelation) {
        case "Father":
        case "Mother":
            return isMale ? "Son" : "Daughter";
        case "Spouse":
            return "Spouse"; // Husband/Wife could be added if schema supports it later
        case "Sibling":
            return isMale ? "Brother" : "Sister";
        case "Child":
            return isMale ? "Father" : "Mother"; // Assumes parent logic based on child's gender
        default:
            return "Relative";
    }
}

/**
 * Processes the acceptance of a relationship request.
 * Wraps the Notification update and the bidirectional MemberProfile updates in a single ACID transaction.
 */
export async function approveRelationshipRequest(notificationId: string, loggedInUserId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Fetch Notification (Verify it exists and is intended for this user)
        const notification = await Notification.findById(notificationId).session(session);
        if (!notification) {
            throw new Error("Notification not found");
        }

        // SECURITY CHECK: Crucial to prevent IDOR
        if (notification.receiver.toString() !== loggedInUserId) {
            throw new Error("Unauthorized to accept this notification");
        }

        if (notification.status !== "PENDING") {
            throw new Error("Request is no longer pending");
        }


        // 2. Fetch both profiles (create if missing)
        let senderProfile = await MemberProfile.findOne({ userId: notification.sender }).session(session);
        if (!senderProfile) {
            const senderUser = await User.findById(notification.sender).session(session);
            if (!senderUser) throw new Error("Sender user not found");
            senderProfile = new MemberProfile({ userId: notification.sender, personal: { fullName: senderUser.name } });
        }

        let receiverProfile = await MemberProfile.findOne({ userId: notification.receiver }).session(session);
        if (!receiverProfile) {
            const receiverUser = await User.findById(notification.receiver).session(session);
            if (!receiverUser) throw new Error("Receiver user not found");
            receiverProfile = new MemberProfile({ userId: notification.receiver, personal: { fullName: receiverUser.name } });
        }

        const relationType = notification.metadata.requestingRelation;

        // 3. Update the sender's original link
        if (relationType === "Father" || relationType === "Mother" || relationType === "Spouse") {
            const relKey = relationType.toLowerCase() as ('father' | 'mother' | 'spouse');
            if (senderProfile.family[relKey] && senderProfile.family[relKey]?.user?.toString() === notification.receiver.toString()) {
                senderProfile.family[relKey]!.status = "ACCEPTED";
            }
        } else if (relationType === "Sibling") {
            const sibling = senderProfile.family.siblings.find((s: any) => s.user?.toString() === notification.receiver.toString());
            if (sibling) sibling.status = "ACCEPTED";
        } else if (relationType === "Child") {
            const child = senderProfile.family.children.find((c: any) => c.user?.toString() === notification.receiver.toString());
            if (child) child.status = "ACCEPTED";
        }

        await senderProfile.save({ session });

        // 4. Calculate reciprocal relation and update the receiver's profile
        const reciprocalRelation = getReciprocalRelation(relationType, senderProfile.personal.gender);

        const reciprocalData = {
            user: notification.sender,
            name: senderProfile.personal.fullName,
            status: "ACCEPTED" as const, // It's accepted by default since they are the one approving it
        };

        if (reciprocalRelation === "Father" || reciprocalRelation === "Mother" || reciprocalRelation === "Spouse") {
            const relKey = reciprocalRelation.toLowerCase() as ('father' | 'mother' | 'spouse');
            receiverProfile.family[relKey] = reciprocalData;
        } else if (reciprocalRelation === "Son" || reciprocalRelation === "Daughter" || reciprocalRelation === "Child") {
            receiverProfile.family.children.push(reciprocalData);
        } else if (reciprocalRelation === "Brother" || reciprocalRelation === "Sister" || reciprocalRelation === "Sibling") {
            receiverProfile.family.siblings.push(reciprocalData);
        }

        await receiverProfile.save({ session });

        // 5. Finally, mark the notification itself as ACCEPTED
        notification.status = "ACCEPTED";
        notification.isRead = true;
        await notification.save({ session });


        // Commit the transaction - Everything succeeds together!
        await session.commitTransaction();
        session.endSession();

        return { success: true };

    } catch (error: any) {
        // Abort on ANY error - Nothing gets written!
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction Error approving relationship:", error);
        throw error;
    }
}
