// src/app/api/stripe/create-products/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";          // keep Node runtime for future Stripe usage
export const dynamic = "force-dynamic";   // avoid static analysis/prerender

/**
 * TEMP STUB:
 * This endpoint is intentionally a no-op for now so the app deploys cleanly.
 * Later, we’ll add Stripe product/price creation (idempotent) here.
 */

export async function POST() {
  return NextResponse.json(
    {
      ok: true,
      note:
        "create-products is currently stubbed (no-op). Set your PRICE_* envs and use checkout.",
    },
    { status: 200 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      note:
        "create-products is currently stubbed (no-op). Use POST later to upsert products/prices.",
    },
    { status: 200 }
  );
}


