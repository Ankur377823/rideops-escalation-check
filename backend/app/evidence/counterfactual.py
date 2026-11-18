"""What a prevented return turns into.

Duplicates are left at their actual duration on purpose: the client still waits
for the underlying fix, so the gain there is engineering triage time, not
ticket hours.
"""

import pandas as pd

from ..reasons import CONFIG, DUP, HOWTO, INFO, REPRO

RESOLVE_AT_L1 = [CONFIG, HOWTO]
CLEAN_HANDOFF = [INFO, REPRO]

ASSUMPTIONS = [
    "Config and how-to returns would instead be resolved at L1 in the L1 median time for that category.",
    "Insufficient-info and not-reproducible returns would instead take the median time of a "
    "one-handoff engineering fix.",
    "Duplicate returns keep their actual duration; only engineering triage is saved.",
    "The prevention rate is an input you choose. The data cannot tell us what it will be; "
    "the pilot in week 1 is what measures it.",
]


def becomes(reason: str) -> str:
    if reason in RESOLVE_AT_L1:
        return "Resolved at L1"
    if reason == DUP:
        return "Linked to known issue (time unchanged)"
    return "One clean handoff"


def counterfactual_hours(df: pd.DataFrame) -> pd.Series:
    """Hours each ticket would have stayed open if its avoidable return had
    been prevented. Never longer than what actually happened."""
    l1_median = df[~df["escalated"]].groupby("category")["resolution_hours"].median()
    clean_fix = df[(df["eng_outcome"] == "Fixed") & (df["eng_handoffs"] == 1)]["resolution_hours"].median()
    hours = df["age_hours"].copy()
    at_l1 = df["eng_outcome"].isin(RESOLVE_AT_L1)
    hours[at_l1] = df.loc[at_l1, "category"].map(l1_median)
    hours[df["eng_outcome"].isin(CLEAN_HANDOFF)] = clean_fix
    return hours.clip(upper=df["age_hours"])


def handoffs_avoided(group: pd.DataFrame, reason: str) -> float:
    """Trips to engineering that would not happen for these tickets."""
    if reason in CLEAN_HANDOFF:
        return float((group["eng_handoffs"] - 1).clip(lower=0).sum())  # one clean trip instead
    return float(group["eng_handoffs"].sum())  # never reaches engineering
