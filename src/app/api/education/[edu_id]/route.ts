import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import User, { IEducation } from '@/lib/models/User.model';
import { EducationSchema } from '@/lib/validations/profile';

interface Params {
    params: { edu_id: string }
}

// @route   PUT api/education/:edu_id
// @desc    Update profile education
// @access  Private
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        await connectDB();
        const userPayload = verifyAuth(request);
        const body = await request.json();

        // Validate input
        const validatedData = EducationSchema.safeParse(body);
        if (!validatedData.success) {
            return NextResponse.json({ msg: 'Invalid education data', errors: validatedData.error.flatten() }, { status: 400 });
        }
        
        const updateData = validatedData.data;

        const user = await User.findById(userPayload.id).select('-passwordHash -authTokens');
        if (!user) {
            return NextResponse.json({ msg: 'User not found' }, { status: 404 });
        }

        const education = user.education.find(e => e._id.toString() === params.edu_id);
        if (!education) {
            return NextResponse.json({ msg: 'Education entry not found' }, { status: 404 });
        }
        
        Object.assign(education, updateData);
        
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

// @route   DELETE api/education/:edu_id
// @desc    Delete education from profile
// @access  Private
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const userPayload = verifyAuth(request);

    const user = await User.findById(userPayload.id).select('-passwordHash -authTokens');
    if (!user) {
        return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }
    
    const initialLength = user.education.length;
    user.education = user.education.filter(e => e._id.toString() !== params.edu_id);

    if (user.education.length === initialLength) {
       return NextResponse.json({ msg: 'Education entry not found' }, { status: 404 });
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