'use client'

import { useState } from 'react'

export default function Home() {
  const [niche, setNiche] = useState('')
  const [hooks, setHooks] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const generateHooks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche })
      })
      const data = await res.json()
      if (data.hooks) setHooks(data.hooks)
      else alert(data.error || 'Error generating hooks')
    } catch (error) {
      console.error(error)
      alert('Error generating hooks')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-2 text-center">Viral Hook Generator™</h1>
      <p className="text-lg mb-4 text-center text-gray-300">by Vasg-VG</p>
      <p className="text-xl mb-8 text-center max-w-2xl">Generate viral-style hooks for your TikTok, Instagram Reels, YouTube Shorts, and faceless content. Enter your niche and get 10 engaging hooks instantly.</p>
      <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md">
        <input
          type="text"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="Enter your niche or topic (e.g., fitness)"
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
        />
        <button
          onClick={generateHooks}
          disabled={loading || !niche.trim()}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          {loading ? 'Generating...' : 'Generate Hooks'}
        </button>
      </div>
      <div className="w-full max-w-4xl grid gap-4 md:grid-cols-2">
        {hooks.map((hook, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl hover:shadow-cyan-500/20 transition-shadow">
            <p className="text-white text-lg leading-relaxed">{hook}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
