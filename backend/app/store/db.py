"""SQLite connection and table creation."""

import sqlite3
from contextlib import contextmanager
from datetime import UTC, datetime

from .. import config
from .schema import SCHEMA


def now() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds")


@contextmanager
def connect():
    conn = sqlite3.connect(config.db_path())
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    config.db_path().parent.mkdir(parents=True, exist_ok=True)
    with connect() as conn:
        conn.executescript(SCHEMA)
