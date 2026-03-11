import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User.model';

export async function GET(
    request: Request,
    { params }: { params: { username: string } }
) {
    try {
        await connectDB();
        const { username } = params;

        // Fetch user and only select public fields
        // We explicitly exclude sensitive fields like email, authTokens, passwordHash, etc.
        const user = await User.findOne({ username }).select(
            'name username headline city about skills profilePictureUrl bannerImageUrl experience education createdAt'
        );

        let foundUser: any = user;

        if (!user && /^[0-9a-fA-F]{24}$/.test(username)) {
            // Fallback: check if the "username" provided is actually a valid MongoDB ID
            foundUser = await User.findById(username).select(
                'name username headline city about skills profilePictureUrl bannerImageUrl experience education createdAt'
            );
        }

        if (!foundUser) {
            return NextResponse.json({ msg: 'User not found' }, { status: 404 });
        }

        // Fetch the extended MemberProfile to display safe extra details publicly
        // Dynamically import to ensure Mongoose model is registered
        const MemberProfile = (await import('@/lib/models/MemberProfile.model')).default;
        const memberProfile = await MemberProfile.findOne({ userId: foundUser._id })
            .populate('family.father.user', 'name username profilePictureUrl')
            .populate('family.mother.user', 'name username profilePictureUrl')
            .populate('family.spouse.user', 'name username profilePictureUrl')
            .populate('family.siblings.user', 'name username profilePictureUrl')
            .populate('family.children.user', 'name username profilePictureUrl');

        // Convert mongoose document to JS object so we can append properties
        let responseData = foundUser.toObject();

        if (memberProfile) {
            // Pick only non-sensitive fields to expose publicly
            responseData.extendedProfile = {
                gender: memberProfile.personal?.gender,
                maritalStatus: memberProfile.personal?.maritalStatus,
                cityOfOrigin: memberProfile.personal?.cityOfOrigin,
                currentCity: memberProfile.personal?.currentCity,
                family: memberProfile.family || null,
                // Do NOT expose Contact Number or DOB broadly by default for privacy
            };
        } else {
            responseData.extendedProfile = null;
        }

        return NextResponse.json(responseData);
    } catch (err: any) {
        console.error('Fetch public profile error:', err);
        return NextResponse.json({ msg: 'Server error' }, { status: 500 });
    }
}
