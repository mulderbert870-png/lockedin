import { MockUser } from '../data/mockUsers'

type Props = {
  user: MockUser
  distanceMi: number
  onMessage?: (u: MockUser) => void
}

export default function UserCard({ user, distanceMi, onMessage }: Props) {
  return (
    <article className="card group flex flex-col">
      <div className="flex items-start gap-3">
        <div className="relative">
          <img src={user.avatar} alt={user.name} className="h-14 w-14 rounded-2xl object-cover" />
          {user.online && (
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-ink-800 bg-emerald-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{user.name}</h3>
            <span className="text-xs text-white/40">· {user.age}</span>
          </div>
          <div className="text-xs text-white/55">{user.city}, {user.state} · {distanceMi.toFixed(1)} mi away</div>
        </div>
        <span className="chip text-[10px]">{user.vibe}</span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-white/65">{user.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {user.interests.map((t) => (
          <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/65">#{t}</span>
        ))}
      </div>

      <div className="mt-4 border-t border-white/5 pt-3 text-xs text-white/55">
        <div className="mb-2">Looking for: <span className="text-white/75">{user.lookingFor}</span></div>
        <div className="flex items-center justify-between">
          <span className="text-white/40">Joined {user.joinedDaysAgo}d ago</span>
          <button
            onClick={() => onMessage?.(user)}
            className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-3 py-1.5 text-xs font-semibold text-white opacity-90 transition group-hover:opacity-100"
          >
            Lock in →
          </button>
        </div>
      </div>
    </article>
  )
}
