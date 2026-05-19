import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import { useToast } from '../context/ToastContext'
import { MOCK_USERS, MockUser } from '../data/mockUsers'
import { distanceMiles } from '../data/zipcodes'
import type { SessionUser } from '../context/AuthContext'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN
}

export default function MapView() {
  const { user } = useAuth()
  if (!MAPBOX_TOKEN) return <MapTokenMissing />
  return <MapViewInner me={user!} />
}

function MapViewInner({ me }: { me: SessionUser }) {
  const navigate = useNavigate()
  const { openThread } = useChat()
  const { showToast } = useToast()
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [selected, setSelected] = useState<MockUser | null>(null)
  const [radius, setRadius] = useState(50)

  function messageSelected() {
    if (!selected) return
    openThread(selected.id)
    showToast(`Opened chat with ${selected.name.split(' ')[0]}`, 'success')
    navigate('/messages')
  }

  const visible = useMemo(() => {
    const meLoc = { lat: me.zipRecord.lat, lng: me.zipRecord.lng }
    return MOCK_USERS
      .map((u) => ({ u, d: distanceMiles(meLoc, { lat: u.lat, lng: u.lng }) }))
      .filter(({ d }) => d <= radius)
      .sort((a, b) => a.d - b.d)
  }, [me.zipRecord.lat, me.zipRecord.lng, radius])

  // Initialize map once
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [me.zipRecord.lng, me.zipRecord.lat],
      zoom: 11.5,
      pitch: 45,
      bearing: -10,
      attributionControl: false,
    })
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new mapboxgl.AttributionControl({ compact: true }))

    map.on('load', () => {
      // Soft halo around user
      map.addSource('me-halo', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [me.zipRecord.lng, me.zipRecord.lat] },
          properties: {},
        },
      })
      map.addLayer({
        id: 'me-halo-fill',
        type: 'circle',
        source: 'me-halo',
        paint: {
          'circle-radius': {
            stops: [
              [10, 50],
              [14, 200],
            ],
          },
          'circle-color': '#6d5cff',
          'circle-opacity': 0.12,
          'circle-blur': 1,
        },
      })
    })

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Recenter when ZIP changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.flyTo({ center: [me.zipRecord.lng, me.zipRecord.lat], zoom: 11.5, essential: true })
    const halo = map.getSource('me-halo') as mapboxgl.GeoJSONSource | undefined
    halo?.setData({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [me.zipRecord.lng, me.zipRecord.lat] },
      properties: {},
    })
  }, [me.zipRecord.lat, me.zipRecord.lng])

  // Sync markers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const selfEl = document.createElement('div')
    selfEl.className = 'user-marker self'
    const selfMarker = new mapboxgl.Marker({ element: selfEl })
      .setLngLat([me.zipRecord.lng, me.zipRecord.lat])
      .setPopup(new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
        `<div style="font-weight:600">You</div><div style="font-size:12px;color:#a8a3c0">${me.zipRecord.city}, ${me.zipRecord.state} ${me.zipRecord.zip}</div>`,
      ))
      .addTo(map)
    markersRef.current.push(selfMarker)

    visible.forEach(({ u, d }) => {
      const el = document.createElement('div')
      el.className = 'user-marker'
      el.title = u.name
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([u.lng, u.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 16, closeButton: false }).setHTML(
            `<div style="display:flex;gap:10px;align-items:center;min-width:220px">
              <img src="${u.avatar}" style="width:44px;height:44px;border-radius:12px;object-fit:cover" />
              <div>
                <div style="font-weight:600">${u.name} <span style="opacity:.5;font-weight:400">· ${u.age}</span></div>
                <div style="font-size:12px;color:#a8a3c0">${u.city}, ${u.state} · ${d.toFixed(1)} mi</div>
                <div style="font-size:11px;color:#8b7cff;margin-top:4px">${u.vibe}</div>
              </div>
            </div>`,
          ),
        )
        .addTo(map)
      el.addEventListener('click', () => setSelected(u))
      markersRef.current.push(marker)
    })
  }, [visible, me.zipRecord.lat, me.zipRecord.lng, me.zipRecord.city, me.zipRecord.state, me.zipRecord.zip])

  return (
    <div className="relative h-[calc(100vh-110px)] md:h-[calc(100vh-65px)]">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Top floating panel */}
      <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center">
        <div className="glass pointer-events-auto flex max-w-2xl flex-wrap items-center gap-3 rounded-full px-4 py-2 text-sm">
          <span className="chip">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-glow" />
            {visible.length} neighbors in view
          </span>
          <span className="hidden text-white/40 sm:inline">·</span>
          <span className="hidden text-white/70 sm:inline">{me.zipRecord.city}, {me.zipRecord.state} {me.zipRecord.zip}</span>
          <span className="text-white/40">·</span>
          <label className="flex items-center gap-2 text-white/70">
            <span className="text-xs uppercase tracking-widest text-white/45">Radius</span>
            <input
              type="range"
              min={10}
              max={200}
              step={5}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="accent-brand-500"
            />
            <span className="w-12 text-right tabular-nums text-xs">{radius} mi</span>
          </label>
        </div>
      </div>

      {/* Side list */}
      <aside className="absolute bottom-4 left-4 top-20 z-10 hidden w-80 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/85 backdrop-blur-xl md:block">
        <div className="border-b border-white/5 px-4 py-3">
          <div className="font-display text-lg font-semibold">Pinned nearby</div>
          <div className="text-xs text-white/45">Click a marker or list item</div>
        </div>
        <ul className="h-full overflow-y-auto pb-12">
          {visible.map(({ u, d }) => (
            <li
              key={u.id}
              onClick={() => {
                setSelected(u)
                mapRef.current?.flyTo({ center: [u.lng, u.lat], zoom: 13.5, essential: true })
              }}
              className={`flex cursor-pointer items-center gap-3 border-b border-white/5 px-4 py-3 transition hover:bg-white/5 ${selected?.id === u.id ? 'bg-white/5' : ''}`}
            >
              <img src={u.avatar} className="h-10 w-10 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{u.name}</div>
                <div className="truncate text-xs text-white/50">{u.city} · {d.toFixed(1)} mi · {u.vibe}</div>
              </div>
              {u.online && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
            </li>
          ))}
        </ul>
      </aside>

      {/* Detail panel */}
      {selected && (
        <div className="absolute bottom-4 right-4 z-10 w-[340px] max-w-[calc(100%-2rem)] rounded-2xl border border-white/10 bg-ink-900/90 p-5 backdrop-blur-xl">
          <button
            onClick={() => setSelected(null)}
            className="absolute right-3 top-3 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <img src={selected.avatar} className="h-14 w-14 rounded-2xl object-cover" />
            <div>
              <div className="font-semibold">{selected.name} <span className="text-white/45 font-normal">· {selected.age}</span></div>
              <div className="text-xs text-white/55">{selected.city}, {selected.state}</div>
              <span className="chip mt-1 text-[10px]">{selected.vibe}</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-white/70">{selected.bio}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {selected.interests.map((t) => (
              <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/65">#{t}</span>
            ))}
          </div>
          <button onClick={messageSelected} className="btn-primary mt-4 w-full text-sm">
            Send a message
          </button>
        </div>
      )}
    </div>
  )
}

function MapTokenMissing() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <div className="card text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.2L20 8l-8 4-8-4 8-3.8z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-semibold">Map unavailable</h2>
        <p className="mt-2 text-sm text-white/60">
          The Mapbox token isn&apos;t set. Add it to a <code className="rounded bg-white/10 px-1 py-0.5 text-white/85">.env.local</code> file
          at the project root and restart the dev server.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-ink-900/80 p-3 text-left text-xs text-white/75">
VITE_MAPBOX_TOKEN=pk.your_mapbox_public_token_here
        </pre>
        <a
          href="https://account.mapbox.com/access-tokens/"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost mt-5 text-sm"
        >
          Get a Mapbox token
        </a>
      </div>
    </div>
  )
}
