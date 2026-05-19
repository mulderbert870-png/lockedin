import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Discover from './pages/Discover'
import MapView from './pages/MapView'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Navbar from './components/Navbar'
import ToastHost from './components/ToastHost'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

export default function App() {
  const { user } = useAuth()
  const location = useLocation()
  const showNav = !!user && location.pathname !== '/' && location.pathname !== '/login'

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/discover"
            element={
              <RequireAuth>
                <Discover />
              </RequireAuth>
            }
          />
          <Route
            path="/map"
            element={
              <RequireAuth>
                <MapView />
              </RequireAuth>
            }
          />
          <Route
            path="/messages"
            element={
              <RequireAuth>
                <Messages />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ToastHost />
    </div>
  )
}
