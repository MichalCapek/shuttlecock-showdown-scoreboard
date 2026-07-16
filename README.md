# Shuttlecock Showdown Scoreboard

Real-time badminton scoreboard for BK Benátky tournaments. Displays live scores across two courts, overall match standings, and dedicated views for streaming and court-side displays. Score data is synced through Firebase Firestore so every screen updates instantly.

## Features

- **Main scoreboard** (`/`) — dual-court layout with match title, overall team scores, per-court set/score display (with per-court name overrides), and sponsor area
- **Per-court admin** (`/admin/:courtId`) — password-protected controls for scoring, server tracking, player positions (singles/doubles), match timer, and per-court team name overrides
- **Global admin** (`/admin`) — manage match metadata (title, round, team names, logos), overall scores, and court summaries
- **Stream overlay** (`/stream/:courtId`) — transparent overlay for OBS; uses per-court name overrides when set
- **Single court view** (`/court/:courtId`) — full-screen display for one court

Supported court IDs: `court1`, `court2`.

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- [Firebase](https://firebase.google.com/) — Firestore for real-time data, Hosting for deployment
- [React Router](https://reactrouter.com/) for routing

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

### Test

```sh
npm run test
```

### Lint

```sh
npm run lint
```

## CI

GitHub Actions runs `npm run test` and `npm run build` on pushes and pull requests to `main`/`master`.

## Deployment

The project is configured for [Firebase Hosting](https://firebase.google.com/docs/hosting). The hosting site is `badminton-benatky` (Firebase project: `badminton-benatky-scoreboard`).

The Firebase **CLI** is `firebase-tools` (a dev dependency). Do not confuse it with the `firebase` npm package, which is only the client SDK used in the app.

First-time setup:

```sh
npm install
npx firebase login
```

Deploy hosting (builds the app, then uploads `dist/`):

```sh
npm run deploy:hosting
```

Full deploy (hosting + Firestore rules/indexes + storage rules):

```sh
npm run deploy
```

Firestore rules and indexes only:

```sh
npm run deploy:firestore
```

You can also run CLI commands directly via `npx`, e.g. `npx firebase deploy --only hosting`.

## Admin access

Admin panels are protected by passwords stored in Firestore:

- **Global admin** (`/admin`) — password in the `admin/global` document
- **Per-court admin** (`/admin/court1`, `/admin/court2`) — password in the corresponding `admin/{courtId}` document

Set these passwords directly in the Firebase console or via a one-time script before first use.

## Team name overrides

Global team names are set in `/admin` and shown in the overall score header. Per-court overrides (set in `/admin/:courtId` or global admin court cards) apply to:

- Each court panel on the main scoreboard (`/`)
- The single-court display (`/court/:courtId`)
- The stream overlay (`/stream/:courtId`)

The overall score section at the top of `/` always uses global team names and logos.

## Project structure

```
src/
├── components/       # UI components (scoreboard, admin panels, stream overlay)
│   └── admin/        # Admin-specific components (court tracker, timer, etc.)
├── hooks/            # Firestore subscriptions and state hooks
├── lib/              # Firebase init, match parsing, court helpers, tracker rules
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
