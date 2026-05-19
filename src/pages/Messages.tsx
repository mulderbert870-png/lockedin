import { useEffect, useMemo, useRef, useState, FormEvent } from 'react'
import { useChat, ChatMessage } from '../context/ChatContext'
import { useToast } from '../context/ToastContext'

function relativeTime(min: number) {
  if (min < 1) return 'now'
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function minutesSince(sentAt: number) {
  return Math.max(0, Math.floor((Date.now() - sentAt) / 60_000))
}

export default function Messages() {
  const { threads, activeUserId, openThread, sendMessage, unreadCount } = useChat()
  const { showToast } = useToast()
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const bubblesRef = useRef<HTMLDivElement | null>(null)

  // Default to the first conversation when nothing is selected.
  useEffect(() => {
    if (!activeUserId && threads.length > 0) openThread(threads[0].user.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return threads
    return threads.filter((t) => {
      if (t.user.name.toLowerCase().includes(q)) return true
      return t.messages.some((m) => m.text.toLowerCase().includes(q))
    })
  }, [threads, query])

  const selected = threads.find((t) => t.user.id === activeUserId) ?? null

  // Autoscroll bubble pane to bottom when thread changes or new message arrives
  useEffect(() => {
    const el = bubblesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [selected?.user.id, selected?.messages.length])

  function onSend(e: FormEvent) {
    e.preventDefault()
    if (!selected) return
    const text = draft.trim()
    if (!text) return
    sendMessage(selected.user.id, text)
    setDraft('')
    showToast(`Sent to ${selected.user.name.split(' ')[0]}`, 'success')
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Messages</h1>
          <p className="text-sm text-white/55">
            {threads.length} conversations · {unreadCount} unread
          </p>
        </div>
        <input
          className="field max-w-xs"
          placeholder="Search conversations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-white/5 bg-ink-800/60">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-white/45">No conversations match “{query}”.</div>
          ) : (
            <ul className="max-h-[70vh] overflow-y-auto">
              {filtered.map((t) => {
                const last = t.messages[t.messages.length - 1]
                const preview = last?.text ?? 'No messages yet'
                const isMine = last?.from === 'me'
                const min = last ? minutesSince(last.sentAt) : t.lastActivityMin
                return (
                  <li
                    key={t.user.id}
                    onClick={() => openThread(t.user.id)}
                    className={`flex cursor-pointer items-center gap-3 border-b border-white/5 px-4 py-3 transition hover:bg-white/5 ${
                      activeUserId === t.user.id ? 'bg-white/5' : ''
                    }`}
                  >
                    <div className="relative">
                      <img src={t.user.avatar} className="h-11 w-11 rounded-xl object-cover" />
                      {t.user.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-800 bg-emerald-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="truncate text-sm font-semibold">{t.user.name}</div>
                        <div className="ml-2 text-[11px] text-white/40">{relativeTime(min)}</div>
                      </div>
                      <div className="truncate text-xs text-white/55">
                        {isMine && <span className="text-white/40">You: </span>}
                        {preview}
                      </div>
                    </div>
                    {t.unread && <span className="ml-1 h-2 w-2 rounded-full bg-brand-400" />}
                  </li>
                )
              })}
            </ul>
          )}
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
                      {selected.user.city}, {selected.user.state} ·{' '}
                      {selected.user.online ? 'Online now' : `Last seen ${relativeTime(selected.lastActivityMin)} ago`}
                    </div>
                  </div>
                </div>
                <span className="chip">{selected.user.vibe}</span>
              </header>

              <div ref={bubblesRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                {selected.messages.length === 0 ? (
                  <div className="m-auto max-w-xs rounded-2xl border border-white/5 bg-white/5 p-5 text-center text-sm text-white/55">
                    Say hi to {selected.user.name.split(' ')[0]} 👋
                  </div>
                ) : (
                  selected.messages.map((m) => (
                    <Bubble key={m.id} msg={m} avatar={selected.user.avatar} />
                  ))
                )}
              </div>

              <form onSubmit={onSend} className="flex items-center gap-2 border-t border-white/5 p-3">
                <input
                  className="field flex-1"
                  placeholder={`Message ${selected.user.name.split(' ')[0]}…`}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button type="submit" className="btn-primary text-sm px-4 py-2" disabled={!draft.trim()}>
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Bubble({ msg, avatar }: { msg: ChatMessage; avatar: string }) {
  if (msg.from === 'me') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] rounded-2xl rounded-tr-md bg-gradient-to-br from-brand-500 to-accent-500 px-4 py-2 text-sm text-white shadow-[0_8px_24px_-12px_rgba(255,77,196,0.5)]">
          {msg.text}
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-end gap-2">
      <img src={avatar} className="h-7 w-7 rounded-full object-cover" />
      <div className="max-w-[70%] rounded-2xl rounded-tl-md border border-white/5 bg-ink-900/80 px-4 py-2 text-sm text-white/85">
        {msg.text}
      </div>
    </div>
  )
}
