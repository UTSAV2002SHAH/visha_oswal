import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User.model';
import { ExperienceSchema } from '@/lib/validations/profile';

// @route   POST api/experience
// @desc    Add profile experience
// @access  Private
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const userPayload = verifyAuth(request);
    const body = await request.json();
    
    // Validate input
    const validatedData = ExperienceSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ msg: 'Invalid experience data', errors: validatedData.error.flatten() }, { status: 400 });
    }
    
    const newExp = validatedData.data;
    
    const user = await User.findById(userPayload.id).select('-passwordHash -authTokens');
    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }

    user.experience.unshift(newExp as any);
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