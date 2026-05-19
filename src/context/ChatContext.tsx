import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react'
import { MOCK_MESSAGES, MOCK_USERS, MockUser } from '../data/mockUsers'

export type ChatMessage = {
  id: string
  from: 'me' | 'them'
  text: string
  /** Minutes before "now". Seed messages use real offsets; sent ones are 0. */
  minutesAgo: number
  /** Wall-clock ms for stable sort once "now" moves. */
  sentAt: number
}

export type ChatThread = {
  user: MockUser
  messages: ChatMessage[]
  unread: boolean
  /** Minutes since last activity at session start. */
  lastActivityMin: number
}

type ChatContextValue = {
  threads: ChatThread[]
  threadForUser: (userId: string) => ChatThread | undefined
  activeUserId: string | null
  openThread: (userId: string) => void
  closeThread: () => void
  sendMessage: (userId: string, text: string) => void
  markRead: (userId: string) => void
  unreadCount: number
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

function seedThreads(): Map<string, ChatThread> {
  const byUser = new Map<string, MockUser>(MOCK_USERS.map((u) => [u.id, u]))
  const map = new Map<string, ChatThread>()
  // Convert each mock message preview into a real thread with that single
  // inbound message as the seed. Users can reply to build up the conversation.
  MOCK_MESSAGES.forEach((m, idx) => {
    const u = byUser.get(m.userId)
    if (!u) return
    const sentAt = Date.now() - m.minutesAgo * 60_000
    map.set(u.id, {
      user: u,
      lastActivityMin: m.minutesAgo,
      unread: m.unread,
      messages: [
        {
          id: `seed_${idx}_${u.id}`,
          from: 'them',
          text: m.preview,
          minutesAgo: m.minutesAgo,
          sentAt,
        },
      ],
    })
  })
  return map
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<Map<string, ChatThread>>(() => seedThreads())
  const [activeUserId, setActiveUserId] = useState<string | null>(null)

  const openThread = useCallback((userId: string) => {
    setActiveUserId(userId)
    setThreads((prev) => {
      const existing = prev.get(userId)
      if (existing) {
        if (!existing.unread) return prev
        const next = new Map(prev)
        next.set(userId, { ...existing, unread: false })
        return next
      }
      // Starting a fresh conversation from a profile/map tap
      const user = MOCK_USERS.find((u) => u.id === userId)
      if (!user) return prev
      const next = new Map(prev)
      next.set(userId, {
        user,
        unread: false,
        lastActivityMin: 0,
        messages: [],
      })
      return next
    })
  }, [])

  const closeThread = useCallback(() => setActiveUserId(null), [])

  const sendMessage = useCallback((userId: string, rawText: string) => {
    const text = rawText.trim()
    if (!text) return
    setThreads((prev) => {
      const next = new Map(prev)
      const t = next.get(userId)
      const user = t?.user ?? MOCK_USERS.find((u) => u.id === userId)
      if (!user) return prev
      const msg: ChatMessage = {
        id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        from: 'me',
        text,
        minutesAgo: 0,
        sentAt: Date.now(),
      }
      next.set(userId, {
        user,
        unread: false,
        lastActivityMin: 0,
        messages: [...(t?.messages ?? []), msg],
      })
      return next
    })
  }, [])

  const markRead = useCallback((userId: string) => {
    setThreads((prev) => {
      const t = prev.get(userId)
      if (!t || !t.unread) return prev
      const next = new Map(prev)
      next.set(userId, { ...t, unread: false })
      return next
    })
  }, [])

  const value = useMemo<ChatContextValue>(() => {
    const list = Array.from(threads.values()).sort((a, b) => {
      const aLast = a.messages[a.messages.length - 1]?.sentAt ?? 0
      const bLast = b.messages[b.messages.length - 1]?.sentAt ?? 0
      return bLast - aLast
    })
    return {
      threads: list,
      threadForUser: (id) => threads.get(id),
      activeUserId,
      openThread,
      closeThread,
      sendMessage,
      markRead,
      unreadCount: list.filter((t) => t.unread).length,
    }
  }, [threads, activeUserId, openThread, closeThread, sendMessage, markRead])

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
