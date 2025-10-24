'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type Country = 'USA' | 'Canada';

export default function CreateCompanyProfile() {
  const router = useRouter();

  // form state
  const [country, setCountry] = useState<Country>('Canada');
  const [company, setCompany] = useState('');
  const [regId, setRegId] = useState(''); // DOT or CVOR
  const [address, setAddress] = useState('');
  const [cityProv, setCityProv] = useState('');
  const [refCode, setRefCode] = useState('');
  const [phone, setPhone] = useState('+1 (416) 427-4542');
  const [email, setEmail] = useState('');
  const [agreeTos, setAgreeTos] = useState(false);
  const [optIn, setOptIn] = useState(true);

  // ui state
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!agreeTos) {
      setErr('Please agree to the Terms & Privacy Policy.');
      return;
    }
    if (!company.trim() || !address.trim() || !email.trim() || !regId.trim()) {
      setErr('Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/company/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: company.trim(),
          dot_number: regId.trim(),
        }),
      });

      const ct = res.headers.get('content-type') || '';
      const payload = ct.includes('application/json')
        ? await res.json()
        : { error: 'Unexpected non-JSON response. Check API route.' };

      if (!res.ok) throw new Error(payload?.error || `HTTP ${res.status}`);

      setOk(true);
      setTimeout(() => router.push('/billing/choose-plan'), 700);
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* brand accent bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500" />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        {/* header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Create a Company Profile
          </h1>
          <p className="mt-2 text-neutral-600">
            Enter your legal and contact details to continue.
          </p>
        </div>

        {/* card */}
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="h-1 rounded-t-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500" />

          <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-6">
            {/* country + reg */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-800">
                  Operating Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as Country)}
                  className="h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="USA">🇺🇸 United States</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-800">
                  {country === 'USA' ? 'USDOT Number' : 'CVOR Certificate'}{' '}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  value={regId}
                  onChange={(e) => setRegId(e.target.value)}
                  placeholder={country === 'USA' ? 'DOT: 1234567' : 'CVOR: 1234567'}
                  required
                  className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* company */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-800">
                Legal Company Name <span className="text-red-600">*</span>
              </label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., ABC Freight Solutions Inc."
                required
                className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* address */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-800">
                Business Address <span className="text-red-600">*</span>
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Unit 2"
                required
                className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* city/prov + ref */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-800">
                  City & Province/State
                </label>
                <input
                  value={cityProv}
                  onChange={(e) => setCityProv(e.target.value)}
                  placeholder="e.g., Brampton, ON"
                  className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-800">
                  Reference Code (optional)
                </label>
                <input
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="e.g., PARTNER-2025"
                  className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* phone + email */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-800">
                  Dispatch Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="+1 (416) 427-4542"
                  className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-800">
                  Business Email <span className="text-red-600">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="dispatch@company.ai"
                  required
                  className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* checkboxes */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={agreeTos}
                  onChange={(e) => setAgreeTos(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300"
                />
                <span className="text-neutral-700">
                  I agree to the{' '}
                  <a className="underline" href="/terms" target="_blank" rel="noreferrer">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a className="underline" href="/privacy" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={optIn}
                  onChange={(e) => setOptIn(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300"
                />
                <span className="text-neutral-700">
                  I’d like to receive product updates and onboarding emails. (Optional)
                </span>
              </label>
            </div>

            {/* alerts */}
            <AnimatePresence>
              {err && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {err}
                </motion.div>
              )}
              {ok && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  Company created successfully!
                </motion.div>
              )}
            </AnimatePresence>

            {/* actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 px-6 py-3 font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
              >
                {loading ? 'Submitting…' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

