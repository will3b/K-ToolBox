import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PRO_COOKIE_NAME, createProToken, isProUser } from '@/lib/pro-check';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const proUser = await db.proUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!proUser || !proUser.isActive) {
      return NextResponse.json({
        isPro: false,
        message: 'No active Pro account found for this email.',
      });
    }

    const token = createProToken(normalizedEmail);

    const response = NextResponse.json({
      isPro: true,
      email: normalizedEmail,
      message: 'Pro activated!',
      provider: proUser.provider,
    });

    response.cookies.set(PRO_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Pro activation error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const status = await isProUser();
    return NextResponse.json(status);
  } catch {
    return NextResponse.json({ isPro: false, email: null });
  }
}

