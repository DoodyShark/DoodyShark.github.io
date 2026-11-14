import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  isLoggedIn?: boolean;
}

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  // Never fall back to a known secret in production — anyone could forge an admin cookie.
  if (process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET is not set');
  return 'dev-only-insecure-session-secret-0123456789';
}

export const sessionOptions = {
  get password() { return sessionSecret(); },
  cookieName: 'portfolio-admin',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
