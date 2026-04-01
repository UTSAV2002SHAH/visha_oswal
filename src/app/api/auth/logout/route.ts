import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true, msg: 'Logged out successfully' });
    
    // Clear the auth_token cookie by setting its Max-Age to 0
    response.cookies.set('auth_token', '', {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
    });

    return response;
}
