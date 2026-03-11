import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/lib/models/User.model';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ msg: 'Please enter all fields' }, { status: 400 });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ msg: 'Invalid Credentials' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ msg: 'Invalid Credentials' }, { status: 400 });
    }
    
    user.lastLogin = new Date();
    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '5h',
    });

    return NextResponse.json({ token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: 'Server error' }, { status: 500 });
  }
}