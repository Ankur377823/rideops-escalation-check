"""Count open tickets at a point in time."""

import pandas as pd

from ..data import PULL_TIME

STALE_HOURS = 48  # "open too long" threshold used for the headline measure


def open_at(df: pd.DataFrame, when: pd.Timestamp, min_age_hours: float = 0) -> int:
    """Tickets that were open at `when` (created before it, not finally closed yet)."""
    is_open = (df["created_at"] < when) & (df["final_closed_at"].isna() | (df["final_closed_at"] >= when))
    old_enough = (when - df["created_at"]).dt.total_seconds() / 3600 >= min_age_hours
    return int((is_open & old_enough).sum())


def week_ends(df: pd.DataFrame) -> list[pd.Timestamp]:
    """Monday 00:00 boundaries covering the data, ending with the pull time."""
    first = df["created_at"].min().normalize()
    start = first + pd.Timedelta(days=(7 - first.weekday()) % 7 or 7)
    ends = list(pd.date_range(start, PULL_TIME, freq="7D"))
    if not ends or ends[-1] < PULL_TIME.normalize():
        ends.append(PULL_TIME)
    return ends
