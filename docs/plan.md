# Plan: Set up `trivia-party` GitHub repo with full project scaffold

## Context
Josh wants to build a Jackbox-style multiplayer trivia web app where a host picks a theme, Claude generates 20 questions + room theming, and players compete in real-time on their phones. This plan covers creating the GitHub repo and scaffolding the full project structure so development can begin immediately.

## Steps

### 1. Create the GitHub repo
- `gh repo create trivia-party --public --clone`
- Initialize with `.gitignore` (Node)

### 2. Initialize Next.js project
- `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"`
- This gives us: App Router, TypeScript, Tailwind CSS, ESLint

### 3. Install core dependencies
```
npm install @anthropic-ai/sdk @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit
```
- **Drizzle ORM** for type-safe DB access with Neon serverless
- **@anthropic-ai/sdk** for Claude question/theme generation
- **@neondatabase/serverless** for Neon's HTTP-based serverless driver

### 4. Set up shadcn/ui
- `npx shadcn@latest init` (New York style, slate base, CSS variables)
- Install a starter set of components: `button`, `input`, `card`, `badge`, `dialog`, `select`

### 5. Create folder structure
```
app/
├── layout.tsx              (global layout + font + metadata)
├── page.tsx                (landing: Host / Join)
├── host/page.tsx           (host create form)
├── join/page.tsx           (join with room code)
├── room/[code]/page.tsx    (lobby → gameplay → finished)
├── results/[id]/page.tsx   (shareable results, 7-day TTL)
└── api/
    ├── rooms/create/route.ts
    └── results/[id]/route.ts

components/
├── ui/                     (shadcn components go here)
├── game/                   (QuestionCard, Leaderboard, Timer, etc.)
├── theme/                  (ThemeProvider, MotifBackground)
└── audio/                  (SoundProvider, MuteToggle)

lib/
├── db.ts                   (Neon/Drizzle client)
├── schema.ts               (Drizzle schema: game_results table)
├── claude.ts               (Claude API: generate questions + theme)
├── scoring.ts              (base + speed scoring logic)
├── room-code.ts            (4-letter code generation)
├── theme-engine.ts         (theme tokens → CSS custom properties)
├── types.ts                (Question, Room, Player, Theme, etc.)
├── constants.ts            (ALLOWED_MOTIFS, ROLES, scoring config)
└── validation.ts           (name, theme input, LLM output validation)

public/
├── avatars/                (empty, will hold static avatar SVGs)
├── motifs/                 (empty, will hold motif SVGs)
└── audio/                  (empty, will hold SFX + lofi track)

drizzle/
└── 0001_game_results.sql   (initial migration)
```

### 6. Write foundational files

**`lib/types.ts`** — Core types from the spec:
- `Question` (id, question, choices, correctIndex, explanation)
- `ThemeTokens` (input, displayName, primaryHue, accentHue, mood, badgeText, backgroundMotifs, density)
- `RoomStatus` (generating | lobby | question | reveal_waiting | finished)
- `Player` (id, name, avatarId, score, correctCount, totalAnswerTimeMs)
- `GameResults` (for DB persistence)
- `LLMResponse` (theme + questions combined)

**`lib/constants.ts`** — Static config:
- `ALLOWED_MOTIFS` (full list from spec §5.3)
- `SCORING` config (totalMs=20000, base=1000, speedMax=500)
- `ROOM_CODE_ALPHABET` (A-Z minus I,O)
- `MAX_PLAYERS` = 12
- `QUESTION_COUNT` = 20
- `RESULTS_TTL_DAYS` = 7

**`lib/scoring.ts`** — Scoring logic from spec §12:
- `calculateScore(remainingMs)` → `{ base, speed, total }`

**`lib/room-code.ts`** — Room code generator from spec §13:
- `generateRoomCode()` → 4-letter string using crypto.getRandomValues

**`lib/validation.ts`** — Input validation from spec §16:
- `validateName(name)` — 1–18 chars, trimmed
- `validateThemeInput(input)` — 3–80 chars, trimmed
- `validateLLMResponse(data)` — full schema check per spec §8.5

**`lib/schema.ts`** — Drizzle schema for `game_results` table per spec §14

**`lib/db.ts`** — Neon serverless + Drizzle client setup

**`drizzle/0001_game_results.sql`** — Raw SQL migration matching spec §14.1

**`drizzle.config.ts`** — Drizzle Kit config pointing at Neon

### 7. Stub out route pages
Each page gets a minimal placeholder component so the routing works:
- `app/page.tsx` — Landing with "Host a Game" / "Join a Game" buttons
- `app/host/page.tsx` — Form shell (name, theme, difficulty)
- `app/join/page.tsx` — Form shell (room code, name, avatar)
- `app/room/[code]/page.tsx` — "Room: {code}" placeholder
- `app/results/[id]/page.tsx` — "Results" placeholder

### 8. Create config files
- **`.env.example`** — All env vars from spec §21:
  ```
  ANTHROPIC_API_KEY=
  DATABASE_URL=
  RESULTS_TTL_DAYS=7
  ```
- **`drizzle.config.ts`** — Drizzle Kit configuration
- Update **`tailwind.config.ts`** to include CSS variable-based theme support

### 9. Initial commit and push
- Commit everything with a clear message
- Push to `main`

## What this does NOT include (deferred to Milestone 1+)
- Actual realtime/WebSocket implementation (needs architecture decision on provider — PartyKit, Ably, etc.)
- Avatar SVGs or motif SVGs (asset creation)
- Audio files
- Claude prompt implementation (just the type stubs)
- Actual gameplay UI components
- Deployment config (Vercel project linking)

## Verification
- `npm run dev` starts without errors
- All routes (`/`, `/host`, `/join`, `/room/TEST`, `/results/test-id`) render placeholder content
- `npm run build` succeeds with no TypeScript errors
- Repo visible at `github.com/joshtgreen/trivia-party`
