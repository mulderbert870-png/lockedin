import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/discover'

  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [zip, setZip] = useState('94110')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = login(email, password, zip)
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="aurora relative min-h-screen overflow-hidden">
      <div className="grid-overlay absolute inset-0" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-5 py-12">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Marketing column */}
          <div className="hidden flex-col justify-center lg:flex">
            <Link to="/" className="inline-flex w-fit items-center gap-2 text-white/60 hover:text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M15 19l-7-7 7-7v14z"/></svg>
              Back home
            </Link>
            <h1 className="mt-8 font-display text-5xl font-semibold leading-tight">
              Your block, <br />
              <span className="text-gradient">unlocked.</span>
            </h1>
            <p className="mt-4 max-w-md text-white/60">
              LockedIn matches you with people in your ZIP — for coffee runs, gym
              partners, late-night ramen, or that side project you keep procrastinating.
            </p>
            <div className="mt-10 grid gap-4">
              {[
                { k: '60+', v: 'curated profiles seeded near you' },
                { k: '40+', v: 'ZIPs across 16 metro areas' },
                { k: '22', v: 'live events you can join this week' },
              ].map((s) => (
                <div key={s.k} className="glass rounded-2xl px-5 py-4">
                  <div className="font-display text-2xl text-gradient">{s.k}</div>
                  <div className="text-sm text-white/60">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form column */}
          <div className="glass rounded-3xl p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                  <path d="M12 2C7.6 2 4 5.4 4 9.6c0 5 8 12.4 8 12.4s8-7.4 8-12.4C20 5.4 16.4 2 12 2zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                </svg>
              </span>
              <div>
                <div className="font-display text-xl font-semibold">LockedIn</div>
                <div className="text-xs text-white/50">MVP — any email & password works</div>
              </div>
            </div>

            <div className="mt-8 inline-flex rounded-full bg-white/5 p-1 text-sm">
              <button
                onClick={() => setMode('signin')}
                className={`rounded-full px-4 py-1.5 transition ${mode === 'signin' ? 'bg-white text-ink-950' : 'text-white/70'}`}
              >
                Sign in
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`rounded-full px-4 py-1.5 transition ${mode === 'signup' ? 'bg-white text-ink-950' : 'text-white/70'}`}
              >
                Create account
              </button>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
              <label className="grid gap-1.5 text-sm">
                <span className="text-white/60">Email</span>
                <input
                  className="field"
                  type="email"
                  placeholder="you@local.area"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-white/60">Password</span>
                <input
                  className="field"
                  type="password"
                  placeholder="Anything, really (min 4 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-white/60">ZIP code</span>
                <input
                  className="field"
                  inputMode="numeric"
                  placeholder="e.g. 94110"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
                <span className="text-xs text-white/40">
                  Used to match you with people nearby. Try 94110, 10011, 78704, 98101…
                </span>
              </label>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary mt-2" disabled={loading}>
                {loading ? 'Loading…' : mode === 'signin' ? 'Sign in' : 'Create my account'}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M14 5l7 7-7 7v-4H3v-6h11V5z"/></svg>
              </button>

              <div className="text-center text-xs text-white/40">
                By continuing you agree to behave like a decent human in your neighborhood.
              </div>
            </form>

            <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs text-white/40">
              <div className="rounded-xl border border-white/5 bg-white/5 py-2">Apple</div>
              <div className="rounded-xl border border-white/5 bg-white/5 py-2">Google</div>
              <div className="rounded-xl border border-white/5 bg-white/5 py-2">Phone</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
