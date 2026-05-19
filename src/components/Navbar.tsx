import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkBase =
  'px-3 py-2 rounded-full text-sm font-medium transition text-white/70 hover:text-white hover:bg-white/5'
const linkActive = 'text-white bg-white/10'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <NavLink to="/discover" className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-lg font-semibold tracking-tight">LockedIn</span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/discover" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
            Discover
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
            Map
          </NavLink>
          <NavLink to="/messages" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
            Messages
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
            Profile
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <div className="text-xs text-white/40">Signed in</div>
            <div className="text-sm font-medium">{user.displayName}</div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-semibold">
            {user.displayName[0]?.toUpperCase() ?? 'U'}
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="hidden rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10 md:block"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center justify-around border-t border-white/5 px-2 py-2 md:hidden">
        <NavLink to="/discover" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>Discover</NavLink>
        <NavLink to="/map" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>Map</NavLink>
        <NavLink to="/messages" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>Messages</NavLink>
        <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>Profile</NavLink>
      </nav>
    </header>
  )
}

function Logo() {
  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-[0_8px_24px_-8px_rgba(109,92,255,0.6)]">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
        <path d="M12 2C7.6 2 4 5.4 4 9.6c0 5 8 12.4 8 12.4s8-7.4 8-12.4C20 5.4 16.4 2 12 2zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
      </svg>
    </span>
  )
}
