import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import { useToast } from '../context/ToastContext'
import { MOCK_USERS, MockUser } from '../data/mockUsers'
import { distanceMiles } from '../data/zipcodes'

const SUGGESTED_INTERESTS = [
  'specialty coffee', 'climbing', 'AI', 'k-dramas', 'sourdough', 'thrifting',
  'pickleball', 'pilates', 'startup life', 'jazz vinyl', 'natural wine',
  'volunteering', 'matcha', 'running', 'photography', 'design', 'cycling',
  'chess', 'reading clubs', 'board games',
]

const VIBE_OPTIONS = ['Coffee chats', 'Workout buddy', 'Foodie', 'Hike & explore', 'Nightlife', 'Networking'] as const

export default function Profile() {
  const { user, updateZip, logout } = useAuth()
  const { openThread } = useChat()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const me = user!

  const [interests, setInterests] = useState<string[]>(['specialty coffee', 'AI', 'climbing'])
  const [bio, setBio] = useState('New in town. Looking for a Saturday hike crew and a regular coffee spot.')
  const [vibe, setVibe] = useState<(typeof VIBE_OPTIONS)[number]>('Coffee chats')
  const [zipDraft, setZipDraft] = useState(me.zipRecord.zip)
  const [zipError, setZipError] = useState<string | null>(null)
  const [profileDirty, setProfileDirty] = useState(false)

  const meLoc = { lat: me.zipRecord.lat, lng: me.zipRecord.lng }
  const neighbors = MOCK_USERS
    .map((u) => ({ u, d: distanceMiles(meLoc, { lat: u.lat, lng: u.lng }) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 20)

  function toggleInterest(t: string) {
    setInterests((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
    setProfileDirty(true)
  }

  function onSaveZip() {
    const res = updateZip(zipDraft)
    if (!res.ok) {
      setZipError(res.error)
      return
    }
    setZipError(null)
    showToast('Location updated', 'success')
  }

  function onSaveProfile() {
    setProfileDirty(false)
    showToast('Profile saved', 'success')
  }

  function onSignOut() {
    logout()
    showToast('Signed out')
    navigate('/')
  }

  function startConversation(u: MockUser) {
    openThread(u.id)
    showToast(`Opened chat with ${u.name.split(' ')[0]}`, 'success')
    navigate('/messages')
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      {/* Hero strip */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-ink-800/60">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/25 via-accent-500/15 to-sky-400/20" />
        <div className="relative flex flex-wrap items-end gap-5 p-6 sm:p-8">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 font-display text-3xl font-semibold shadow-[0_20px_40px_-15px_rgba(255,77,196,0.5)]">
              {me.displayName[0]?.toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink-800 bg-emerald-400 text-[10px] font-bold text-ink-950">
              ON
            </span>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-semibold">{me.displayName}</h1>
            <div className="text-sm text-white/60">{me.email}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/70">
              <span className="chip">📍 {me.zipRecord.city}, {me.zipRecord.state} {me.zipRecord.zip}</span>
              <span className="chip">{vibe}</span>
              <span className="chip">Member since {new Date(me.joinedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button onClick={onSignOut} className="btn-ghost text-sm">Sign out</button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Bio + vibe */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">About you</h2>
              <p className="mt-1 text-xs text-white/45">Visible to neighbors within your radius.</p>
            </div>
            <button
              onClick={onSaveProfile}
              disabled={!profileDirty}
              className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-1.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save changes
            </button>
          </div>
          <textarea
            className="field mt-4 min-h-[120px] resize-y"
            value={bio}
            onChange={(e) => {
              setBio(e.target.value)
              setProfileDirty(true)
            }}
          />
          <div className="mt-4">
            <div className="text-xs uppercase tracking-widest text-white/45">Primary vibe</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {VIBE_OPTIONS.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setVibe(v)
                    setProfileDirty(true)
                  }}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    vibe === v
                      ? 'border-transparent bg-gradient-to-r from-brand-500 to-accent-500 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <h2 className="font-display text-lg font-semibold">Location</h2>
          <p className="mt-1 text-xs text-white/45">Your ZIP controls who you see. Change it anytime.</p>
          <label className="mt-4 grid gap-1.5 text-sm">
            <span className="text-white/60">ZIP code</span>
            <input
              className="field"
              inputMode="numeric"
              value={zipDraft}
              onChange={(e) => setZipDraft(e.target.value)}
            />
          </label>
          {zipError && <div className="mt-2 text-xs text-red-300">{zipError}</div>}
          <button onClick={onSaveZip} className="btn-primary mt-3 w-full text-sm">Update location</button>
          <div className="mt-4 text-xs text-white/55">
            Resolved to <span className="text-white/80">{me.zipRecord.city}, {me.zipRecord.state}</span> at
            <span className="text-white/80"> {me.zipRecord.lat.toFixed(3)}, {me.zipRecord.lng.toFixed(3)}</span>.
          </div>
        </div>

        {/* Interests */}
        <div className="card lg:col-span-3">
          <h2 className="font-display text-lg font-semibold">Interests</h2>
          <p className="mt-1 text-xs text-white/45">Pick a few. We use these to surface neighbors with overlap.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTED_INTERESTS.map((t) => {
              const active = interests.includes(t)
              return (
                <button
                  key={t}
                  onClick={() => toggleInterest(t)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    active
                      ? 'border-transparent bg-gradient-to-r from-brand-500 to-accent-500 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {active ? '✓ ' : '+ '}{t}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Closest neighbors preview */}
      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Closest neighbors</h2>
            <p className="text-sm text-white/55">Your 20 nearest matches in {me.zipRecord.city}. Click any to start a chat.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {neighbors.map(({ u, d }) => (
            <button
              key={u.id}
              onClick={() => startConversation(u)}
              className="card flex items-center gap-3 text-left"
            >
              <img src={u.avatar} className="h-12 w-12 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{u.name}</div>
                <div className="truncate text-xs text-white/50">{u.city} · {d.toFixed(1)} mi</div>
                <div className="mt-1 truncate text-[11px] text-brand-400">{u.vibe}</div>
              </div>
              {u.online && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
