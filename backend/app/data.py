"""Load the RideOps ticket CSV and add the derived columns everything else uses."""

import re
from functools import lru_cache
from pathlib import Path

import pandas as pd

from .config import TICKETS_CSV
from .reasons import BOUNCE_OUTCOMES

# The brief says the data was pulled on 30 Sep 2026; treat end of that day as "now".
PULL_TIME = pd.Timestamp("2026-09-30 23:59")
DATE_COLS = ["created_at", "first_response_at", "first_closed_at", "final_closed_at"]


def issue_type(description: str) -> str:
    """Collapse numbers so 'duplicate entries for 16 employees' and
    '... for 34 employees' count as the same kind of issue."""
    return re.sub(r"\d+", "N", description).strip()


def _hours(delta: pd.Series) -> pd.Series:
    return delta.dt.total_seconds() / 3600


def prepare(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    for col in DATE_COLS:
        df[col] = pd.to_datetime(df[col], errors="coerce")
    for col in ["eng_ticket_id", "eng_outcome"]:
        df[col] = df[col].fillna("")
    df["eng_handoffs"] = df["eng_handoffs"].fillna(0).astype(int)
    df["reopen_count"] = df["reopen_count"].fillna(0).astype(int)
    df["csat_score"] = pd.to_numeric(df["csat_score"], errors="coerce")

    df["issue_type"] = df["description"].map(issue_type)
    df["escalated"] = df["escalated_to_eng"].eq("Yes")
    df["is_open"] = df["status"].ne("Closed")
    df["bounced"] = df["escalated"] & df["eng_outcome"].isin(BOUNCE_OUTCOMES)
    df["reopened"] = df["reopen_count"] > 0
    df["resolution_hours"] = _hours(df["final_closed_at"] - df["created_at"])
    df["first_response_hours"] = _hours(df["first_response_at"] - df["created_at"])
    # For open tickets, age so far; for closed ones, how long they were open.
    df["age_hours"] = _hours(df["final_closed_at"].fillna(PULL_TIME) - df["created_at"])
    return df


def load_tickets(path: Path | str = TICKETS_CSV) -> pd.DataFrame:
    return prepare(pd.read_csv(path, encoding="utf-8-sig"))


@lru_cache(maxsize=1)
def get_tickets() -> pd.DataFrame:
    return load_tickets()
