import { useMemo, useState } from 'react'
import { MOCK_USERS, MOCK_MESSAGES } from '../data/mockUsers'

function relativeTime(min: number) {
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

export default function Messages() {
  const userById = useMemo(() => new Map(MOCK_USERS.map((u) => [u.id, u])), [])
  const conversations = MOCK_MESSAGES.map((m) => ({ ...m, user: userById.get(m.userId)! }))
  const [selectedId, setSelectedId] = useState(conversations[0]?.id ?? null)
  const selected = conversations.find((c) => c.id === selectedId) ?? null
  const [draft, setDraft] = useState('')

  const unreadCount = conversations.filter((c) => c.unread).length

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Messages</h1>
          <p className="text-sm text-white/55">
            {conversations.length} conversations · {unreadCount} unread
          </p>
        </div>
        <input className="field max-w-xs" placeholder="Search conversations" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-white/5 bg-ink-800/60">
          <ul className="max-h-[70vh] overflow-y-auto">
            {conversations.map((c) => (
              <li
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`flex cursor-pointer items-center gap-3 border-b border-white/5 px-4 py-3 transition hover:bg-white/5 ${
                  selectedId === c.id ? 'bg-white/5' : ''
                }`}
              >
                <div className="relative">
                  <img src={c.user.avatar} className="h-11 w-11 rounded-xl object-cover" />
                  {c.user.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-800 bg-emerald-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="truncate text-sm font-semibold">{c.user.name}</div>
                    <div className="ml-2 text-[11px] text-white/40">{relativeTime(c.minutesAgo)}</div>
                  </div>
                  <div className="truncate text-xs text-white/55">{c.preview}</div>
                </div>
                {c.unread && <span className="ml-1 h-2 w-2 rounded-full bg-brand-400" />}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex h-[70vh] flex-col rounded-2xl border border-white/5 bg-ink-800/40">
          {!selected ? (
            <div className="m-auto text-white/45">Select a conversation</div>
          ) : (
            <>
              <header className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                <div className="flex items-center gap-3">
                  <img src={selected.user.avatar} className="h-10 w-10 rounded-xl object-cover" />
                  <div>
                    <div className="font-semibold">{selected.user.name}</div>
                    <div className="text-xs text-white/45">
                      {selected.user.city}, {selected.user.state} · {selected.user.online ? 'Online now' : `Last seen ${relativeTime(selected.minutesAgo)} ago`}
                    </div>
                  </div>
                </div>
                <span className="chip">{selected.user.vibe}</span>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                <Bubble who="them" avatar={selected.user.avatar}>
                  {selected.preview}
                </Bubble>
                <Bubble who="me">
                  Yes! What time works for you?
                </Bubble>
                <Bubble who="them" avatar={selected.user.avatar}>
                  Any time after 6 works — wanna pick a spot near {selected.user.city}?
                </Bubble>
                <Bubble who="me">
                  There’s a new place by my apartment, sending you the location 📍
                </Bubble>
                <Bubble who="them" avatar={selected.user.avatar}>
                  Locked in 🔒
                </Bubble>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setDraft('')
                }}
                className="flex items-center gap-2 border-t border-white/5 p-3"
              >
                <input
                  className="field flex-1"
                  placeholder={`Message ${selected.user.name.split(' ')[0]}…`}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button type="submit" className="btn-primary text-sm px-4 py-2">Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Bubble({
  who,
  avatar,
  children,
}: {
  who: 'me' | 'them'
  avatar?: string
  children: React.ReactNode
}) {
  if (who === 'me') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] rounded-2xl rounded-tr-md bg-gradient-to-br from-brand-500 to-accent-500 px-4 py-2 text-sm text-white shadow-[0_8px_24px_-12px_rgba(255,77,196,0.5)]">
          {children}
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-end gap-2">
      <img src={avatar} className="h-7 w-7 rounded-full object-cover" />
      <div className="max-w-[70%] rounded-2xl rounded-tl-md border border-white/5 bg-ink-900/80 px-4 py-2 text-sm text-white/85">
        {children}
      </div>
    </div>
  )
}
