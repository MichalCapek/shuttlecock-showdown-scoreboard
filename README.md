# Shuttlecock Showdown Scoreboard

Real-time badminton scoreboard for BK Benátky tournaments. Displays live scores across two courts, overall match standings, and dedicated views for streaming and court-side displays. Score data is synced through Firebase Firestore so every screen updates instantly.

## Features

- **Main scoreboard** (`/`) — dual-court layout with match title, overall team scores, per-court set/score display, and sponsor area
- **Per-court admin** (`/admin/:courtId`) — password-protected controls for scoring, server tracking, player positions (singles/doubles), match timer, and per-court team name overrides
- **Global admin** (`/admin`) — manage match metadata (title, round, team names, logos), overall scores, and court summaries
- **Stream overlay** (`/stream/:courtId`) — transparent overlay for OBS or other streaming software
- **Single court view** (`/court/:courtId`) — full-screen display for one court

Supported court IDs: `court1`, `court2`.

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- [Firebase](https://firebase.google.com/) — Firestore for real-time data, Hosting for deployment
- [React Router](https://reactrouter.com/) for routing
- [Framer Motion](https://www.framer.com/motion/) for score animations

## Getting started

### Prerequisites

- Node.js 18+ and npm
- A Firebase project with Firestore enabled

### Setup

```sh
git clone <YOUR_GIT_URL>
cd shuttlecock-showdown-scoreboard
npm install
```

Copy the environment template and fill in your Firebase config:

```sh
cp .env.example .env
```

Set the `VITE_FIREBASE_*` variables in `.env` to match your Firebase project (Project Settings → Your apps → Web app config).

### Development

```sh
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Build

```sh
npm run build
```

Output is written to `dist/`.

### Lint

```sh
npm run lint
```

## Deployment

The project is configured for [Firebase Hosting](https://firebase.google.com/docs/hosting). The hosting site is `badminton-benatky` (Firebase project: `badminton-benatky-scoreboard`).

```sh
npm run build
firebase deploy
```

To deploy only hosting:

```sh
firebase deploy --only hosting
```

Firestore rules and indexes can be deployed separately:

```sh
firebase deploy --only firestore
```

## Admin access

Admin panels are protected by passwords stored in Firestore:

- **Global admin** (`/admin`) — password in the `admin/global` document
- **Per-court admin** (`/admin/court1`, `/admin/court2`) — password in the corresponding `admin/{courtId}` document

Set these passwords directly in the Firebase console or via a one-time script before first use.

## Project structure

```
src/
├── components/       # UI components (scoreboard, admin panels, stream overlay)
│   └── admin/        # Admin-specific components (court tracker, timer, etc.)
├── hooks/            # Firestore subscriptions and state hooks
├── lib/              # Utility functions and court tracker rules
├── pages/            # Route entry points
├── constants/        # Court IDs, Firestore paths, defaults
└── types/            # Shared TypeScript types
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Main dual-court scoreboard |
| `/admin` | Global match administration |
| `/admin/:courtId` | Per-court scoring and controls |
| `/stream/:courtId` | Transparent stream overlay |
| `/court/:courtId` | Single-court full-screen display |
