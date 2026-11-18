"""Known issues: add, list and change status."""

from .db import connect, now

INSERT = (
    "INSERT INTO known_issues(title, category, issue_type, status, workaround, source, created_at) "
    "VALUES (?,?,?,?,?,?,?)"
)


def list_known_issues(category: str | None = None, only_open: bool = False) -> list[dict]:
    sql, args = "SELECT * FROM known_issues WHERE 1=1", []
    if category:
        sql += " AND category=?"
        args.append(category)
    if only_open:
        sql += " AND status='Open'"
    with connect() as conn:
        rows = conn.execute(sql + " ORDER BY id", args).fetchall()
    return [dict(row) for row in rows]


def add_known_issue(
    title: str,
    category: str,
    issue_type: str | None = None,
    workaround: str | None = None,
    source: str = "manual",
    status: str = "Open",
) -> dict:
    values = (title, category, issue_type, status, workaround, source, now())
    with connect() as conn:
        cursor = conn.execute(INSERT, values)
        row = conn.execute("SELECT * FROM known_issues WHERE id=?", (cursor.lastrowid,)).fetchone()
    return dict(row)


def set_known_issue_status(issue_id: int, status: str) -> dict | None:
    with connect() as conn:
        conn.execute("UPDATE known_issues SET status=? WHERE id=?", (status, issue_id))
        row = conn.execute("SELECT * FROM known_issues WHERE id=?", (issue_id,)).fetchone()
    return dict(row) if row else None


def count_known_issues() -> int:
    with connect() as conn:
        return conn.execute("SELECT COUNT(*) FROM known_issues").fetchone()[0]
