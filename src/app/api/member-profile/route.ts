import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import MemberProfile from "@/lib/models/MemberProfile.model";
import User from "@/lib/models/User.model";

// Define the exact shape of a fresh MemberProfile using our Mongoose schema
const getEmptyProfile = (userId: string, defaultName: string = "") => ({
    userId,
    personal: {
        fullName: defaultName,
        gender: undefined,
        contactNumber: "",
        dateOfBirth: undefined,
        maritalStatus: "",
        cityOfOrigin: "",
        currentCity: "",
    },
    family: {
        father: null,
        mother: null,
        spouse: null,
        siblings: [],
        children: [],
    },
});

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

        let profile = await MemberProfile.findOne({ userId })
            .populate('family.father.user', 'name username profilePictureUrl')
            .populate('family.mother.user', 'name username profilePictureUrl')
            .populate('family.spouse.user', 'name username profilePictureUrl')
            .populate('family.siblings.user', 'name username profilePictureUrl')
            .populate('family.children.user', 'name username profilePictureUrl');

        if (!profile) {
            // Fetch user to get their current name as a fallback default
            const user = await User.findById(userId);
            const defaultName = user?.name || "";

            // If profile doesn't exist, return an empty template instead of 404
            // We don't save it to the DB yet to avoid cluttering with empty docs
            return NextResponse.json(getEmptyProfile(userId, defaultName));
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error fetching member profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        let userAuth;
        try {
            userAuth = verifyAuth(req);
        } catch (authErr) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = userAuth.id;

        const data = await req.json();
        const { personal } = data;

        // We only allow updating "personal" details via this generic PUT endpoint.
        // Family links will be handled by dedicated endpoints.
        if (!personal) {
            return NextResponse.json({ error: "Personal data is required" }, { status: 400 });
        }

        await connectDB();

        // Upsert the profile (Update if exists, Create if it doesn't)
        const updatedProfile = await MemberProfile.findOneAndUpdate(
            { userId },
            {
                $set: {
                    personal: {
                        fullName: personal.fullName,
                        gender: personal.gender,
                        contactNumber: personal.contactNumber,
                        dateOfBirth: personal.dateOfBirth,
                        maritalStatus: personal.maritalStatus,
                        cityOfOrigin: personal.cityOfOrigin,
                        currentCity: personal.currentCity,
                    },
                },
            },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json(updatedProfile);
    } catch (error) {
        console.error("Error updating member profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
