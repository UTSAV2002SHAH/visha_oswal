import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import MemberProfile from "@/lib/models/MemberProfile.model";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { relationType: string } }
) {
    try {
        let userAuth;
        try {
            userAuth = verifyAuth(req);
        } catch (authErr) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = userAuth.id;

        const { relationType } = params;

        // RelationType will be 'father', 'mother', 'spouse', 'siblings', or 'children'
        const validTypes = ["father", "mother", "spouse", "siblings", "children"];
        if (!validTypes.includes(relationType)) {
            return NextResponse.json({ error: "Invalid relation type" }, { status: 400 });
        }

        // For arrays (siblings/children), we need the ID of the specific subdocument to remove
        const url = new URL(req.url);
        const memberId = url.searchParams.get("memberId");

        await connectDB();

        let updateQuery = {};

        if (relationType === "father" || relationType === "mother" || relationType === "spouse") {
            // For single objects, we just set it back to null
            updateQuery = { $set: { [`family.${relationType}`]: null } };
        } else {
            // It's an array (siblings/children). We MUST have an ID to remove specifically.
            if (!memberId) {
                return NextResponse.json({ error: "memberId query parameter required for arrays" }, { status: 400 });
            }
            // Use $pull to remove the specific item from the array by its subdocument _id
            updateQuery = { $pull: { [`family.${relationType}`]: { _id: memberId } } };
        }

        const updatedProfile = await MemberProfile.findOneAndUpdate(
            { userId },
            updateQuery,
            { new: true }
        );

        if (!updatedProfile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: `Successfully removed from ${relationType}`,
            profile: updatedProfile
        });

    } catch (error) {
        console.error(`Error deleting from ${params?.relationType || 'family'}:`, error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
