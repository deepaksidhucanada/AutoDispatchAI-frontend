import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const CURRENCY = "cad";
const ESSENTIALS_YEARLY_DISCOUNT = 0.15;
const PRO_YEARLY_DISCOUNT = 0.22;
const ADDON_YEARLY_DISCOUNT = 0.22;

const PLANS = [
  {
    name: "AutoDispatchAI Essentials Plan",
    description: "Smart email reader, profit checker, live board, 1-click broker reply.",
    monthlyUSD: 49,
    yearlyDiscount: ESSENTIALS_YEARLY_DISCOUNT,
    createPrices: true,
  },
  {
    name: "AutoDispatchAI Pro Plan",
    description: "Driver matching, hot load alerts, Samsara ELD, auto-book, analytics.",
    monthlyUSD: 79,
    yearlyDiscount: PRO_YEARLY_DISCOUNT,
    createPrices: true,
  },
  {
    name: "AutoDispatchAI Enterprise Plan",
    description: "Full AI-powered dispatch department. Custom pricing via Sales.",
    createPrices: false,
  },
] as const;

const ADDONS = [
  { name: "AutoDispatchAI — Add-on: City Dispatch Maestro",  description: "Plans all your city pickups & deliveries automatically.", monthlyUSD: 15 },
  { name: "AutoDispatchAI — Add-on: Highway Chess Master",   description: "Triangle Load Hunter, HOS-aware scheduling, in-transit swaps.", monthlyUSD: 20 },
  { name: "AutoDispatchAI — Add-on: Best Load Finder",       description: "Scans boards, ranks margin, pins top loads.", monthlyUSD: 15 },
  { name: "AutoDispatchAI — Add-on: AI Safety Supervisor",   description: "Alerts for overspeeding/harsh braking.", monthlyUSD: 10 },
  { name: "AutoDispatchAI — Add-on: Cross-Border Compliance",description: "Files ACE/ACI e-Manifests automatically.", monthlyUSD: 20 },
  { name: "AutoDispatchAI — Add-on: 24/7 Voice & SMS Assistant", description: "AI assistant that talks to brokers & drivers.", monthlyUSD: 10 },
  { name: "AutoDispatchAI — Add-on: Personalized AI Agent",  description: "Builds relationships with top brokers.", monthlyUSD: 15 },
  { name: "AutoDispatchAI — Add-on: Finance & Admin (Invoicing & Payroll)", description: "CLERK automates invoicing & payroll reports.", monthlyUSD: 15 },
  { name: "AutoDispatchAI — Add-on: Broker Scorecard & Risk Alerts", description: "Credit/OTR risk & fraud alerts.", monthlyUSD: 10 },
];

function cents(n: number) { return Math.round(n * 100); }

async function upsertProduct(stripe: Stripe, name: string, description?: string) {
  const list = await stripe.products.list({ limit: 100, active: true });
  let product = list.data.find(p => p.name === name);
  if (!product) product = await stripe.products.create({ name, description, type: "service" });
  else if (description && product.description !== description) product = await stripe.products.update(product.id, { description });
  return product;
}

async function findExistingPrice(stripe: Stripe, product: string, unit_amount: number, interval: "month" | "year") {
  const prices = await stripe.prices.list({ product, active: true, limit: 100 });
  return prices.data.find(p => p.currency === CURRENCY && p.unit_amount === unit_amount && p.type === "recurring" && p.recurring?.interval === interval);
}

async function findOrCreateRecurringPrice(stripe: Stripe, product: string, usd: number, interval: "month" | "year") {
  const unit_amount = cents(usd);
  const existing = await findExistingPrice(stripe, product, unit_amount, interval);
  if (existing) return existing;
  return stripe.prices.create({ product, currency: CURRENCY, unit_amount, recurring: { interval } });
}

export async function GET() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY missing");

    const plansOut: Record<string, { product: string; monthly?: string; yearly?: string }> = {};
    for (const plan of PLANS) {
      const product = await upsertProduct(stripe, plan.name, plan.description);
      const out: { product: string; monthly?: string; yearly?: string } = { product: product.id };
      if (plan.createPrices) {
        const monthly = await findOrCreateRecurringPrice(stripe, product.id, plan.monthlyUSD!, "month");
        const yearly = await findOrCreateRecurringPrice(stripe, product.id, plan.monthlyUSD! * 12 * (1 - plan.yearlyDiscount!), "year");
        out.monthly = monthly.id; out.yearly = yearly.id;
      }
      plansOut[plan.name] = out;
    }

    const addonsOut: Record<string, { product: string; monthly: string; yearly: string }> = {};
    for (const a of ADDONS) {
      const product = await upsertProduct(stripe, a.name, a.description);
      const monthly = await findOrCreateRecurringPrice(stripe, product.id, a.monthlyUSD, "month");
      const yearly  = await findOrCreateRecurringPrice(stripe, product.id, a.monthlyUSD * 12 * (1 - ADDON_YEARLY_DISCOUNT), "year");
      addonsOut[a.name] = { product: product.id, monthly: monthly.id, yearly: yearly.id };
    }

    return NextResponse.json({ ok: true, currency: CURRENCY, plans: plansOut, addons: addonsOut });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Error" }, { status: 500 });
  }
}


