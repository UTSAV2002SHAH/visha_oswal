import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/lib/models/User.model';
import { generateUniqueUsername } from '@/lib/utils/slugify';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type');
        let credential;

        if (contentType?.includes('application/x-www-form-urlencoded')) {
            // Handle Google Redirect (Form POST)
            const formData = await request.formData();
            credential = formData.get('credential');
        } else {
            // Handle Popup/JSON (Standard)
            const body = await request.json();
            credential = body.credential;
        }

        if (!credential) {
            return NextResponse.json({ msg: 'No credential provided' }, { status: 400 });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential as string,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return NextResponse.json({ msg: 'Invalid token payload' }, { status: 400 });
        }

        const { email, name, picture } = payload;

        await connectDB();

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name: name || 'Google User',
                username: await generateUniqueUsername(name || email),
                profilePictureUrl: picture,
            });
            await user.save();
        }

        user.lastLogin = new Date();
        await user.save();

        const jwtPayload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
            expiresIn: '5h',
        });

        const cookieValue = [
            `auth_token=${token}`,
            'HttpOnly',
            'Path=/',
            'SameSite=Lax',
            `Max-Age=${60 * 60 * 5}`,
            ...(process.env.NODE_ENV === 'production' ? ['Secure'] : []),
        ].join('; ');

        if (contentType?.includes('application/x-www-form-urlencoded')) {
            // FIX: Handle proxies like ngrok properly by observing x-forwarded headers 
            const proto = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
            const baseUrl = `${proto}://${host}`;

            const redirectResponse = NextResponse.redirect(
                new URL('/', baseUrl),
                { status: 302 }
            );
            redirectResponse.headers.set('Set-Cookie', cookieValue);
            return redirectResponse;
        }

        // FIX: Set cookie on JSON response, no longer return token in body
        const jsonResponse = NextResponse.json({ success: true });
        jsonResponse.headers.set('Set-Cookie', cookieValue);
        return jsonResponse;

    } catch (err: any) {
        console.error('Google Auth Error:', err);
        return NextResponse.json({ msg: 'Google Sign In Failed' }, { status: 500 });
    }
}
