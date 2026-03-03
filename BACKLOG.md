# Backlog

Stuff to do, fix, or think about. Checked items are done.

## Blocked

- [ ] Add `ANTHROPIC_API_KEY` to `.env.local` and Vercel env vars (Anthropic console was down — do this first before testing room creation)

## Up Next

- [x] Realtime architecture decision: pick WebSocket provider (PartyKit vs Ably vs Pusher vs custom) for Milestone 3
- [x] Wire up actual multiplayer join flow (player joins room via WebSocket, sees lobby)
- [x] Game loop: timer, answer submission, reveal, host-driven pacing (Milestone 4)
- [ ] Deploy PartyKit to production (`npx partykit deploy`) and set `NEXT_PUBLIC_PARTYKIT_HOST` on Vercel
- [ ] Results persistence: save final leaderboard to `game_results` table, shareable link with 7-day TTL (Milestone 5)

## UI / Polish

- [ ] Motif background layer: render Claude-selected motif SVGs as subtle background patterns on room pages
- [ ] Audio system: lofi background track, SFX (join pop, countdown tick, correct/incorrect, winner fanfare), mute toggle
- [x] Winner celebration screen with confetti animation
- [ ] Custom 404 page matching the dark theme
- [ ] "What is this?" modal on landing page (3-step explainer)
- [ ] Loading skeleton for room page (while DB query resolves)

## Hardening (Milestone 6)

- [ ] Rate limiting on room creation and join attempts
- [ ] Reconnect tokens (playerToken in localStorage for reconnecting to a room)
- [ ] Content safety filtering on LLM output (badgeText, question content)
- [ ] Cron job to clean up expired rooms and results
- [ ] Error monitoring (Sentry or similar)

## Ideas / Maybe Later

- [ ] AI-generated avatars (v2 — image model, moderation, fallback to static)
- [ ] "Replay theme" button on results screen (same theme, fresh questions, new room)
- [ ] Spectator mode (join after game starts, watch but can't answer)
- [ ] Theme-specific music (different lofi tracks per mood)
- [ ] Reduce question count to 10 if Vercel Hobby timeout is an issue
