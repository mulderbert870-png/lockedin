import { resolveZip, SEED_ZIPS, ZipRecord } from './zipcodes'

export type MockUser = {
  id: string
  name: string
  age: number
  zip: string
  city: string
  state: string
  lat: number
  lng: number
  avatar: string
  bio: string
  interests: string[]
  vibe: 'Coffee chats' | 'Workout buddy' | 'Nightlife' | 'Hike & explore' | 'Foodie' | 'Study group' | 'Networking' | 'Gaming'
  online: boolean
  lookingFor: string
  joinedDaysAgo: number
}

const FIRST_NAMES = [
  'Ava', 'Liam', 'Noah', 'Maya', 'Ethan', 'Sofia', 'Oliver', 'Isla',
  'Mason', 'Zoe', 'Lucas', 'Mia', 'Aiden', 'Aria', 'Kai', 'Luna',
  'Jaden', 'Nora', 'Eli', 'Ivy', 'Theo', 'Priya', 'Rohan', 'Hana',
  'Diego', 'Camila', 'Jonas', 'Yuki', 'Marcus', 'Imani', 'Felix',
  'Naomi', 'Reza', 'Sasha', 'Owen', 'Leila', 'Tariq', 'Esme',
  'Cassidy', 'Aman', 'Quinn', 'Selena', 'Ben', 'Anya', 'Dom', 'Vera',
  'Wes', 'Tess', 'Jules', 'Mira',
]

const LAST_INITIALS = ['B.', 'C.', 'D.', 'F.', 'G.', 'H.', 'K.', 'L.', 'M.', 'N.', 'P.', 'R.', 'S.', 'T.', 'V.', 'W.', 'Z.']

const INTEREST_POOL = [
  'climbing', 'specialty coffee', 'film photography', 'startup life', 'indie music',
  'F1', 'sourdough', 'pottery', 'pickleball', 'pilates', 'k-dramas', 'AI', 'crypto',
  'hiking', 'surfing', 'thrifting', 'bouldering', 'yoga', 'design', 'cycling',
  'salsa dancing', 'board games', 'matcha', 'jazz vinyl', 'running', 'rooftop bars',
  'ramen', 'open mics', 'natural wine', 'reading clubs', 'volunteering', 'chess',
  'street art', 'live music', 'farmers markets', 'tennis', 'crochet', 'meditation',
  'language exchange', 'cooking classes',
]

const VIBES: MockUser['vibe'][] = [
  'Coffee chats', 'Workout buddy', 'Nightlife', 'Hike & explore',
  'Foodie', 'Study group', 'Networking', 'Gaming',
]

const LOOKING_FOR = [
  'New friends in the area',
  'Workout / gym partner',
  'Weekend hike crew',
  'Coffee shop study buddy',
  'Foodie to try new spots',
  'Co-founder energy',
  'Run club Sundays',
  'Concert + show plus-one',
  'Language exchange',
  'Board game night regular',
]

const BIO_TEMPLATES = [
  'Recently moved to {city}. Looking to meet people who actually like exploring the city.',
  'Born & raised in {city}. Always down for a {interest} session or a long walk.',
  'Designer by day, {interest} obsessed by night. Lets grab a coffee in {city}.',
  'Trying every {interest} spot in {city}. DM me your favorites.',
  'Hybrid remote, mostly working from cafes around {city}. New friends welcome.',
  'Big fan of {interest}, bigger fan of meeting weird interesting humans.',
  'Just wrapped a project, now I have free weekends in {city}. Lets do something.',
  'New in town — looking for a {vibe} kind of crew.',
]

// Deterministic pseudo-random so the feed is stable between renders/sessions.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)]
}

function jitter(value: number, miles: number, rnd: () => number): number {
  // ~1 mile ≈ 0.0145 deg lat; we add a small random offset so markers don't stack.
  const delta = (miles / 69) * (rnd() * 2 - 1)
  return value + delta
}

function generateUsers(): MockUser[] {
  const rnd = mulberry32(42)
  // Resolve each seed ZIP through the `zipcodes` package at startup. Any seed
  // that doesn't resolve (shouldn't happen, but defensive) is dropped.
  const records: ZipRecord[] = SEED_ZIPS
    .map((z) => resolveZip(z))
    .filter((r): r is ZipRecord => r !== null)
  const users: MockUser[] = []
  const NUM = 60

  for (let i = 0; i < NUM; i++) {
    const zipRec = records[i % records.length]
    const first = FIRST_NAMES[Math.floor(rnd() * FIRST_NAMES.length)]
    const last = pick(LAST_INITIALS, rnd)
    const interests = Array.from(
      new Set([pick(INTEREST_POOL, rnd), pick(INTEREST_POOL, rnd), pick(INTEREST_POOL, rnd)]),
    )
    const vibe = pick(VIBES, rnd)
    const bio = pick(BIO_TEMPLATES, rnd)
      .replace('{city}', zipRec.city)
      .replace('{interest}', interests[0])
      .replace('{vibe}', vibe.toLowerCase())

    users.push({
      id: `u_${i + 1}`,
      name: `${first} ${last}`,
      age: 22 + Math.floor(rnd() * 18),
      zip: zipRec.zip,
      city: zipRec.city,
      state: zipRec.state,
      lat: jitter(zipRec.lat, 1.2, rnd),
      lng: jitter(zipRec.lng, 1.2, rnd),
      avatar: `https://i.pravatar.cc/240?img=${(i % 70) + 1}`,
      bio,
      interests,
      vibe,
      online: rnd() > 0.55,
      lookingFor: pick(LOOKING_FOR, rnd),
      joinedDaysAgo: Math.floor(rnd() * 120) + 1,
    })
  }
  return users
}

export const MOCK_USERS: MockUser[] = generateUsers()

// --- Messages mock data (20+ rows) ---
export type MockMessage = {
  id: string
  userId: string
  preview: string
  unread: boolean
  minutesAgo: number
}

const MESSAGE_PREVIEWS = [
  'Hey! Saw you like climbing — wanna hit the gym this weekend?',
  'Coffee at Blue Bottle tomorrow at 10?',
  'Did you check out that new ramen spot?',
  'Down for the Saturday hike?',
  'Lol, totally agree about the run club',
  'Send me the playlist!',
  'Are you going to the show Friday?',
  'My friend is hosting a dinner — you in?',
  'Sounds good, lets schedule it',
  'How did the project demo go?',
  'You free this evening?',
  'Just moved to the neighborhood too!',
  'I have an extra ticket if you want to come',
  'That cafe was perfect, thanks for the rec',
  'Let me know if you find a court tomorrow',
  'Going to the farmers market, want anything?',
  'Quick walk before sunset?',
  'My team is hiring btw — interested?',
  'New pottery class is opening, I signed up',
  'Have you read the new Murakami?',
  'Pickleball Sunday?',
  'Made an extra portion, swing by',
  'Yo same energy 😂',
  'Want to grab a drink after work?',
]

export const MOCK_MESSAGES: MockMessage[] = MESSAGE_PREVIEWS.map((preview, i) => ({
  id: `m_${i + 1}`,
  userId: MOCK_USERS[i % MOCK_USERS.length].id,
  preview,
  unread: i < 6,
  minutesAgo: Math.floor((i + 1) * 7.5),
}))

// --- Events / nearby happenings (used on Discover) ---
export type MockEvent = {
  id: string
  title: string
  host: string
  zip: string
  city: string
  whenLabel: string
  attendees: number
  category: 'Social' | 'Sports' | 'Food' | 'Workshop' | 'Music'
}

export const MOCK_EVENTS: MockEvent[] = [
  { id: 'e1', title: 'Sunset Rooftop Mixer', host: 'Ava B.', zip: '94103', city: 'San Francisco', whenLabel: 'Fri, 7:00 PM', attendees: 28, category: 'Social' },
  { id: 'e2', title: 'Saturday Trail Run', host: 'Liam C.', zip: '10011', city: 'New York', whenLabel: 'Sat, 8:00 AM', attendees: 14, category: 'Sports' },
  { id: 'e3', title: 'Coffee + Cowork', host: 'Maya D.', zip: '78704', city: 'Austin', whenLabel: 'Tue, 9:30 AM', attendees: 9, category: 'Social' },
  { id: 'e4', title: 'Ramen Crawl', host: 'Noah F.', zip: '90028', city: 'Los Angeles', whenLabel: 'Thu, 6:00 PM', attendees: 22, category: 'Food' },
  { id: 'e5', title: 'Pickleball Open Play', host: 'Sofia G.', zip: '98109', city: 'Seattle', whenLabel: 'Sun, 11:00 AM', attendees: 16, category: 'Sports' },
  { id: 'e6', title: 'AI Builders Meetup', host: 'Ethan H.', zip: '94110', city: 'San Francisco', whenLabel: 'Wed, 6:30 PM', attendees: 75, category: 'Workshop' },
  { id: 'e7', title: 'Vinyl Listening Night', host: 'Isla K.', zip: '11211', city: 'Brooklyn', whenLabel: 'Sat, 9:00 PM', attendees: 18, category: 'Music' },
  { id: 'e8', title: 'Morning Yoga in the Park', host: 'Mason L.', zip: '90404', city: 'Santa Monica', whenLabel: 'Sun, 8:00 AM', attendees: 24, category: 'Sports' },
  { id: 'e9', title: 'Founder Coffee', host: 'Zoe M.', zip: '02139', city: 'Cambridge', whenLabel: 'Wed, 8:30 AM', attendees: 12, category: 'Workshop' },
  { id: 'e10', title: 'Karaoke Throwdown', host: 'Lucas N.', zip: '60614', city: 'Chicago', whenLabel: 'Fri, 9:00 PM', attendees: 31, category: 'Music' },
  { id: 'e11', title: 'Sourdough Workshop', host: 'Mia P.', zip: '97214', city: 'Portland', whenLabel: 'Sat, 1:00 PM', attendees: 11, category: 'Workshop' },
  { id: 'e12', title: 'Beachside Bonfire', host: 'Aiden R.', zip: '92101', city: 'San Diego', whenLabel: 'Sat, 7:30 PM', attendees: 40, category: 'Social' },
  { id: 'e13', title: 'Board Game Night', host: 'Aria S.', zip: '80202', city: 'Denver', whenLabel: 'Thu, 7:00 PM', attendees: 17, category: 'Social' },
  { id: 'e14', title: 'Sunrise Hike', host: 'Kai T.', zip: '94704', city: 'Berkeley', whenLabel: 'Sun, 6:00 AM', attendees: 8, category: 'Sports' },
  { id: 'e15', title: 'Speakeasy Tour', host: 'Luna V.', zip: '20009', city: 'Washington', whenLabel: 'Fri, 8:00 PM', attendees: 19, category: 'Social' },
  { id: 'e16', title: 'Latin Dance Social', host: 'Diego B.', zip: '33139', city: 'Miami Beach', whenLabel: 'Sat, 10:00 PM', attendees: 55, category: 'Music' },
  { id: 'e17', title: 'Indie Film Screening', host: 'Camila C.', zip: '90291', city: 'Venice', whenLabel: 'Wed, 8:00 PM', attendees: 27, category: 'Music' },
  { id: 'e18', title: 'Farmer’s Market Walk', host: 'Jonas D.', zip: '78701', city: 'Austin', whenLabel: 'Sat, 10:00 AM', attendees: 13, category: 'Food' },
  { id: 'e19', title: 'Tennis Open Doubles', host: 'Yuki F.', zip: '30308', city: 'Atlanta', whenLabel: 'Sun, 4:00 PM', attendees: 10, category: 'Sports' },
  { id: 'e20', title: 'New In Town Mixer', host: 'Marcus G.', zip: '37203', city: 'Nashville', whenLabel: 'Thu, 7:30 PM', attendees: 34, category: 'Social' },
  { id: 'e21', title: 'Crypto Founders Dinner', host: 'Imani H.', zip: '94102', city: 'San Francisco', whenLabel: 'Mon, 7:00 PM', attendees: 21, category: 'Workshop' },
  { id: 'e22', title: 'Pottery Drop-In', host: 'Felix K.', zip: '02116', city: 'Boston', whenLabel: 'Sat, 2:00 PM', attendees: 12, category: 'Workshop' },
]
