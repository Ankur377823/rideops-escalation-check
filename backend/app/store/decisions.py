"""The decision log: one row per completed check."""

import json
import sqlite3

from .db import connect, now

INSERT = (
    "INSERT INTO decisions(ticket_id, agent, mode, action, missing_items, answers, note, created_at) "
    "VALUES (?,?,?,?,?,?,?,?)"
)


def _decode(row: sqlite3.Row) -> dict:
    decision = dict(row)
    decision["missing_items"] = json.loads(decision["missing_items"])
    decision["answers"] = json.loads(decision["answers"])
    return decision


def log_decision(
    ticket_id: str, agent: str | None, mode: str, action: str, missing_items: list[str], answers: dict, note: str | None
) -> dict:
    values = (ticket_id, agent, mode, action, json.dumps(missing_items), json.dumps(answers), note, now())
    with connect() as conn:
        cursor = conn.execute(INSERT, values)
        row = conn.execute("SELECT * FROM decisions WHERE id=?", (cursor.lastrowid,)).fetchone()
    return _decode(row)


def list_decisions(limit: int = 200) -> list[dict]:
    with connect() as conn:
        rows = conn.execute("SELECT * FROM decisions ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    return [_decode(row) for row in rows]


def summarise_decisions(items: list[dict]) -> dict:
    escalated = [d for d in items if d["action"] == "escalated"]
    return {
        "checks": len(items),
        "escalated": len(escalated),
        "escalated_with_gaps": sum(1 for d in escalated if d["missing_items"]),
        "kept_at_l1": sum(1 for d in items if d["action"] == "resolved_at_l1"),
        "linked_known_issue": sum(1 for d in items if d["action"] == "linked_known_issue"),
    }
