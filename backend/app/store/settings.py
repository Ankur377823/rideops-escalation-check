"""The monitor / enforce mode setting."""

from .db import connect

MODES = ("monitor", "enforce")
UPSERT = "INSERT INTO settings(key, value) VALUES('mode', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value"


def get_mode() -> str:
    with connect() as conn:
        row = conn.execute("SELECT value FROM settings WHERE key='mode'").fetchone()
    return row["value"] if row else "monitor"


def set_mode(mode: str) -> str:
    if mode not in MODES:
        raise ValueError(f"mode must be one of {MODES}")
    with connect() as conn:
        conn.execute(UPSERT, (mode,))
    return mode
