import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'LemonSqueezy webhooks not configured' },
        { status: 503 }
      );
    }

    const body = await request.text();
    const sig = request.headers.get('x-signature');

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing x-signature header' },
        { status: 400 }
      );
    }

    // Verify signature using constant-time comparison
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const data = JSON.parse(body);
    const eventName = data.meta?.event_name;

    // Handle order created (payment successful)
    if (eventName === 'order_created') {
      const attrs = data.data?.attributes;
      const email =
        attrs?.user_email ||
        attrs?.checkout_data?.email ||
        attrs?.custom?.email;
      const customerId = String(data.data?.id || '');

      if (email) {
        await db.proUser.upsert({
          where: { email },
          create: {
            email,
            provider: 'lemonsqueezy',
            providerCustomerId: customerId || undefined,
            isActive: true,
          },
          update: {
            isActive: true,
            provider: 'lemonsqueezy',
            providerCustomerId: customerId || undefined,
          },
        });
        console.log(`LemonSqueezy: Pro activated for ${email}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('LemonSqueezy webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
