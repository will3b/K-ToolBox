import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_PRODUCT_ID || process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID;

    if (!apiKey || !storeId || !variantId) {
      return NextResponse.json(
        { error: 'LemonSqueezy is not fully configured' },
        { status: 503 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: normalizedEmail,
              custom: { email: normalizedEmail },
            },
          },
          relationships: {
            store: { data: { type: 'stores', id: String(storeId) } },
            variant: { data: { type: 'variants', id: String(variantId) } },
          },
        },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error('LemonSqueezy API error status:', response.status);
      return NextResponse.json(
        { error: 'Failed to create checkout' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const checkoutUrl = data.data?.attributes?.url;

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'No checkout URL returned' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('LemonSqueezy checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

