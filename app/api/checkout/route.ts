import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePriceId = process.env.STRIPE_PRICE_ID

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-04-22.dahlia',
    })
  : null

export async function POST(request: NextRequest) {
  if (!stripeSecretKey || !stripe) {
    return NextResponse.json({ error: 'Stripe secret key is not configured' }, { status: 500 })
  }

  if (!stripePriceId) {
    return NextResponse.json({ error: 'Stripe price ID is not configured' }, { status: 500 })
  }

  const origin = request.headers.get('origin') || 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      allow_promotion_codes: true,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe checkout session created without a redirect URL' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create Stripe checkout session' }, { status: 500 })
  }
}
