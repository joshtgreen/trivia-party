# Trivia Party

A Jackbox-style multiplayer trivia game. Host picks a subject, AI writes the questions and themes the room, friends compete on their phones.

## Tech stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- **Database:** Neon PostgreSQL (serverless) via Drizzle ORM
- **AI:** Claude (Anthropic SDK) for question + theme generation
- **Realtime:** TBD (WebSocket room service)
- **Hosting:** Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in ANTHROPIC_API_KEY + DATABASE_URL
npm run dev                   # http://localhost:3000
```

## Project structure

```
app/                  Routes (App Router)
  host/               Host create form
  join/               Join with room code
  room/[code]/        Lobby + gameplay
  results/[id]/       Shareable results (7-day TTL)
  api/                API routes

components/
  ui/                 shadcn components
  game/               Gameplay components (TBD)
  theme/              Room theming (TBD)
  audio/              Sound system (TBD)

lib/
  types.ts            Core TypeScript types
  constants.ts        Game config, motif library
  scoring.ts          Base + speed scoring
  room-code.ts        4-letter room code generator
  validation.ts       Input + LLM output validation
  theme-engine.ts     Theme tokens → CSS custom properties
  claude.ts           Claude API integration
  schema.ts           Drizzle DB schema
  db.ts               Neon/Drizzle client

drizzle/              SQL migrations
docs/                 Product spec + engineering plan
```

## Build milestones

1. UI + Theme Engine + Audio + Avatars
2. Room creation + Claude integration
3. Realtime lobby
4. Game loop
5. Results persistence (Neon)
6. Hardening (rate limiting, reconnect, safety)
