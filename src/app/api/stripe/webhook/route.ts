import { NextResponse } from "next/server";

export const runtime = "edge"; // ok if you keep nodejs too

export async function POST(req: Request) {
  // temporary stub: just tell Stripe the endpoint is alive
  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET() {
  // quick check in browser
  return NextResponse.json({ status: "stripe webhook alive" });
}
