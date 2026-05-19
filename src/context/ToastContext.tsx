import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react'

export type ToastTone = 'default' | 'success' | 'info'
export type Toast = { id: string; message: string; tone: ToastTone }

type ToastContextValue = {
  toasts: Toast[]
  showToast: (message: string, tone?: ToastTone) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const AUTO_DISMISS_MS = 2800

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((cur) => cur.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, tone: ToastTone = 'default') => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      setToasts((cur) => [...cur, { id, message, tone }])
      window.setTimeout(() => {
        setToasts((cur) => cur.filter((t) => t.id !== id))
      }, AUTO_DISMISS_MS)
    },
    [],
  )

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, showToast, dismiss }),
    [toasts, showToast, dismiss],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
