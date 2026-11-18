"""Cache for LLM-written handoff notes."""

from .db import connect

UPSERT = (
    "INSERT INTO handoff_notes(cache_key, note, source) VALUES (?,?,?) "
    "ON CONFLICT(cache_key) DO UPDATE SET note=excluded.note, source=excluded.source"
)


def get_cached_note(cache_key: str) -> dict | None:
    with connect() as conn:
        row = conn.execute("SELECT note, source FROM handoff_notes WHERE cache_key=?", (cache_key,)).fetchone()
    return dict(row) if row else None


def cache_note(cache_key: str, note: str, source: str) -> None:
    with connect() as conn:
        conn.execute(UPSERT, (cache_key, note, source))
