import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_USERS, MOCK_EVENTS } from '../data/mockUsers'

export default function Landing() {
  const { user } = useAuth()
  const ctaTarget = user ? '/discover' : '/login'

  return (
    <div className="aurora relative overflow-hidden">
      <div className="grid-overlay pointer-events-none absolute inset-0" />

      {/* Floating blobs */}
      <div className="pointer-events-none absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-brand-500/30 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute top-40 -right-20 h-[460px] w-[460px] rounded-full bg-accent-500/30 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl" />

      {/* Top nav */}
      <header className="relative z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-[0_8px_24px_-8px_rgba(109,92,255,0.6)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                <path d="M12 2C7.6 2 4 5.4 4 9.6c0 5 8 12.4 8 12.4s8-7.4 8-12.4C20 5.4 16.4 2 12 2zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">LockedIn</span>
          </Link>
          <nav className="hidden items-center gap-2 text-sm text-white/70 md:flex">
            <a href="#how" className="rounded-full px-4 py-2 hover:bg-white/5">How it works</a>
            <a href="#why" className="rounded-full px-4 py-2 hover:bg-white/5">Why LockedIn</a>
            <a href="#community" className="rounded-full px-4 py-2 hover:bg-white/5">Community</a>
            <a href="#faq" className="rounded-full px-4 py-2 hover:bg-white/5">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden text-sm text-white/70 hover:text-white sm:inline">Sign in</Link>
            <Link to={ctaTarget} className="btn-primary text-sm px-4 py-2">
              {user ? 'Open app' : 'Get started'}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-up">
            <div className="chip mb-5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-glow" />
              Now seeding 16 metros · open beta
            </div>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Meet the people <br />
              <span className="text-gradient">on your block.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/65">
              LockedIn is the social map for your neighborhood. Drop your ZIP, see
              who&apos;s nearby, and lock in coffee runs, gym buddies, or that
              random Tuesday hang you keep meaning to plan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={ctaTarget} className="btn-primary">
                {user ? 'Open the app' : 'Claim your ZIP'}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M14 5l7 7-7 7v-4H3v-6h11V5z"/></svg>
              </Link>
              <a href="#how" className="btn-ghost">See how it works</a>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {MOCK_USERS.slice(0, 5).map((u) => (
                  <img
                    key={u.id}
                    src={u.avatar}
                    alt={u.name}
                    className="h-9 w-9 rounded-full border-2 border-ink-950 object-cover"
                  />
                ))}
              </div>
              <div className="text-sm text-white/55">
                <span className="text-white">2,400+ neighbors</span> already locked in this week
              </div>
            </div>
          </div>

          <HeroMockup />
        </div>

        {/* Stat bar */}
        <div className="mt-20 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { k: '16', v: 'metro areas live' },
            { k: '2.4k', v: 'active neighbors' },
            { k: '22', v: 'meetups this week' },
            { k: '4.8★', v: 'community rating' },
          ].map((s) => (
            <div key={s.k} className="glass rounded-2xl px-5 py-4 text-center">
              <div className="font-display text-3xl text-gradient">{s.k}</div>
              <div className="text-xs uppercase tracking-wider text-white/45">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <div className="chip mb-3">How it works</div>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">Three steps to your local crew.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { n: '01', t: 'Drop your ZIP', d: 'We translate your ZIP into a precise neighborhood radius — no exact address required.' },
            { n: '02', t: 'Browse nearby vibes', d: 'See real people, their interests, and what they’re looking for this weekend.' },
            { n: '03', t: 'Lock in plans', d: 'Tap a profile to start a chat, or RSVP to an event already on the map.' },
          ].map((s) => (
            <div key={s.n} className="card">
              <div className="font-display text-3xl text-gradient">{s.n}</div>
              <div className="mt-2 text-lg font-semibold">{s.t}</div>
              <p className="mt-2 text-sm text-white/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section id="why" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="card lg:col-span-2 overflow-hidden">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="chip mb-3">Live map</div>
                <h3 className="font-display text-2xl font-semibold">See your block, in real time.</h3>
                <p className="mt-2 text-sm text-white/60">
                  Pin profiles, sort by interests, and spot meetups happening
                  within a 5-block radius. Powered by Mapbox.
                </p>
                <Link to={ctaTarget} className="btn-ghost mt-5 text-sm">Try the map →</Link>
              </div>
              <div className="relative h-56 overflow-hidden rounded-xl border border-white/10 bg-ink-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(109,92,255,0.4),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(255,77,196,0.35),transparent_55%)]" />
                <div className="absolute inset-3 rounded-lg border border-white/10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                {[
                  { top: '24%', left: '32%' }, { top: '55%', left: '60%' },
                  { top: '40%', left: '78%' }, { top: '70%', left: '24%' },
                  { top: '18%', left: '70%' }, { top: '60%', left: '40%' },
                ].map((p, i) => (
                  <span key={i} className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 ring-2 ring-white animate-pulse-glow" style={p} />
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="chip mb-3">Local DMs</div>
            <h3 className="font-display text-2xl font-semibold">Chat that won’t ghost.</h3>
            <p className="mt-2 text-sm text-white/60">
              Real-time DMs with the people closest to you. No bots, no
              long-distance flakes.
            </p>
            <div className="mt-5 space-y-2">
              {['Hey, free for coffee tomorrow?', 'Sat trail run, you in?', 'Found a sourdough class 🍞'].map((m) => (
                <div key={m} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
                  <span className="h-7 w-7 rounded-full bg-gradient-to-br from-accent-500 to-brand-500" />
                  <span className="text-white/80">{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="chip mb-3">Events nearby</div>
            <h3 className="font-display text-2xl font-semibold">Plans, already plotted.</h3>
            <p className="mt-2 text-sm text-white/60">
              Browse community events seeded by your neighbors. RSVP in a tap.
            </p>
            <div className="mt-5 space-y-2">
              {MOCK_EVENTS.slice(0, 3).map((e) => (
                <div key={e.id} className="rounded-xl bg-white/5 px-3 py-2 text-sm">
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs text-white/50">{e.city} · {e.whenLabel}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card lg:col-span-2">
            <div className="chip mb-3">Interest matching</div>
            <h3 className="font-display text-2xl font-semibold">Find your people, not strangers.</h3>
            <p className="mt-2 text-sm text-white/60">
              Tag what you’re into. We surface neighbors with overlapping interests so
              your feed feels like a friend introducing you, not a stranger.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['specialty coffee', 'climbing', 'AI', 'pickleball', 'k-dramas', 'sourdough', 'thrifting', 'startup life', 'jazz vinyl', 'pottery', 'salsa dancing', 'pilates'].map((tag) => (
                <span key={tag} className="chip">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community / testimonials */}
      <section id="community" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 text-center">
          <div className="chip mb-3">Loved by neighbors</div>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">Real people, on real corners.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { q: 'I’ve lived here three years and finally know my neighbors. Met three of my closest friends through LockedIn.', n: 'Priya', c: 'Brooklyn, NY' },
            { q: 'Joined for a run buddy, ended up co-founding a side project. The local part really matters.', n: 'Marcus', c: 'San Francisco, CA' },
            { q: 'It’s the only social app that doesn’t feel performative. Just people doing things together.', n: 'Hana', c: 'Austin, TX' },
          ].map((t) => (
            <div key={t.n} className="card">
              <svg viewBox="0 0 24 24" className="mb-3 h-6 w-6 text-brand-400" fill="currentColor"><path d="M7 7h4v4H8c0 2 1 3 3 4v2c-3-1-5-3-5-7V7zm8 0h4v4h-3c0 2 1 3 3 4v2c-3-1-5-3-5-7V7z"/></svg>
              <p className="text-white/80">{t.q}</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500" />
                <div>
                  <div className="text-sm font-medium">{t.n}</div>
                  <div className="text-xs text-white/45">{t.c}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <div className="mb-10 text-center">
          <div className="chip mb-3">FAQ</div>
          <h2 className="font-display text-4xl font-semibold">Quick answers.</h2>
        </div>
        <div className="grid gap-3">
          {[
            { q: 'Is this dating?', a: 'Nope — LockedIn is platonic-first. Friends, gym partners, study groups, side projects. Be clear about what you’re looking for.' },
            { q: 'How do you use my ZIP?', a: 'Only to map you to a neighborhood radius. We never show your exact address and ZIP is editable anytime.' },
            { q: 'Is it free?', a: 'The MVP is free during open beta. Local meetups will always be free.' },
            { q: 'Where do you cover?', a: 'We’re live across 16 metros — NYC, SF, LA, Chicago, Austin, Seattle, Boston, and more. Type your ZIP and we’ll route you to the nearest hub.' },
          ].map((f) => (
            <details key={f.q} className="group rounded-2xl border border-white/5 bg-ink-800/50 p-5">
              <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-white">
                {f.q}
                <span className="text-white/40 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-white/60">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <div className="glass relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-14">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-[280px] w-[600px] -translate-x-1/2 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/4 h-[280px] w-[500px] rounded-full bg-accent-500/30 blur-3xl" />
          <h2 className="relative font-display text-4xl font-semibold sm:text-5xl">
            Your neighbors are <span className="text-gradient">waiting.</span>
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/60">
            Type your ZIP, pick a vibe, and lock in your first hang this week.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to={ctaTarget} className="btn-primary">
              {user ? 'Open the app' : 'Get started — it’s free'}
            </Link>
            <a href="#how" className="btn-ghost">See how it works</a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs text-white/40">
          <div>© {new Date().getFullYear()} LockedIn · MVP</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Community guidelines</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroMockup() {
  const featured = MOCK_USERS.slice(0, 6)
  return (
    <div className="relative animate-fade-up">
      {/* Phone-ish glass card */}
      <div className="glass relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[36px] border-white/10 p-5 shadow-[0_30px_80px_-30px_rgba(109,92,255,0.6)]">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Live · 94110
          </span>
        </div>
        <div className="mt-5">
          <div className="text-white/50 text-sm">Good afternoon,</div>
          <div className="font-display text-3xl font-semibold">Near you today</div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {featured.map((u) => (
            <div key={u.id} className="rounded-2xl border border-white/5 bg-ink-900/70 p-3">
              <div className="flex items-center gap-2">
                <img src={u.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{u.name}</div>
                  <div className="truncate text-xs text-white/50">{u.city} · {u.vibe}</div>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {u.interests.slice(0, 2).map((t) => (
                  <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/60">#{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/20 to-accent-500/20 p-4">
          <div className="text-xs uppercase tracking-widest text-white/50">Event tonight</div>
          <div className="mt-1 font-display text-lg">Sunset Rooftop Mixer</div>
          <div className="text-xs text-white/55">Mission District · 28 going</div>
        </div>
      </div>

      {/* Floating cards */}
      <div className="glass absolute -left-6 top-6 hidden w-56 rotate-[-6deg] rounded-2xl p-4 shadow-xl sm:block animate-float-slow">
        <div className="text-xs uppercase tracking-wider text-white/45">New nearby</div>
        <div className="mt-1 font-semibold">3 climbers in 94110</div>
        <div className="mt-3 flex -space-x-2">
          {MOCK_USERS.slice(7, 11).map((u) => (
            <img key={u.id} src={u.avatar} className="h-7 w-7 rounded-full border-2 border-ink-900 object-cover" />
          ))}
        </div>
      </div>
      <div className="glass absolute -right-4 bottom-6 hidden w-60 rotate-[5deg] rounded-2xl p-4 shadow-xl sm:block animate-float-slow">
        <div className="text-xs uppercase tracking-wider text-white/45">Lock-in suggestion</div>
        <div className="mt-1 font-semibold">Tuesday coffee with Maya?</div>
        <div className="mt-2 text-xs text-white/55">Blue Bottle · 0.4 mi away</div>
      </div>
    </div>
  )
}
