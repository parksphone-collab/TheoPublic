-- TheoPublic Task Database Schema
-- Run this in Cloudflare D1 dashboard or via wrangler

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL CHECK(category IN ('fixes', 'investigations', 'money_projects', 'fun_projects')),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK(priority IN ('high', 'medium', 'low')),
  status TEXT CHECK(status IN ('pending', 'in_progress', 'completed')),
  progress INTEGER DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
  revenue REAL DEFAULT 0,
  emoji TEXT,
  links TEXT, -- JSON array
  milestones TEXT, -- JSON array
  notes TEXT,
  checked BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster category queries
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Seed data for demo
INSERT INTO tasks (category, title, description, priority, status, checked) VALUES
('fixes', 'Memory search auth fix', 'Configure OpenRouter embeddings', 'high', 'completed', 1),
('fixes', 'Gmail token refresh', 'Update refresh token for monitor', 'medium', 'pending', 0);

INSERT INTO tasks (category, title, status, notes) VALUES
('investigations', 'OpenRouter embeddings for memory', 'completed', 'Working via remote config'),
('investigations', 'Cloudflare Workers for API proxy', 'in_progress', 'Exploring for financial data');

INSERT INTO tasks (category, title, progress, revenue, description, links) VALUES
('money_projects', 'Theo Dashboard SaaS', 25, 0, 'CIA-style dashboard for productivity', '["https://github.com/parksphone-collab/TheoPublic"]'),
('money_projects', 'AI Consulting', 10, 0, 'Personal AI assistant services', '[]');

INSERT INTO tasks (category, title, emoji, milestones, notes) VALUES
('fun_projects', '3D Print Tracker', '🖨️', '[{"done": true, "text": "Design mockups"}, {"done": false, "text": "Bambu API integration"}]', 'Track P2S prints and filament'),
('fun_projects', 'Plex Dashboard', '🎬', '[{"done": false, "text": "Tautulli API"}]', 'Media server stats and alerts');
