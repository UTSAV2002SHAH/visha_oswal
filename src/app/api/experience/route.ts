import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User.model';

// @route   POST api/experience
// @desc    Add profile experience
// @access  Private
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const userPayload = verifyAuth(request);
    const newExp = await request.json();
    
    const user = await User.findById(userPayload.id).select('-passwordHash -authTokens');
    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }

    user.experience.unshift(newExp);
    await user.save();
    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    if (err.message.includes('authorization') || err.message.includes('Token')) {
        return NextResponse.json({ msg: err.message }, { status: 401 });
    }
    console.error(err);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}