'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Menu, X, Lock, Shield, Truck, Check } from 'lucide-react'

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* ================= HEADER (brand left, nav + CTA right) ================= */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl h-16 px-4 flex items-center justify-between gap-3">
          {/* Brand (left) */}
          <a href="/" aria-label="AutoDispatchAI" className="flex items-center gap-2">
            {/* Optional logo: uncomment if you want the orange A badge next to the wordmark */}
            {/* <img src="/logo.svg" alt="AutoDispatchAI Logo" className="h-7 w-auto" /> */}
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="font-extrabold tracking-tight text-2xl sm:text-3xl"
            >
              Auto
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500">
                Dispatch
              </span>
              AI
            </motion.span>
          </a>

          {/* Nav + CTA (right) */}
<div className="hidden md:flex items-center gap-6">
  <nav className="flex items-center gap-6 text-sm">
    <a href="#features" className="hover:text-purple-700">Features</a>
    <a href="#why-fleets" className="hover:text-purple-700">Why Fleets</a>
    <a href="#impact" className="hover:text-purple-700">Impact</a>
    <a href="#roi" className="hover:text-purple-700">ROI</a>
    <a href="#loop" className="hover:text-purple-700 whitespace-nowrap">Human&nbsp;+&nbsp;AI</a>
    <a href="#steps" className="hover:text-purple-700">4 Steps</a>
    <a href="#why" className="hover:text-purple-700">Why Us</a>
    <a href="#team" className="hover:text-purple-700">Team</a>
    <a href="#faq" className="hover:text-purple-700">FAQ</a>
  </nav>

  {/* CTA pair: Login (secondary) + Start Trial (primary → /signup) */}
  <div className="flex items-center gap-3">
    <a href="/login" className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-purple-700">
      Log in
    </a>
    <a
      href="/signup"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 text-white text-sm font-semibold hover:opacity-90"
      aria-label="Start 14-Day Trial (Sign up)"
    >
      Start 14-Day Trial
    </a>
  </div>
</div>


          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(true)} aria-label="Open Menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-white"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
                <span className="font-extrabold">AutoDispatchAI</span>
                <button className="p-2" onClick={() => setMobileOpen(false)} aria-label="Close Menu">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 grid gap-4 text-lg">
                {[
                  ['#features', 'Features'],
                  ['#why-fleets', 'Why Fleets'],
                  ['#impact', 'Impact'],
                  ['#roi', 'ROI'],
                  ['#loop', 'Human + AI'],
                  ['#steps', '4 Steps'],
                  ['#why', 'Why Us'],
                  ['#team', 'Team'],
                  ['#faq', 'FAQ'],
                ].map(([href, label]) => (
                  <a key={href} href={href} onClick={() => setMobileOpen(false)} className="hover:text-purple-700">
                    {label}
                  </a>
                ))}
                <div className="pt-2">
  <a href="/login" className="block py-3">Log in</a>
  <a
    href="/signup"
    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 text-white font-semibold hover:opacity-90"
    aria-label="Start 14-Day Trial (Sign up)"
  >
    Start 14-Day Trial
  </a>
</div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ================= HERO ================= */}
      <section className="py-24 text-center px-4">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          <span className="block bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Your Dispatcher Never Sleeps.
          </span>
          <span className="block mt-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
            Neither Should Your Profits.
          </span>
        </h1>
        <p className="max-w-3xl mx-auto mt-6 text-lg text-neutral-600">
          AI dispatch automation for modern fleets — your 24/7 digital dispatcher that finds loads, negotiates, tracks, and notifies.
          Built by dispatchers & engineers. Cross-border ready.
        </p>
        <div className="mt-6 flex justify-center">
          <span className="text-xs rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1">
            Human-in-the-loop • Up to 80% automation*
          </span>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/signup" className="px-6 py-3 rounded-xl bg-neutral-900 text-white font-semibold hover:bg-neutral-800">Get Started</a>
          <a href="#features" className="px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-50">Explore Features</a>
        </div>
        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-neutral-700">
          <div className="flex items-center gap-2"><Lock className="h-5 w-5 text-emerald-600" /> SOC 2 program in progress</div>
          <div className="flex items-center gap-2"><Truck className="h-5 w-5 text-emerald-600" /> Gmail & Outlook live</div>
          <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-emerald-600" /> RLS & least-privilege</div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-20 border-t border-neutral-200 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">All-in-one dispatch cockpit</h2>
            <p className="mt-3 text-neutral-600">Win better loads faster — in one clean, modern app.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Smart Email Reader', desc: 'Reads load emails and extracts lanes, RPM, pickup/delivery windows — auto-adds to your queue.' },
              { title: 'Hot Load Alerts', desc: 'Instant pings for high-profit loads that match your lanes & driver availability.' },
              { title: 'AI Negotiator', desc: 'Prepares broker replies with your target RPM and guardrails — you approve, we send.' },
              { title: 'Driver Matching', desc: 'AI pairs loads to drivers using hometime, HOS, lane history, and equipment type.' },
              { title: 'Live Ops Dashboard', desc: 'One screen for ETAs, docs, notes, and exceptions — no more spreadsheets.' },
              { title: 'Cross-Border Ready', desc: 'ACE/ACI e-Manifests workflow designed for US↔CA carriers (coming soon).' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-neutral-200 p-6 bg-white hover:shadow-md transition"
              >
                <div className="h-36 w-full rounded-xl border border-dashed border-neutral-300 mb-4 grid place-items-center text-xs text-neutral-400">
                  Preview / GIF
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY FLEETS CHOOSE ================= */}
      <section id="why-fleets" className="py-16 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Why fleets choose AutoDispatchAI</h2>
            <p className="mt-3 text-neutral-600">Smart Load Bot • Live Ops Map • Border-Ready</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { t: 'Smart Load Bot', d: 'Auto-search & shortlist loads (LTL/FTL) with target RPM.' },
              { t: 'Live Ops Map', d: 'Real-time GPS (Samsara), ETAs, and exception alerts.' },
              { t: 'Border-Ready', d: 'eManifest automation (US↔CA) with status updates.' },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="font-semibold">{c.t}</div>
                <p className="mt-2 text-sm text-neutral-600">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= IMPACT ================= */}
      <section id="impact" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Real impact, real savings</h2>
            <p className="mt-3 text-neutral-600">Early pilots with human-in-the-loop show strong gains for busy dispatch teams.</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { k: 'Up to 80%', v: 'Workflows automated', s: 'Email triage, matching, draft replies, status updates' },
              { k: '30–50%', v: 'Planner time saved', s: 'Fewer tabs; faster, guard-railed approvals' },
              { k: '3–7%', v: 'Margin lift', s: 'Faster replies, better RPM discipline, fewer misses' },
            ].map((m) => (
              <div key={m.k} className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                  {m.k}
                </div>
                <div className="mt-1 text-base font-semibold">{m.v}</div>
                <p className="mt-2 text-sm text-neutral-600">{m.s}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-neutral-500">
            *Directional estimates from early pilots and internal benchmarks; results vary by fleet size, lanes, and workflow.
          </p>
        </div>
      </section>

      {/* ================= ROI ================= */}
      <section id="roi" className="py-16 px-4 bg-neutral-50">
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2 items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Estimate your savings</h2>
            <p className="mt-2 text-neutral-600">Quick back-of-the-envelope: time saved × cost per hour.</p>
            <ROIForm />
            <p className="mt-3 text-xs text-neutral-500">
              Example: 10 dispatchers ≈ $60k/mo → after: 2 dispatchers + platform ≈ $19k/mo → <strong>$40k+/mo saved</strong> for a 100-truck fleet (varies).
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="h-64 w-full rounded-xl border border-dashed border-neutral-300 grid place-items-center text-sm text-neutral-400">
              Savings chart / screenshot placeholder
            </div>
            <p className="mt-4 text-sm text-neutral-600">Replace with a small chart or case-study card later.</p>
          </div>
        </div>
      </section>

      {/* ================= HUMAN + AI LOOP ================= */}
      <section id="loop" className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Human + AI, one continuous loop</h2>
            <p className="mt-3 text-neutral-600">AI does the grunt work; your team stays in control. Review → Approve → Scale.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              { n: '1', t: 'Scan & Classify', d: 'AI reads emails & load boards 24/7 — zero missed opportunities.' },
              { n: '2', t: 'Match & Recommend', d: 'Suggests profitable driver↔load pairs by lane, HOS & RPM.' },
              { n: '3', t: 'Negotiate & Book', d: 'Generates replies and books trusted brokers with your approval.' },
              { n: '4', t: 'Track & Update', d: 'Live status, docs, and alerts roll up to the dashboard automatically.' },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-neutral-200 p-5 bg-white"
              >
                <div className="text-sm text-neutral-500">Step {s.n}</div>
                <div className="mt-1 font-semibold">{s.t}</div>
                <p className="mt-2 text-sm text-neutral-600">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOUR STEPS (UPDATED FOR SUPABASE) ================= */}
      <section id="steps" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Your Dispatch, Fully Automated</h2>
            <p className="mt-3 text-neutral-600">Four steps to value — simple for trucking teams</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              {
                t: 'Ingest',
                d: 'Secure login via Supabase. Connect Gmail/Outlook for load emails and Samsara for GPS/HOS.'
              },
              {
                t: 'Discover',
                d: 'AI reads emails, spots good lanes near your drops, and ranks loads by RPM & fit.'
              },
              {
                t: 'Book',
                d: 'AI drafts broker replies with your guardrails. You tap approve — we send and confirm.'
              },
              {
                t: 'Deliver',
                d: 'Driver updates auto-sync. RateCon & POD are tracked; invoice handoff is one click.'
              },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="font-semibold">{c.t}</div>
                <p className="mt-2 text-sm text-neutral-600">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY WE BUILT THIS ================= */}
      <section id="why" className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Built for real fleets, not demos</h2>
            <p className="mt-4 text-neutral-700">
              Dispatch is chaos — missed emails, slow replies, wrong pairings, and money left on the table.
              AutoDispatchAI gives carriers a calm cockpit: load intel in one place, smart matching, guard-railed replies,
              and live status without spreadsheet drama.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-neutral-800">
              {[
                'Cut manual triage — the system reads and organizes your load emails.',
                'See true profit — check RPM and fit before you commit.',
                'Keep humans in control — the AI proposes; you approve.',
                'Scale with trust — audit trail, RLS, SOC 2 program in progress.',
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 text-emerald-600" /> <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a href="/signup" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 text-white font-semibold hover:bg-neutral-800">
                Start 14-Day Trial <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="h-64 w-full rounded-xl border border-dashed border-neutral-300 grid place-items-center text-sm text-neutral-400">
              Product preview (add screenshot/GIF later)
            </div>
            <p className="mt-4 text-sm text-neutral-600">Drop in a real screenshot/GIF here when ready.</p>
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section id="team" className="py-24 px-4 border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Built by an industry insider and a tech visionary — combining lived trucking experience with sharp engineering.
          </p>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Deepak */}
            <div className="p-8 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition text-left">
              <h3 className="text-xl font-semibold text-neutral-900">Deepak Sidhu — Founder & CEO</h3>
              <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                Deepak drives the vision and strategy behind AutoDispatchAI. With firsthand trucking experience,
                he built this platform to bring automation and profit clarity to dispatchers and carriers.
              </p>
              <div className="mt-5">
                <a
                  href="https://www.linkedin.com/in/deepaksidhu1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2] text-white font-semibold hover:bg-[#094a8f]"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </div>

            {/* Danny */}
            <div className="p-8 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition text-left">
              <h3 className="text-xl font-semibold text-neutral-900">Danny Singh — Co-Founder & Head of Operations</h3>
              <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                Danny brings years of planning experience at top Canadian carriers. He ensures every workflow
                in AutoDispatchAI reflects real-world dispatch practicality.
              </p>
              <div className="mt-5">
                <a
                  href="mailto:danny@autodispatchai.com"
                  className="inline-block w-full text-center px-5 py-2.5 rounded-lg bg-neutral-900 text-white font-semibold hover:bg-neutral-800"
                >
                  Email Danny
                </a>
              </div>
            </div>

            {/* Komal */}
            <div className="p-8 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition text-left">
              <h3 className="text-xl font-semibold text-neutral-900">Komal Sidhu — Co-Founder & Head of Technology</h3>
              <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                Komal oversees product strategy and tech alignment — keeping innovation stable, integrations reliable, and automation measurable.
              </p>
              <div className="mt-5">
                <a
                  href="mailto:komal@autodispatchai.com"
                  className="inline-block w-full text-center px-5 py-2.5 rounded-lg bg-neutral-900 text-white font-semibold hover:bg-neutral-800"
                >
                  Email Komal
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="py-20 px-4 bg-neutral-50 text-center">
        <h3 className="text-3xl font-bold">Questions?</h3>
        <p className="text-neutral-600 mt-2 mb-6">We reply fast during business hours.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:info@autodispatchai.com"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 text-white font-semibold hover:opacity-90"
          >
            info@autodispatchai.com
          </a>
          <a
            href="tel:+14164274542"
            className="px-6 py-3 rounded-xl bg-neutral-900 text-white font-semibold hover:bg-neutral-800"
          >
            Call +1 (416) 427-4542
          </a>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <FAQSection />

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-neutral-200 py-10 text-center text-sm text-neutral-600">
        <p>© {new Date().getFullYear()} AutoDispatchAI Inc., Canada</p>
        <p className="mt-2 flex flex-wrap gap-4 justify-center">
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/security" className="hover:underline">Security</a>
          <a href="mailto:info@autodispatchai.com" className="hover:underline">info@autodispatchai.com</a>
        </p>
      </footer>
    </div>
  )
}

/********************
 * Inline Components
 ********************/

function ROIForm() {
  const [wage, setWage] = useState<number>(35)
  const [hours, setHours] = useState<number>(15)
  const [planners, setPlanners] = useState<number>(2)

  const monthly = Math.max(0, Math.round(wage * hours * planners))
  const yearly = monthly * 12

  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <label className="text-sm">
          <div className="text-neutral-600 mb-1">Dispatcher cost ($/hr)</div>
          <input
            type="number" min={0} step="1" value={wage}
            onChange={(e)=>setWage(Number(e.target.value))}
            className="w-full h-10 rounded-lg border border-neutral-300 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
        <label className="text-sm">
          <div className="text-neutral-600 mb-1">Hours saved / mo (per planner)</div>
          <input
            type="number" min={0} step="1" value={hours}
            onChange={(e)=>setHours(Number(e.target.value))}
            className="w-full h-10 rounded-lg border border-neutral-300 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
        <label className="text-sm">
          <div className="text-neutral-600 mb-1"># of planners</div>
          <input
            type="number" min={1} step="1" value={planners}
            onChange={(e)=>setPlanners(Number(e.target.value))}
            className="w-full h-10 rounded-lg border border-neutral-300 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
      </div>

      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-neutral-200 p-4">
          <div className="text-xs text-neutral-500">Estimated monthly savings</div>
          <div className="mt-1 text-2xl font-extrabold">${monthly.toLocaleString()}</div>
        </div>
        <div className="rounded-xl border border-neutral-200 p-4">
          <div className="text-xs text-neutral-500">Estimated yearly savings</div>
          <div className="mt-1 text-2xl font-extrabold">${yearly.toLocaleString()}</div>
        </div>
      </div>

      <div className="mt-6">
        <a href="#team" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 text-white font-semibold hover:bg-neutral-800">
          Book a 15-minute demo
        </a>
      </div>
    </div>
  )
}

function FAQSection() {
  const faqs = [
    { q: 'What exactly is AutoDispatchAI?', a: 'An AI-assisted dispatch platform that reads emails, finds and negotiates loads, matches drivers, and updates ops with a human-in-the-loop.' },
    { q: 'Is there a free trial?', a: 'Yes — 14 days on all plans.' },
    { q: 'Does it work with my ELD?', a: 'Gmail/Outlook are live. Samsara/Motive integrations are in progress with HOS/location sync.' },
    { q: 'What about cross-border?', a: 'ACE/ACI e-Manifest workflow is designed for US↔CA carriers (coming soon).' },
    { q: 'Is my data secure?', a: 'We follow least-privilege access, Row Level Security, encryption in transit/at rest, and are running a SOC 2 program.' },
  ]
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold tracking-tight text-center mb-10">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full p-4 text-left font-medium flex items-center justify-between">
                <span>{f.q}</span>
                <span className="text-neutral-400">{open === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 text-sm text-neutral-600">
                    {f.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
