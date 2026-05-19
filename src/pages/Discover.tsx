import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { MOCK_USERS, MOCK_EVENTS, MockUser } from '../data/mockUsers'
import { distanceMiles } from '../data/zipcodes'
import UserCard from '../components/UserCard'

const VIBE_FILTERS: Array<MockUser['vibe'] | 'All'> = [
  'All', 'Coffee chats', 'Workout buddy', 'Foodie', 'Hike & explore',
  'Nightlife', 'Networking', 'Study group', 'Gaming',
]

export default function Discover() {
  const { user } = useAuth()
  const [vibe, setVibe] = useState<(typeof VIBE_FILTERS)[number]>('All')
  const [radius, setRadius] = useState(25)
  const [query, setQuery] = useState('')

  const me = user! // protected route guarantees this
  const meLoc = { lat: me.zipRecord.lat, lng: me.zipRecord.lng }

  const ranked = useMemo(() => {
    return MOCK_USERS
      .map((u) => ({ u, d: distanceMiles(meLoc, { lat: u.lat, lng: u.lng }) }))
      .sort((a, b) => a.d - b.d)
  }, [meLoc.lat, meLoc.lng])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ranked.filter(({ u, d }) => {
      if (d > radius) return false
      if (vibe !== 'All' && u.vibe !== vibe) return false
      if (!q) return true
      return (
        u.name.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q) ||
        u.interests.some((t) => t.includes(q))
      )
    })
  }, [ranked, vibe, radius, query])

  const onlineCount = filtered.filter(({ u }) => u.online).length

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="chip mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-glow" />
            {onlineCount} online near {me.zipRecord.city}
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            Hey {me.displayName.split(' ')[0]}, here&apos;s your block.
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Showing neighbors within {radius} mi of <span className="text-white/80">{me.zipRecord.city}, {me.zipRecord.state} {me.zipRecord.zip}</span>.
          </p>
        </div>
        <input
          className="field max-w-sm"
          placeholder="Search by name, interest, vibe…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {VIBE_FILTERS.map((v) => (
            <button
              key={v}
              onClick={() => setVibe(v)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                vibe === v
                  ? 'border-transparent bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-[0_10px_24px_-12px_rgba(255,77,196,0.6)]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <label className="text-white/55">Radius</label>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="accent-brand-500"
          />
          <span className="w-12 text-right tabular-nums">{radius} mi</span>
        </div>
      </div>

      {/* Events strip */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Events this week</h2>
          <span className="text-xs text-white/40">{MOCK_EVENTS.length} happening</span>
        </div>
        <div className="-mx-5 overflow-x-auto px-5 pb-2">
          <div className="flex gap-3" style={{ width: 'max-content' }}>
            {MOCK_EVENTS.map((e) => (
              <div key={e.id} className="w-64 shrink-0 rounded-2xl border border-white/5 bg-ink-800/60 p-4 transition hover:border-brand-500/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-white/60">{e.category}</span>
                  <span className="text-white/40">{e.attendees} going</span>
                </div>
                <div className="mt-3 font-semibold leading-tight">{e.title}</div>
                <div className="mt-1 text-xs text-white/50">{e.city} · {e.whenLabel}</div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-white/45">hosted by {e.host}</span>
                  <button className="rounded-full border border-white/10 px-2.5 py-1 hover:bg-white/10">RSVP</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User grid */}
      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Neighbors nearby</h2>
          <span className="text-xs text-white/40">{filtered.length} matches · sorted by distance</span>
        </div>

        {filtered.length === 0 ? (
          <div className="card text-center text-white/55">
            No matches in this radius — try widening it or clearing filters.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(({ u, d }) => (
              <UserCard key={u.id} user={u} distanceMi={d} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
