// src/app/api/billing/create-checkout-session/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";          // Stripe SDK needs Node runtime
export const dynamic = "force-dynamic";   // avoid static analysis/prerender

type Plan = "ESSENTIALS" | "PRO";
type Billing = "monthly" | "yearly";

function getBaseUrl(req: Request) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  try {
    const url = new URL(req.url);
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      plan?: Plan;
      billing?: Billing;
      addOns?: string[];
      couponCode?: string;
    };

    const plan = body.plan;
    const billing = body.billing;
    const addOns = body.addOns ?? [];
    const couponCode = body.couponCode?.trim();

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "Server misconfigured: STRIPE_SECRET_KEY not set" },
        { status: 500 }
      );
    }

    // ⬇️ Dynamic import at runtime (no top-level Stripe, no TS namespace)
    const { default: Stripe } = await import("stripe");
    // NOTE: some stripe typings in your env force a literal apiVersion.
    // We bypass by casting options to any (safe for runtime).
    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" } as any);

    if (!plan || !billing || (plan !== "ESSENTIALS" && plan !== "PRO") || (billing !== "monthly" && billing !== "yearly")) {
      return NextResponse.json(
        { error: "Invalid plan or billing cycle" },
        { status: 400 }
      );
    }

    // Main plan prices from env
    const planPriceIds = {
      ESSENTIALS: {
        monthly: process.env.PRICE_ESSENTIALS_MONTHLY,
        yearly: process.env.PRICE_ESSENTIALS_YEARLY,
      },
      PRO: {
        monthly: process.env.PRICE_PRO_MONTHLY,
        yearly: process.env.PRICE_PRO_YEARLY,
      },
    } as const;

    const planPrice = planPriceIds[plan][billing];
    if (!planPrice) {
      return NextResponse.json(
        { error: `Missing env for plan price: ${plan} (${billing})` },
        { status: 400 }
      );
    }

    // Optional add-ons
    const addOnPriceIds: Record<
      string,
      { monthly?: string | undefined; yearly?: string | undefined }
    > = {
      city:       { monthly: process.env.PRICE_ADDON_CITY_MONTHLY,       yearly: process.env.PRICE_ADDON_CITY_YEARLY },
      highway:    { monthly: process.env.PRICE_ADDON_HIGHWAY_MONTHLY,    yearly: process.env.PRICE_ADDON_HIGHWAY_YEARLY },
      bestfinder: { monthly: process.env.PRICE_ADDON_BESTFINDER_MONTHLY, yearly: process.env.PRICE_ADDON_BESTFINDER_YEARLY },
      safety:     { monthly: process.env.PRICE_ADDON_SAFETY_MONTHLY,     yearly: process.env.PRICE_ADDON_SAFETY_YEARLY },
      cb:         { monthly: process.env.PRICE_ADDON_CB_MONTHLY,         yearly: process.env.PRICE_ADDON_CB_YEARLY },
      voice:      { monthly: process.env.PRICE_ADDON_VOICE_MONTHLY,      yearly: process.env.PRICE_ADDON_VOICE_YEARLY },
      agent:      { monthly: process.env.PRICE_ADDON_AGENT_MONTHLY,      yearly: process.env.PRICE_ADDON_AGENT_YEARLY },
      pay:        { monthly: process.env.PRICE_ADDON_PAY_MONTHLY,        yearly: process.env.PRICE_ADDON_PAY_YEARLY },
      score:      { monthly: process.env.PRICE_ADDON_SCORE_MONTHLY,      yearly: process.env.PRICE_ADDON_SCORE_YEARLY },
    };

    // Stripe types avoid: use plain objects
    const line_items: Array<{ price: string; quantity: number }> = [
      { price: planPrice, quantity: 1 },
    ];

    for (const key of addOns) {
      const map = addOnPriceIds[key];
      if (!map) continue;
      const p = billing === "monthly" ? map.monthly : map.yearly;
      if (p) line_items.push({ price: p, quantity: 1 });
    }

    // Discounts: prefer promotion codes
    let discounts:
      | Array<{ promotion_code?: string; coupon?: string }>
      | undefined;

    if (couponCode) {
      const promos = await stripe.promotionCodes.list({ code: couponCode, limit: 1 });
      const promo = promos.data[0];
      if (promo?.id) {
        discounts = [{ promotion_code: promo.id }];
      } else {
        // fallback to coupon id (only if couponCode actually is a coupon id)
        discounts = [{ coupon: couponCode }];
      }
    }

    const base = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items,
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      subscription_data: { trial_period_days: 14 },
      allow_promotion_codes: true,
     
      discounts,
      success_url: `${base}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/billing/choose-plan`,
    } as any); // final cast to bypass literal type quirks

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Stripe error" },
      { status: 500 }
    );
  }
}
