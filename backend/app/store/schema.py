"""Table definitions."""

SCHEMA = """
CREATE TABLE IF NOT EXISTS decisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id TEXT NOT NULL,
    agent TEXT,
    mode TEXT NOT NULL,
    action TEXT NOT NULL,
    missing_items TEXT NOT NULL,
    answers TEXT NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS known_issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    issue_type TEXT,
    status TEXT NOT NULL,
    workaround TEXT,
    source TEXT,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS handoff_notes (
    cache_key TEXT PRIMARY KEY, note TEXT NOT NULL, source TEXT NOT NULL
);
"""
