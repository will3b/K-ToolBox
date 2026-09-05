import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const PRO_COOKIE_NAME = 'toolbox_pro_token';
const SECRET_KEY = process.env.PRO_COOKIE_SECRET || 'toolbox-default-insecure-secret-key-change-me';

/**
 * Creates an HMAC-SHA256 signed cookie token containing the email and expiry timestamp.
 */
export function createProToken(email: string, expiresInDays = 30): string {
  const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
  const payload = `${email.toLowerCase().trim()}|${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}|${signature}`).toString('base64url');
}

/**
 * Verifies a signed cookie token and returns the email if valid and not expired.
 */
export function verifyProToken(token?: string | null): string | null {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const parts = decoded.split('|');
    if (parts.length !== 3) return null;

    const [email, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

    const payload = `${email}|${expiresAtStr}`;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payload)
      .digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedSignature, 'hex');

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    return email;
  } catch {
    return null;
  }
}

/**
 * Checks if the request is from an active Pro user.
 */
export async function isProUser(cookieStore?: Awaited<ReturnType<typeof cookies>>): Promise<{ isPro: boolean; email: string | null }> {
  try {
    const store = cookieStore || await cookies();
    const token = store.get(PRO_COOKIE_NAME)?.value;
    const email = verifyProToken(token);
    if (!email) return { isPro: false, email: null };

    const proUser = await db.proUser.findUnique({
      where: { email },
    });

    if (proUser?.isActive) {
      return { isPro: true, email };
    }

    return { isPro: false, email: null };
  } catch {
    return { isPro: false, email: null };
  }
}

export { PRO_COOKIE_NAME };

