# LockedIn — Location-Based Social MVP

A neighborhood-first social platform. Sign up with any email/password, drop your ZIP, and meet people on your block.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Stack

- React 18 + TypeScript + Vite
- React Router 6 (Landing / Login / Discover / Map / Messages / Profile)
- Tailwind CSS for styling
- Mapbox GL JS for the live neighborhood map
- LocalStorage-backed mock auth (any email + 4+ char password works)

## Demo flow

1. Open `/` — animated landing page.
2. Click "Get started" → `/login`.
3. Enter any email + password and a ZIP (try `94110`, `10011`, `78704`, `98101`).
4. `/discover` shows 60 mock users sorted by distance, with vibe filters, radius slider, and 22 mock events.
5. `/map` plots all nearby users on Mapbox with popups and a side list.
6. `/messages` is a 24-thread mock inbox.
7. `/profile` lets you switch ZIPs to instantly reroute the feed and map.

## Mock data

- 60 seeded users across 40+ ZIPs in 16 US metros.
- 22 community events.
- 24 message threads.

ZIPs not in the seed list fall back to the numerically nearest known ZIP, so any 5-digit input still returns a coordinate.
