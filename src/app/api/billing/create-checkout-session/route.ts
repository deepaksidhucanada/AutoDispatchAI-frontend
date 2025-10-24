import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(req: Request) {
  try {
    const { plan, billing, addOns, couponCode } = await req.json() as {
      plan: 'ESSENTIALS' | 'PRO',
      billing: 'monthly' | 'yearly',
      addOns: string[],
      couponCode?: string
    }

    // --- Map env price IDs ---
    const planPriceIds = {
      ESSENTIALS: { monthly: process.env.PRICE_ESSENTIALS_MONTHLY!, yearly: process.env.PRICE_ESSENTIALS_YEARLY! },
      PRO:        { monthly: process.env.PRICE_PRO_MONTHLY!,        yearly: process.env.PRICE_PRO_YEARLY! },
    }
    const addOnPriceIds: Record<string, { monthly?: string; yearly?: string }> = {
      city:       { monthly: process.env.PRICE_ADDON_CITY_MONTHLY,       yearly: process.env.PRICE_ADDON_CITY_YEARLY },
      highway:    { monthly: process.env.PRICE_ADDON_HIGHWAY_MONTHLY,    yearly: process.env.PRICE_ADDON_HIGHWAY_YEARLY },
      bestfinder: { monthly: process.env.PRICE_ADDON_BESTFINDER_MONTHLY, yearly: process.env.PRICE_ADDON_BESTFINDER_YEARLY },
      safety:     { monthly: process.env.PRICE_ADDON_SAFETY_MONTHLY,     yearly: process.env.PRICE_ADDON_SAFETY_YEARLY },
      cb:         { monthly: process.env.PRICE_ADDON_CB_MONTHLY,         yearly: process.env.PRICE_ADDON_CB_YEARLY },
      voice:      { monthly: process.env.PRICE_ADDON_VOICE_MONTHLY,      yearly: process.env.PRICE_ADDON_VOICE_YEARLY },
      agent:      { monthly: process.env.PRICE_ADDON_AGENT_MONTHLY,      yearly: process.env.PRICE_ADDON_AGENT_YEARLY },
      pay:        { monthly: process.env.PRICE_ADDON_PAY_MONTHLY,        yearly: process.env.PRICE_ADDON_PAY_YEARLY },
      score:      { monthly: process.env.PRICE_ADDON_SCORE_MONTHLY,      yearly: process.env.PRICE_ADDON_SCORE_YEARLY },
    }

    const planPrice = planPriceIds[plan]?.[billing]
    if (!planPrice) return NextResponse.json({ error: 'Plan price not configured' }, { status: 400 })

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{ price: planPrice, quantity: 1 }]
    for (const id of addOns || []) {
      const map = addOnPriceIds[id]; const p = billing === 'monthly' ? map?.monthly : map?.yearly
      if (p) line_items.push({ price: p, quantity: 1 })
    }

    // Optional: resolve a promo code by code string
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined
    if (couponCode) {
      const promoList = await stripe.promotionCodes.list({ code: couponCode, limit: 1 })
      const promo = promoList.data[0]
      discounts = promo?.id ? [{ promotion_code: promo.id }] : [{ coupon: couponCode }]
    }

    const base = process.env.BASE_URL || 'http://localhost:3000'
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items,
      // Taxes: let Stripe compute based on customer address
      automatic_tax: { enabled: true },
      billing_address_collection: 'required',
      // Let users enter codes on Stripe too
      allow_promotion_codes: true,
      discounts,

      subscription_data: {
        trial_period_days: 14,
      },
      success_url: `${base}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/billing/choose-plan`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'Stripe error' }, { status: 500 })
  }
}

