'use client'

import { useEffect, useState } from 'react'

const FREE_DAILY_GENERATIONS = 3
const STORAGE_KEY = 'viralHookGenerator.freeUsage'

const getToday = () => new Date().toISOString().slice(0, 10)

const loadFreeUsage = () => {
  if (typeof window === 'undefined') return FREE_DAILY_GENERATIONS

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return FREE_DAILY_GENERATIONS

    const data = JSON.parse(raw)
    if (data?.date !== getToday()) return FREE_DAILY_GENERATIONS

    const used = typeof data.used === 'number' ? data.used : 0
    return Math.max(0, FREE_DAILY_GENERATIONS - used)
  } catch {
    return FREE_DAILY_GENERATIONS
  }
}

const saveFreeUsage = (used: number) => {
  if (typeof window === 'undefined') return

  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getToday(), used }))
}

export default function Home() {
  const [niche, setNiche] = useState('')
  const [hooks, setHooks] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(FREE_DAILY_GENERATIONS)

  useEffect(() => {
    setRemaining(loadFreeUsage())
  }, [])

  const generateHooks = async () => {
    setError('')
    if (remaining <= 0) {
      setError('Daily free limit reached. Upgrade to Pro for unlimited generation.')
      return
    }

    setLoading(true)
    setHooks([])

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche })
      })

      const data = await res.json()
      if (data.hooks) {
        setHooks(data.hooks)

        const raw = localStorage.getItem(STORAGE_KEY)
        const currentUsed = raw ? (JSON.parse(raw).used || 0) : 0
        const nextUsed = currentUsed + 1
        saveFreeUsage(nextUsed)
        setRemaining(Math.max(0, FREE_DAILY_GENERATIONS - nextUsed))
      } else {
        setError(data.error || 'Error generating hooks')
      }
    } catch (error) {
      console.error(error)
      setError('Error generating hooks')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setError('')
    setCheckoutLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
        return
      }

      setError(data.error || 'Unable to redirect to Stripe checkout')
    } catch (err) {
      console.error(err)
      setError('Unable to redirect to Stripe checkout')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const copyHook = async (hook: string, index: number) => {
    if (!navigator?.clipboard) return
    await navigator.clipboard.writeText(hook)
    setCopiedIndex(index)
    window.setTimeout(() => setCopiedIndex(null), 1200)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),transparent_30%),#050508] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <header className="mb-10 text-center">
          <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1 text-sm uppercase tracking-[0.24em] text-cyan-200">Viral hook studio</span>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">Viral Hook Generator</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">Create scroll-stopping hook lines for TikTok, Instagram Reels, YouTube Shorts, and faceless content creators. Enter a niche and generate 2 ready-to-use hooks instantly.</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
            <div className="space-y-3">
              <label className="text-sm uppercase tracking-[0.28em] text-cyan-200">Your niche</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. fitness, parenting, crypto, travel hacks"
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none ring-1 ring-transparent transition focus:border-cyan-400 focus:ring-cyan-400/40"
              />
              <p className="text-sm leading-6 text-slate-400">Use a specific topic to get the most relevant hooks. Example: "daily productivity tips" or "home workout routines".</p>
              <p className="text-sm font-medium text-cyan-100">
                Free plan: {remaining} free generation{remaining === 1 ? '' : 's'} remaining today. Each generation returns 2 hooks.
              </p>
            </div>

            {error ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
            ) : null}

            <button
              onClick={generateHooks}
              disabled={loading || !niche.trim() || remaining <= 0}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading ? 'Generating hooks...' : 'Generate Hooks'}
            </button>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">Why use this app?</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
              <p>Generate high-energy opening lines that stop the scroll and keep viewers watching the first 3 seconds of your content.</p>
              <ul className="space-y-3">
                <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />Optimized for short-form videos and faceless content.</li>
                <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />Delivers hooks in a format you can copy directly into your script or caption.</li>
                <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />Designed to help creators test attention-grabbing ideas fast.</li>
              </ul>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
                <h3 className="text-lg font-semibold text-white">Upgrade to Pro</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">Unlock unlimited hook generation, priority AI responses, and advanced creator hooks built for serious creators.</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-400" />Unlimited hook generation</li>
                  <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-400" />Priority AI responses</li>
                  <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-400" />Advanced creator hooks</li>
                </ul>
                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkoutLoading ? 'Redirecting to Stripe...' : 'Upgrade to Pro'}
                </button>
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">Monthly subscription via Stripe Checkout</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-500/10 backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Generated Hooks</h2>
              <p className="mt-2 text-sm text-slate-400">Copy any hook instantly or clear the results to generate a new batch.</p>
            </div>
            {hooks.length > 0 ? (
              <button
                onClick={() => setHooks([])}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
              >
                Clear results
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {hooks.length === 0 ? (
              <div className="col-span-full rounded-[1.5rem] border border-dashed border-white/15 bg-slate-950/60 p-8 text-center text-slate-400">
                Enter a niche above and generate viral hooks to see them here.
              </div>
            ) : (
              hooks.map((hook, index) => (
                <div key={index} className="group rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 transition hover:border-cyan-400/30 hover:bg-slate-900/95">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-200">Hook {index + 1}</span>
                    <button
                      onClick={() => copyHook(hook, index)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-cyan-500/15"
                    >
                      {copiedIndex === index ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-base leading-7 text-slate-100">{hook}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="mt-10 text-center text-sm text-slate-500">
          Created by Vasg-VG.<span className="rounded-md bg-slate-950/80 px-2 py-1 text-white">Creator . AI Workflows . Digital Tools</span>.
        </footer>
      </div>
    </main>
  )
}
