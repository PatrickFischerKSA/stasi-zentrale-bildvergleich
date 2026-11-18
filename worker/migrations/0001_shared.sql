CREATE TABLE IF NOT EXISTS project (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL DEFAULT 0, state TEXT, updated_at TEXT NOT NULL);
INSERT OR IGNORE INTO project(id, revision, state, updated_at) VALUES(1,0,NULL,strftime('%Y-%m-%dT%H:%M:%fZ','now'));
CREATE TABLE IF NOT EXISTS history (revision INTEGER PRIMARY KEY, state TEXT NOT NULL, updated_at TEXT NOT NULL);
