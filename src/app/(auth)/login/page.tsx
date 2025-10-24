'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [remember, setRemember] = useState(true) // ✅ Default true
  const [form, setForm] = useState({ email: '', password: '' })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) throw error

      // ✅ Remember Me logic (store in localStorage or sessionStorage)
      if (remember) {
        localStorage.setItem('supabase_session', JSON.stringify(data.session))
      } else {
        sessionStorage.setItem('supabase_session', JSON.stringify(data.session))
      }

      alert('✅ Logged in successfully!')
      window.location.href = '/onboarding/create-company'
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
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
          Sign in to your account
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-5">
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
              placeholder="********"
              value={form.password}
              onChange={onChange}
              required
              className="h-11 rounded-xl border border-neutral-300 px-3 text-[15px] focus:ring-2 focus:ring-black/10 focus:outline-none"
            />
          </div>

          {/* ✅ Remember Me Checkbox */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-neutral-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300"
              />
              Remember me
            </label>
            <a href="#" className="text-neutral-500 hover:text-black underline">
              Forgot password?
            </a>
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
            {loading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </form>

        <p className="text-sm text-neutral-500 text-center mt-6">
          Don’t have an account?{' '}
          <a href="/(auth)/signup" className="text-black underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  )
}

