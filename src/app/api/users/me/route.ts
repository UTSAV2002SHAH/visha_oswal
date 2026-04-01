import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User.model';
import { S3Service } from '@/lib/s3-service';
import { UserUpdateSchema } from '@/lib/validations/profile';

// @route   GET api/users/me
// @desc    Get current user's profile
// @access  Private
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userPayload = verifyAuth(request);
    const user = await User.findById(userPayload.id).select('-passwordHash -authTokens');
    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (err: any) {
    if (err.message.includes('authorization') || err.message.includes('Token')) {
      return NextResponse.json({ msg: err.message }, { status: 401 });
    }
    console.error(err);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}

// @route   PUT api/users/me
// @desc    Update user profile
// @access  Private
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const userPayload = verifyAuth(request);
    const body = await request.json();

    // Validate input
    const validatedData = UserUpdateSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ msg: 'Invalid user data', errors: validatedData.error.flatten() }, { status: 400 });
    }

    const { name, username, headline, city, about, profilePictureUrl, bannerImageUrl, skills } = validatedData.data;

    // 1. Fetch current user to get old image keys for cleanup
    const currentUser = await User.findById(userPayload.id);
    if (!currentUser) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }

    const profileFields: { [key: string]: any } = {};
    if (name !== undefined) profileFields.name = name;
    if (username !== undefined) profileFields.username = username;
    if (headline !== undefined) profileFields.headline = headline;
    if (city !== undefined) profileFields.city = city;
    if (about !== undefined) profileFields.about = about;
    if (skills !== undefined) profileFields.skills = skills;

    // 2. Handle Profile Picture Update & Cleanup
    if (profilePictureUrl !== undefined) {
      // If there's an old image key and it's different from the new one, delete it from S3
      if (currentUser.profilePictureUrl && currentUser.profilePictureUrl !== profilePictureUrl && !currentUser.profilePictureUrl.startsWith('http')) {
        try {
          await S3Service.deleteObject(currentUser.profilePictureUrl);
          console.log('Deleted old profile picture:', currentUser.profilePictureUrl);
        } catch (s3Err) {
          console.error('Error deleting old profile picture from S3:', s3Err);
          // We continue anyway so the DB update isn't blocked by S3 cleanup failure
        }
      }
      profileFields.profilePictureUrl = profilePictureUrl;
    }

    // 3. Handle Banner Image Update & Cleanup
    if (bannerImageUrl !== undefined) {
      // If there's an old image key and it's different from the new one, delete it from S3
      if (currentUser.bannerImageUrl && currentUser.bannerImageUrl !== bannerImageUrl && !currentUser.bannerImageUrl.startsWith('http')) {
        try {
          await S3Service.deleteObject(currentUser.bannerImageUrl);
          console.log('Deleted old banner image:', currentUser.bannerImageUrl);
        } catch (s3Err) {
          console.error('Error deleting old banner image from S3:', s3Err);
        }
      }
      profileFields.bannerImageUrl = bannerImageUrl;
    }

    const user = await User.findByIdAndUpdate(
      userPayload.id,
      { $set: profileFields },
      { new: true, runValidators: true }
    ).select('-passwordHash -authTokens');

    return NextResponse.json(user);
  } catch (err: any) {
    if (err.message.includes('authorization') || err.message.includes('Token')) {
      return NextResponse.json({ msg: err.message }, { status: 401 });
    }

    // Handle duplicate username error
    if (err.code === 11000 && (err.keyPattern?.username || err.message.includes('username'))) {
      return NextResponse.json({ msg: 'Username already taken' }, { status: 400 });
    }

    console.error('Update Profile Error:', err);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}