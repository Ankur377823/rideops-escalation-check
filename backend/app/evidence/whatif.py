"""A what-if on the ticket history, not a measured result."""

import pandas as pd

from ..data import PULL_TIME
from ..metrics import STALE_HOURS, week_ends
from .counterfactual import ASSUMPTIONS, becomes, counterfactual_hours, handoffs_avoided


class _Backlog:
    """Expected open-ticket counts when a share of avoidable returns is prevented."""

    def __init__(self, df: pd.DataFrame, what_if_hours: pd.Series, rate: float):
        self.df = df
        affected = df["bounced"] & (what_if_hours < df["age_hours"])
        closes = df["created_at"] + pd.to_timedelta(what_if_hours, unit="h")
        # A ticket whose what-if equals its actual age keeps its actual end.
        self.what_if_close = closes.where(affected, df["final_closed_at"])
        self.weight = affected.astype(float) * rate

    def open_at(self, when: pd.Timestamp, min_age: float = 0.0) -> tuple[int, float]:
        """(actual, expected under the what-if) open tickets at `when`."""
        df = self.df
        age = (when - df["created_at"]).dt.total_seconds() / 3600
        started = (df["created_at"] < when) & (age >= min_age)
        actual = started & (df["final_closed_at"].isna() | (df["final_closed_at"] >= when))
        what_if = started & (self.what_if_close.isna() | (self.what_if_close >= when))
        blended = (1 - self.weight) * actual + self.weight * what_if
        return int(actual.sum()), round(float(blended.sum()), 1)


def _week_rows(df: pd.DataFrame, backlog: _Backlog) -> list[dict]:
    rows = []
    for end in week_ends(df):
        actual, expected = backlog.open_at(end)
        actual_old, expected_old = backlog.open_at(end, STALE_HOURS)
        rows.append(
            {
                "week_end": end.strftime("%Y-%m-%d"),
                "open_actual": actual,
                "open_scenario": expected,
                "open_over_48h_actual": actual_old,
                "open_over_48h_scenario": expected_old,
            }
        )
    return rows


def _reason_rows(df: pd.DataFrame, saved_hours: pd.Series, rate: float) -> list[dict]:
    rows = [
        {
            "reason": reason,
            "tickets": int(len(group)),
            "becomes": becomes(reason),
            "hours_saved": round(float(saved_hours[group.index].sum() * rate)),
            "eng_handoffs_avoided": round(handoffs_avoided(group, reason) * rate, 1),
        }
        for reason, group in df[df["bounced"]].groupby("eng_outcome")
    ]
    return sorted(rows, key=lambda row: -row["hours_saved"])


def scenario(df: pd.DataFrame, prevention_rate: float = 0.5) -> dict:
    rate = min(max(prevention_rate, 0.0), 1.0)
    what_if_hours = counterfactual_hours(df)
    saved_hours = df["age_hours"] - what_if_hours
    backlog = _Backlog(df, what_if_hours, rate)
    by_reason = _reason_rows(df, saved_hours, rate)
    total_saved = float((saved_hours * backlog.weight).sum())
    open_actual, open_expected = backlog.open_at(PULL_TIME)
    old_actual, old_expected = backlog.open_at(PULL_TIME, STALE_HOURS)
    return {
        "prevention_rate": rate,
        "hours_saved": round(total_saved),
        "share_of_all_ticket_hours": round(total_saved / float(df["age_hours"].sum()), 3),
        "eng_handoffs_avoided": round(sum(row["eng_handoffs_avoided"] for row in by_reason), 1),
        "open_now_actual": open_actual,
        "open_now_scenario": open_expected,
        "open_over_48h_now_actual": old_actual,
        "open_over_48h_now_scenario": old_expected,
        "by_reason": by_reason,
        "weeks": _week_rows(df, backlog),
        "assumptions": ASSUMPTIONS,
    }
