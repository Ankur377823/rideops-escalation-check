"""The success measures, one row per week."""

import pandas as pd

from ..stats import mean, rate
from .backlog import STALE_HOURS, open_at, week_ends


def _week_row(df: pd.DataFrame, start: pd.Timestamp, end: pd.Timestamp) -> dict:
    created = df[(df["created_at"] >= start) & (df["created_at"] < end)]
    closed = df[(df["final_closed_at"] >= start) & (df["final_closed_at"] < end)]
    escalated = created[created["escalated"]]
    return {
        "week_start": start.strftime("%Y-%m-%d"),
        "week_end": end.strftime("%Y-%m-%d"),
        "created": int(len(created)),
        "closed": int(len(closed)),
        "open_at_end": open_at(df, end),
        "open_over_48h": open_at(df, end, STALE_HOURS),
        "escalated": int(len(escalated)),
        "escalation_rate": rate(created["escalated"]),
        "bounce_rate": rate(escalated["bounced"]),
        "multi_handoff": int((created["eng_handoffs"] >= 2).sum()),
        "reopen_rate": rate(created["reopened"]),
        "csat": mean(created["csat_score"]),
    }


def weekly(df: pd.DataFrame) -> list[dict]:
    """One row per week. The first and last rows are part-weeks."""
    starts = [df["created_at"].min().normalize(), *week_ends(df)[:-1]]
    return [_week_row(df, start, end) for start, end in zip(starts, week_ends(df), strict=True)]
