import { pgTable, uuid, text, jsonb, timestamp, index } from "drizzle-orm/pg-core";

export const rooms = pgTable(
  "rooms",
  {
    code: text("code").primaryKey(),
    status: text("status").notNull().default("lobby"),
    hostName: text("host_name").notNull(),
    themeInput: text("theme_input").notNull(),
    difficulty: text("difficulty").notNull(),
    themeTokens: jsonb("theme_tokens").notNull(),
    questions: jsonb("questions").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("idx_rooms_expires_at").on(table.expiresAt),
    index("idx_rooms_created_at").on(table.createdAt),
  ]
);

export const gameResults = pgTable(
  "game_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roomCode: text("room_code").notNull(),
    themeInput: text("theme_input").notNull(),
    difficulty: text("difficulty").notNull(),
    themeTokens: jsonb("theme_tokens").notNull(),
    finalLeaderboard: jsonb("final_leaderboard").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("idx_game_results_expires_at").on(table.expiresAt),
    index("idx_game_results_created_at").on(table.createdAt),
  ]
);
