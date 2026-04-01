import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

interface UserPayload {
  user: {
    id: string;
  };
}

export const verifyAuth = (req: NextRequest): UserPayload['user'] => {
  // Primary: read from HttpOnly cookie (secure, XSS-safe)
  const cookieToken = req.cookies.get('auth_token')?.value;

  // Fallback: read from Authorization header (kept during migration, will be removed)
  const authHeader = req.headers.get('Authorization');
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const token = cookieToken || headerToken;

  if (!token) {
    throw new Error('No token, authorization denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    return decoded.user;
  } catch (err) {
    throw new Error('Token is not valid');
  }
};