"""The same profile of numbers for each agent, category or handoff count."""

import pandas as pd

from ..stats import mean, median, rate


def _profile(group: pd.DataFrame) -> dict:
    return {
        "tickets": int(len(group)),
        "escalation_rate": rate(group["escalated"]),
        "bounce_rate": rate(group[group["escalated"]]["bounced"]),
        "median_hours": median(group["resolution_hours"]),
        "reopen_rate": rate(group["reopened"]),
        "csat": mean(group["csat_score"]),
        "open": int(group["is_open"].sum()),
    }


def _by(df: pd.DataFrame, col: str) -> list[dict]:
    rows = [{col: key, **_profile(group)} for key, group in df.groupby(col)]
    return sorted(rows, key=lambda row: -row["tickets"])


def by_agent(df: pd.DataFrame) -> list[dict]:
    return _by(df, "assigned_agent")


def by_category(df: pd.DataFrame) -> list[dict]:
    return _by(df, "category")


def by_handoffs(df: pd.DataFrame) -> list[dict]:
    return [
        {
            "eng_handoffs": int(trips),
            "tickets": int(len(group)),
            "median_hours": median(group["resolution_hours"]),
            "csat": mean(group["csat_score"]),
            "open": int(group["is_open"].sum()),
        }
        for trips, group in df.groupby("eng_handoffs")
    ]
