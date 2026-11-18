"""Lookups shared by several routes."""

import pandas as pd
from fastapi import HTTPException

from ..data import get_tickets
from ..serialize import DETAIL_COLS, records


def _match(ticket_id: str) -> pd.DataFrame:
    df = get_tickets()
    match = df[df["ticket_id"] == ticket_id]
    if match.empty:
        raise HTTPException(404, f"Ticket {ticket_id} not found")
    return match


def ticket_row(ticket_id: str) -> pd.Series:
    return _match(ticket_id).iloc[0]


def ticket_json(ticket_id: str) -> dict:
    return records(_match(ticket_id), DETAIL_COLS)[0]
