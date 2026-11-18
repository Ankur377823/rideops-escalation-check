"""Health check and the filter options for the ticket list."""

from fastapi import APIRouter

from ..data import get_tickets

router = APIRouter(tags=["health"])
FILTER_COLS = ["category", "priority", "assigned_agent", "status", "client_tier"]


@router.get("/health")
def health():
    return {"ok": True, "tickets": int(len(get_tickets()))}


@router.get("/filters")
def filters():
    df = get_tickets()
    return {col: sorted(df[col].unique().tolist()) for col in FILTER_COLS}
