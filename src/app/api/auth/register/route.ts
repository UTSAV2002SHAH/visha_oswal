import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User.model';
import { generateUniqueUsername } from '@/lib/utils/slugify';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ msg: 'Please enter all fields' }, { status: 400 });
    }

    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ msg: 'User already exists' }, { status: 400 });
    }

    user = new User({
      email,
      name,
      passwordHash: '',
      username: await generateUniqueUsername(email),
    });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    await user.save();

    // Create associated MemberProfile immediately
    const MemberProfile = (await import('@/lib/models/MemberProfile.model')).default;
    const newProfile = new MemberProfile({
      userId: user._id,
      personal: {
        fullName: name,
      }
    });
    await newProfile.save();

    return NextResponse.json({ msg: 'User registered successfully. Please sign in.' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: 'Server error' }, { status: 500 });
  }
}