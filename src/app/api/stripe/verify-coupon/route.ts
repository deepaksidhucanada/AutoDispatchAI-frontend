// src/app/api/stripe/verify-coupon/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ ok: false, error: "No code provided" }, { status: 400 });

    // Expand coupon so we can read its fields
    const promos = await stripe.promotionCodes.list({
      code,
      limit: 1,
      expand: ["data.coupon"],
    });

    const promo = promos.data[0];
    if (!promo) return NextResponse.json({ ok: false, error: "Invalid code" });

    // Some Stripe TS versions don't expose promo.coupon in the type.
    // Use a safe cast:
    const coupon = (promo as unknown as { coupon?: Stripe.Coupon }).coupon;

    if (!coupon) {
      // Fallback: fetch by ID if present on metadata (rare) or just say it's valid
      return NextResponse.json({ ok: true, code: promo.code, discount: "Valid promotion code" });
    }

    const discount =
      typeof coupon.percent_off === "number"
        ? `${coupon.percent_off}% off`
        : typeof coupon.amount_off === "number"
        ? `$${(coupon.amount_off / 100).toFixed(2)} off`
        : "Valid coupon";

    const expires = coupon.redeem_by ? new Date(coupon.redeem_by * 1000).toLocaleDateString() : null;

    return NextResponse.json({
      ok: true,
      code: promo.code,
      discount,
      expires,
      times_redeemed: promo.times_redeemed ?? null,
      max_redemptions: promo.max_redemptions ?? null,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "Lookup failed" }, { status: 500 });
  }
}

