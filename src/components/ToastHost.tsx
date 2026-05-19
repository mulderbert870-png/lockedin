import { useToast } from '../context/ToastContext'

export default function ToastHost() {
  const { toasts, dismiss } = useToast()
  if (toasts.length === 0) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-[0_20px_50px_-15px_rgba(109,92,255,0.6)] backdrop-blur ${
            t.tone === 'success'
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
              : t.tone === 'info'
                ? 'border-sky-400/30 bg-sky-400/10 text-sky-100'
                : 'border-white/10 bg-ink-800/90 text-white/90'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              t.tone === 'success'
                ? 'bg-emerald-400'
                : t.tone === 'info'
                  ? 'bg-sky-400'
                  : 'bg-brand-400'
            }`}
          />
          {t.message}
        </button>
      ))}
    </div>
  )
}
