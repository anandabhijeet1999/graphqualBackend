import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role, AuthContext } from '../types';

interface JwtPayload {
  sub: string;
  name: string;
  role: Role;
}

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: '8h' });

export const decodeToken = (token?: string): JwtPayload | null => {
  if (!token) return null;
  try {
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
};

export const requireRole = (ctx: AuthContext, roles: Role[]) => {
  if (!ctx.user || !roles.includes(ctx.user.role)) {
    throw new Error('Not authorized');
  }
};

