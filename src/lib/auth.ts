import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

interface UserPayload {
  user: {
    id: string;
  };
}

export const verifyAuth = (req: NextRequest): UserPayload['user'] => {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    throw new Error('No token, authorization denied');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Token format is invalid, authorization denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    return decoded.user;
  } catch (err) {
    throw new Error('Token is not valid');
  }
};