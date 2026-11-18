"""What happened to past tickets of the same issue type."""

import pandas as pd

from ..stats import median, share

MIN_SAMPLE = 5  # below this many past tickets, say "not enough history"


def peers_of(df: pd.DataFrame, ticket: pd.Series) -> pd.DataFrame:
    """Other tickets with the same issue type."""
    return df[(df["issue_type"] == ticket["issue_type"]) & (df["ticket_id"] != ticket["ticket_id"])]


def history_for(df: pd.DataFrame, ticket: pd.Series) -> dict:
    """Outcomes of other tickets with the same issue type."""
    peers = peers_of(df, ticket)
    escalated, at_l1 = peers[peers["escalated"]], peers[~peers["escalated"]]
    fixed, bounced = escalated[escalated["eng_outcome"] == "Fixed"], escalated[escalated["bounced"]]
    reasons = bounced["eng_outcome"].value_counts()
    return {
        "issue_type": ticket["issue_type"],
        "total": int(len(peers)),
        "enough_history": bool(len(peers) >= MIN_SAMPLE),
        "resolved_at_l1": int(len(at_l1)),
        "escalated": int(len(escalated)),
        "fixed_by_eng": int(len(fixed)),
        "bounced": int(len(bounced)),
        "l1_share": share(len(at_l1), len(peers)),
        "bounce_rate": share(len(bounced), len(escalated)),
        "return_reasons": [{"reason": reason, "count": int(count)} for reason, count in reasons.items()],
        "median_hours_l1": median(at_l1["resolution_hours"]),
        "median_hours_fixed": median(fixed["resolution_hours"]),
        "median_hours_bounced": median(bounced["resolution_hours"]),
    }
