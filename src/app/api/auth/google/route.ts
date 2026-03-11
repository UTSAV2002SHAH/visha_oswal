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

        // If it was a redirect (form post), we need to return HTML to save the token and redirect back
        if (contentType?.includes('application/x-www-form-urlencoded')) {
            return new Response(
                `<html>
                    <body>
                        <script>
                            localStorage.setItem('token', '${token}');
                            window.location.href = '/';
                        </script>
                    </body>
                </html>`,
                {
                    headers: { 'Content-Type': 'text/html' },
                }
            );
        }

        return NextResponse.json({ token });

    } catch (err: any) {
        console.error('Google Auth Error:', err);
        return NextResponse.json({ msg: 'Google Sign In Failed' }, { status: 500 });
    }
}
