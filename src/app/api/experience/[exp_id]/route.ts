import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User, { IExperience } from '@/lib/models/User.model';

interface Params {
    params: { exp_id: string }
}

// @route   PUT api/experience/:exp_id
// @desc    Update profile experience
// @access  Private
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const userPayload = verifyAuth(request);
        const body = await request.json();
        
        const user = await User.findById(userPayload.id).select('-passwordHash -authTokens');
        if (!user) {
            return NextResponse.json({ msg: 'User not found' }, { status: 404 });
        }

        const experience = user.experience.find(e => e._id.toString() === params.exp_id);
        if (!experience) {
            return NextResponse.json({ msg: 'Experience not found' }, { status: 404 });
        }

        Object.assign(experience, body);
        
        await user.save();
        return NextResponse.json(user);
    } catch (err: any) {
        if (err.message.includes('authorization') || err.message.includes('Token')) {
            return NextResponse.json({ msg: err.message }, { status: 401 });
        }
        console.error(err);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
}


// @route   DELETE api/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const userPayload = verifyAuth(request);
    
    const user = await User.findById(userPayload.id).select('-passwordHash -authTokens');
    if (!user) {
        return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }

    const initialLength = user.experience.length;
    user.experience = user.experience.filter(exp => exp._id.toString() !== params.exp_id);

    if (user.experience.length === initialLength) {
        return NextResponse.json({ msg: 'Experience not found' }, { status: 404 });
    }
    
    await user.save();
    return NextResponse.json(user);
  } catch (err: any) {
    if (err.message.includes('authorization') || err.message.includes('Token')) {
        return NextResponse.json({ msg: err.message }, { status: 401 });
    }
    console.error(err);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}