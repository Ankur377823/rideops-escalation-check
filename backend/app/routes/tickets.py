"""List tickets with filters, and fetch one ticket."""

from fastapi import APIRouter, Query

from ..data import get_tickets
from ..serialize import LIST_COLS, records
from .deps import ticket_json

router = APIRouter(prefix="/tickets", tags=["tickets"])
SEARCH_COLS = ["description", "ticket_id", "client_name"]


@router.get("")
def list_tickets(
    status: str | None = None,
    category: str | None = None,
    agent: str | None = None,
    priority: str | None = None,
    open_only: bool = False,
    q: str | None = None,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    df = get_tickets()
    exact = {"status": status, "category": category, "assigned_agent": agent, "priority": priority}
    for col, value in exact.items():
        if value:
            df = df[df[col] == value]
    if open_only:
        df = df[df["is_open"]]
    if q:
        needle = q.lower()
        hits = [df[col].str.lower().str.contains(needle, regex=False) for col in SEARCH_COLS]
        df = df[hits[0] | hits[1] | hits[2]]
    df = df.sort_values("created_at", ascending=False)
    return {"total": int(len(df)), "items": records(df.iloc[offset : offset + limit], LIST_COLS)}


@router.get("/{ticket_id}")
def ticket_detail(ticket_id: str):
    return ticket_json(ticket_id)
