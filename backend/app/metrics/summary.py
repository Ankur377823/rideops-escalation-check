"""Headline numbers for the whole dataset."""

import pandas as pd

from ..data import PULL_TIME
from ..stats import mean, median, rate
from .backlog import STALE_HOURS, open_at


def summary(df: pd.DataFrame) -> dict:
    """Headline numbers for the whole dataset."""
    escalated, at_l1 = df[df["escalated"]], df[~df["escalated"]]
    bounced = escalated[escalated["bounced"]]
    total_hours = df["age_hours"].sum()
    monthly = df.groupby(df["created_at"].dt.strftime("%Y-%m")).size()
    return {
        "tickets": int(len(df)),
        "open_now": int(df["is_open"].sum()),
        "open_over_48h_now": open_at(df, PULL_TIME, STALE_HOURS),
        "tickets_by_month": {month: int(count) for month, count in monthly.items()},
        "escalated": int(len(escalated)),
        "escalation_rate": rate(df["escalated"]),
        "bounced": int(len(bounced)),
        "bounce_rate": rate(escalated["bounced"]),
        "multi_handoff": int((df["eng_handoffs"] >= 2).sum()),
        "reopen_rate": rate(df["reopened"]),
        "median_hours_l1": median(at_l1["resolution_hours"]),
        "median_hours_escalated": median(escalated["resolution_hours"]),
        "csat_l1": mean(at_l1["csat_score"]),
        "csat_escalated": mean(escalated["csat_score"]),
        "escalated_share_of_hours": round(float(escalated["age_hours"].sum() / total_hours), 3),
        "bounced_share_of_hours": round(float(bounced["age_hours"].sum() / total_hours), 3),
    }
