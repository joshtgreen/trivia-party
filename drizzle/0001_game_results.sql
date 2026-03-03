CREATE TABLE game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT NOT NULL,
  theme_input TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  theme_tokens JSONB NOT NULL,
  final_leaderboard JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_game_results_expires_at ON game_results (expires_at);
CREATE INDEX idx_game_results_created_at ON game_results (created_at);
