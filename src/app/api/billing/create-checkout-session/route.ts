import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// SINGLE POST handler only
export async function POST(req: Request) {
  // Billing temporarily disabled? return 501
  if (process.env.BILLING_ENABLED === "false") {
    return NextResponse.json(
      { ok: false, disabled: true, reason: "billing temporarily disabled" },
      { status: 501 }
    );
  }

  // TODO: real Stripe session code will come later
  return NextResponse.json(
    { ok: true, note: "checkout stub (billing enabled)" },
    { status: 200 }
  );
}

// (Optional) keep GET for health if you want
export async function GET() {
  return NextResponse.json(
    { ok: true, note: "create-checkout-session endpoint alive" },
    { status: 200 }
  );
}
