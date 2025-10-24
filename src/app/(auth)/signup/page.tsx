'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name },
        },
      })
      if (error) throw error
      alert('✅ Account created successfully!')
      window.location.href = '/onboarding/create-company'
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'azure') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'http://localhost:3000/onboarding/create-company',
      },
    })
  }

  const fadeUp = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex items-center justify-center px-4">
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-sm p-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-black text-center">
          AutoDispatchAI
        </h1>
        <p className="text-sm text-neutral-500 text-center mt-2">
          Create your account
        </p>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="h-11 flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 transition"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('azure')}
            className="h-11 flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 transition"
          >
            <img src="/microsoft-icon.svg" alt="Microsoft" className="w-5 h-5" />
            Continue with Outlook
          </button>
        </div>

        {/* Divider */}
        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-neutral-500">or continue with email</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={onSubmit} className="mt-6 grid gap-5">
          <div className="grid gap-2">
            <label className="text-sm text-neutral-700">Full Name</label>
            <input
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={onChange}
              required
              className="h-11 rounded-xl border border-neutral-300 px-3 text-[15px] focus:ring-2 focus:ring-black/10 focus:outline-none"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-neutral-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              required
              className="h-11 rounded-xl border border-neutral-300 px-3 text-[15px] focus:ring-2 focus:ring-black/10 focus:outline-none"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-neutral-700">Password</label>
            <input
              name="password"
              type="password"
              placeholder="****"
              value={form.password}
              onChange={onChange}
              required
              className="h-11 rounded-xl border border-neutral-300 px-3 text-[15px] focus:ring-2 focus:ring-black/10 focus:outline-none"
            />
          </div>

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 text-sm text-red-700 px-3 py-2">
              {err}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            type="submit"
            className="h-11 rounded-xl bg-black text-white font-medium tracking-tight disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="text-sm text-neutral-500 text-center mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-black underline">
            Log in
          </a>
        </p>
      </motion.div>
    </div>
  )
}
