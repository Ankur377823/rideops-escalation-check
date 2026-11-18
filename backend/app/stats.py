"""Small rounding helpers shared by the metric and check modules."""

import pandas as pd


def median(series: pd.Series, digits: int = 1) -> float | None:
    series = series.dropna()
    return round(float(series.median()), digits) if len(series) else None


def mean(series: pd.Series, digits: int = 2) -> float | None:
    series = series.dropna()
    return round(float(series.mean()), digits) if len(series) else None


def rate(mask: pd.Series, digits: int = 3) -> float | None:
    """Share of True values in a yes/no column."""
    return round(float(mask.mean()), digits) if len(mask) else None


def share(part: int, whole: int, digits: int = 3) -> float | None:
    return round(part / whole, digits) if whole else None
