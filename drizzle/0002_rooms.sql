CREATE TABLE rooms (
  code        TEXT PRIMARY KEY,
  status      TEXT NOT NULL DEFAULT 'lobby',
  host_name   TEXT NOT NULL,
  theme_input TEXT NOT NULL,
  difficulty  TEXT NOT NULL,
  theme_tokens JSONB NOT NULL,
  questions   JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_rooms_expires_at ON rooms (expires_at);
CREATE INDEX idx_rooms_created_at ON rooms (created_at);
