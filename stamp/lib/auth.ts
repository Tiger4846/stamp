import { NextRequest } from 'next/server';
import { verifyToken, getTokenFromRequest, JWTPayload } from './jwt';

export async function getCurrentUser(request: NextRequest): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return await verifyToken(token);
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return Response.json({ error: message }, { status: 401 });
}

export function requireAuth(user: JWTPayload | null) {
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function requireAdmin(user: JWTPayload | null) {
  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return user;
}
