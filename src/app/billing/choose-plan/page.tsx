'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type BillingCycle = 'monthly' | 'yearly'
type PlanName = 'ESSENTIALS' | 'PRO' | 'ENTERPRISE'

type Plan = {
  name: PlanName
  popular: boolean
  monthly: number | null // null => custom pricing
  tagline: string
  features: string[]
  yearlyDiscount: number // e.g. 0.15 = 15%
}

type AddOn = {
  id: string
  title: string
  desc: string
  monthly: number // per truck / month
}

/* =========================
   CORE PLANS
   ========================= */
const PLANS: Plan[] = [
  {
    name: 'ESSENTIALS',
    popular: false,
    monthly: 49,
    tagline: 'Stop drowning in emails. We organize your loads, you close the deals.',
    features: [
      'Smart Email Reader (Reads & adds load emails automatically)',
      'Load Profit Checker (Shows which loads pay best)',
      'Live Dispatch Dashboard (No more spreadsheets)',
      '1-Click Broker Reply (Send offers in seconds)',
      'Standard Email Support',
    ],
    yearlyDiscount: 0.15, // 15%
  },
  {
    name: 'PRO',
    popular: true,
    monthly: 79,
    tagline: 'Get a 360°, real-time view of your operations.',
    features: [
      'Everything in ESSENTIALS, PLUS:',
      'Smart Driver Matching (AI matches loads to drivers)',
      'Hot Load Alerts (High-profit load pings)',
      'Live ELD Integration (Samsara)',
      'Auto-Book Trusted Brokers',
      'Advanced Analytics Dashboard',
    ],
    yearlyDiscount: 0.22, // 22%
  },
  {
    name: 'ENTERPRISE',
    popular: false,
    monthly: null,
    tagline: 'Your complete, AI-powered dispatch department.',
    features: [
      'Everything in PRO, PLUS:',
      'Advanced Route Optimizer (Profitable triangle loads)',
      'Proactive Problem Solver (Trailer swap suggestions)',
      'Multi-User Roles & Permissions',
      'Dedicated Account Manager & 24/7 Priority Support',
    ],
    yearlyDiscount: 0, // custom
  },
]

/* =========================
   ADD-ONS (per truck / month)
   ========================= */
const ADD_ONS: AddOn[] = [
  { id: 'city',       title: 'City Dispatch Maestro',  desc: 'Plans all your city pickups & deliveries automatically.', monthly: 15 },
  { id: 'highway',    title: 'Highway Chess Master',   desc: 'Unlocks “Grandmaster AI”: Triangle Load Hunter, HOS-Aware Scheduling, In-Transit Load Swap suggestions.', monthly: 20 },
  { id: 'bestfinder', title: 'Best Load Finder',       desc: 'Finds and pins the most profitable loads across boards automatically.', monthly: 15 },
  { id: 'safety',     title: 'AI Safety Supervisor',   desc: 'Alerts for overspeeding or harsh braking.', monthly: 10 },
  { id: 'cb',         title: 'Cross-Border Compliance',desc: 'Files ACE/ACI e-Manifests automatically.', monthly: 20 },
  { id: 'voice',      title: '24/7 Voice & SMS Assistant', desc: 'AI assistant that talks to brokers & drivers.', monthly: 10 },
  { id: 'agent',      title: 'Personalized AI Agent',  desc: 'Builds personal relationships with your top brokers.', monthly: 15 },
  { id: 'pay',        title: 'Finance & Admin: Automated Invoicing & Payroll', desc: 'Unlocks the CLERK agent to automate invoicing and generate payroll-ready reports.', monthly: 15 },
  { id: 'score',      title: 'Broker Scorecard & Risk Alerts', desc: 'Credit/OTR risk signals & fraud prevention alerts on broker profiles.', monthly: 10 },
]

/* =========================
   helpers
   ========================= */
function priceForCycle(monthly: number, cycle: BillingCycle, discount: number): number {
  if (cycle === 'monthly') return monthly
  // yearly = 12 months minus discount
  return Math.round(monthly * 12 * (1 - discount))
}
function savingsPercent(discount: number): number {
  return Math.round(discount * 100)
}

/* =========================
   PAGE
   ========================= */
export default function ChoosePlanPage() {
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<PlanName>('PRO') // default: PRO
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)

  const plan = useMemo(() => PLANS.find(p => p.name === selectedPlan)!, [selectedPlan])
  const isEnterprise = plan.monthly == null

  const planPrice = useMemo(() => {
    if (plan.monthly == null) return 0
    return priceForCycle(plan.monthly, billing, plan.yearlyDiscount)
  }, [plan, billing])

  const addOnsMonthlySum = useMemo(
    () => ADD_ONS.filter(a => selectedAddOns[a.id]).reduce((sum, a) => sum + a.monthly, 0),
    [selectedAddOns]
  )

  const addOnsTotal = useMemo(() => {
    if (billing === 'monthly') return addOnsMonthlySum
    // yearly for add-ons uses SAME discount as chosen plan (simple rule)
    return Math.round(addOnsMonthlySum * 12 * (1 - plan.yearlyDiscount))
  }, [addOnsMonthlySum, billing, plan.yearlyDiscount])

  const grandTotal = useMemo(() => {
    if (plan.monthly == null) return 0 // enterprise = custom
    return planPrice + addOnsTotal
  }, [planPrice, addOnsTotal, plan.monthly])

  function toggleAddOn(id: string) {
    setSelectedAddOns(prev => ({ ...prev, [id]: !prev[id] }))
  }

  async function checkout() {
    setLoading(true)
    try {
      if (plan.name === 'ENTERPRISE') {
        window.location.href =
          'mailto:hansnitin58@gmail.com?subject=AutoDispatchAI%20Enterprise&body=Hi%2C%20we%27d%20like%20custom%20pricing.'
        return
      }

      const { data: s } = await supabase.auth.getSession()
      const token = s.session?.access_token
      if (!token) { window.location.href = '/login'; return }

      const chosenAddOnIds = Object.keys(selectedAddOns).filter(k => selectedAddOns[k])

      const res = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: plan.name,      // 'ESSENTIALS' | 'PRO'
          billing,              // 'monthly' | 'yearly'
          addOns: chosenAddOnIds, // e.g. ['city','highway']
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Checkout error')
      window.location.href = json.url
    } catch (e:any) {
      alert(e?.message || 'Checkout error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <div className="border-b py-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black">AutoDispatchAI</h1>
        <p className="text-sm text-neutral-500 mt-2">Choose your plan</p>

        {/* 14-day Free Trial banner */}
        <div className="mt-3 flex justify-center">
          <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1">
            14-Day Free Trial on ALL Plans
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr,380px] gap-10">
        {/* Left: Plans + Add-ons */}
        <div>
          {/* Billing Toggle / Enterprise contact */}
          <div className="flex justify-center mb-10">
            {isEnterprise ? (
              <div className="flex flex-col items-center gap-3">
                <span className="px-4 py-2 rounded-full text-sm font-semibold border bg-neutral-100 text-neutral-900">
                  <span className="font-bold">Custom pricing</span> — Contact Sales
                </span>
                <div className="flex gap-3">
                  <a
                    href="mailto:hansnitin58@gmail.com?subject=AutoDispatchAI%20Enterprise"
                    className="h-10 px-4 rounded-xl bg-black text-white text-sm font-medium flex items-center justify-center hover:bg-neutral-900"
                  >
                    Email Sales
                  </a>
                  <a
                    href="tel:+14164274542"
                    className="h-10 px-4 rounded-xl border border-neutral-300 text-sm font-medium flex items-center justify-center hover:bg-neutral-50"
                  >
                    Call Sales (+1 416-427-4542)
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 border rounded-full px-2 py-1 bg-neutral-100">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${billing === 'monthly' ? 'bg-black text-white' : 'text-neutral-600'}`}
                  onClick={() => setBilling('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${billing === 'yearly' ? 'bg-black text-white' : 'text-neutral-600'}`}
                  onClick={() => setBilling('yearly')}
                >
                  Yearly{' '}
                  <span className="text-emerald-500 font-semibold ml-1">
                    Save {savingsPercent(plan.yearlyDiscount)}%
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((p) => {
              const active = p.name === selectedPlan
              const showSave = p.monthly != null && billing === 'yearly' && p.yearlyDiscount > 0
              const perCycle = p.monthly != null ? priceForCycle(p.monthly, billing, p.yearlyDiscount) : 0
              const compareAnnual = p.monthly != null ? p.monthly * 12 : 0
              const savedAmount = p.monthly != null && billing === 'yearly'
                ? compareAnnual - perCycle
                : 0

              return (
                <motion.button
                  key={p.name}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedPlan(p.name)}
                  className={`relative text-left border rounded-2xl p-6 shadow-sm transition ${
                    active ? 'border-black shadow-md' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="text-sm text-neutral-500 mt-1">{p.tagline}</p>

                  <div className="mt-5">
                    {p.monthly == null ? (
                      <p className="text-3xl font-bold">Custom</p>
                    ) : (
                      <>
                        <p className="text-3xl font-bold">
                          ${perCycle}
                          <span className="text-base font-normal text-neutral-500">
                            {' '} / {billing === 'yearly' ? 'year' : 'month'}
                          </span>
                          <span className="block text-xs text-neutral-500">(per truck)</span>
                        </p>
                        {showSave && (
                          <p className="text-xs text-emerald-600 mt-1">
                            Save ${savedAmount} ({savingsPercent(p.yearlyDiscount)}%) yearly
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <ul className="mt-5 text-sm text-neutral-700 space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span>✅</span><span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.button>
              )
            })}
          </div>

          {/* Add-ons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold">Build Your Own Add-Ons</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Select add-ons to include with <span className="font-medium">{selectedPlan}</span>. Each add-on is billed per truck, per {isEnterprise ? '—' : (billing === 'yearly' ? 'year' : 'month')}.
            </p>

            <div className="mt-6 grid gap-3">
              {ADD_ONS.map((a) => {
                const cyclePrice = isEnterprise
                  ? a.monthly // enterprise is sales-led; show base
                  : (billing === 'monthly' ? a.monthly : Math.round(a.monthly * 12 * (1 - plan.yearlyDiscount)))

                return (
                  <label
                    key={a.id}
                    className={`flex items-start gap-3 border rounded-xl p-4 ${isEnterprise ? 'opacity-60' : 'hover:bg-neutral-50 cursor-pointer'}`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4"
                      checked={!!selectedAddOns[a.id]}
                      onChange={() => toggleAddOn(a.id)}
                      disabled={isEnterprise}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{a.title}</span>
                        <span className="text-sm font-medium">
                          +${cyclePrice} {isEnterprise ? '' : ` / ${billing === 'yearly' ? 'year' : 'month'}`}{' '}
                          <span className="text-xs text-neutral-500">(per truck)</span>
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">{a.desc}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="sticky top-6 h-fit border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Summary</h3>
          <p className="text-sm text-neutral-500">
            Per truck • {isEnterprise ? 'Custom' : (billing === 'yearly' ? 'Yearly' : 'Monthly')} billing
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Plan — {plan.name}</span>
              <span>{isEnterprise ? 'Custom' : `$${planPrice}`}</span>
            </div>

            {!isEnterprise && ADD_ONS.filter(a => selectedAddOns[a.id]).map(a => {
              const c = billing === 'monthly' ? a.monthly : Math.round(a.monthly * 12 * (1 - plan.yearlyDiscount))
              return (
                <div key={a.id} className="flex justify-between text-neutral-700">
                  <span>+ {a.title}</span>
                  <span>${c}</span>
                </div>
              )
            })}

            <hr className="my-3" />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{isEnterprise ? 'Contact Sales' : `$${grandTotal}`}</span>
            </div>
          </div>

          {/* ALWAYS primary black button */}
          <button
            onClick={checkout}
            disabled={loading} // enterprise not disabled; it opens email
            className="mt-5 h-11 w-full rounded-xl font-medium tracking-tight bg-black text-white hover:bg-neutral-900 disabled:opacity-60"
          >
            {plan.name === 'ENTERPRISE'
              ? 'Contact Sales'
              : (loading ? 'Processing…' : `Continue with ${plan.name}`)}
          </button>

          <p className="text-xs text-neutral-500 mt-3">
            Change or remove add-ons anytime from Billing. Taxes may apply.
          </p>
        </div>
      </div>
    </div>
  )
}

