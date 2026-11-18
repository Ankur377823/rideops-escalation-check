"""Past tickets of the same type that L1 solved alone."""

import pandas as pd

from .history import peers_of


def l1_examples(df: pd.DataFrame, ticket: pd.Series, limit: int = 5) -> list[dict]:
    """Recent tickets of the same type that L1 closed without engineering and
    the client did not reopen. Useful as 'ask this colleague how they did it'."""
    peers = peers_of(df, ticket)
    solved = peers[~peers["escalated"] & ~peers["is_open"] & ~peers["reopened"]]
    recent = solved.sort_values("created_at", ascending=False).head(limit)
    return [
        {
            "ticket_id": row.ticket_id,
            "agent": row.assigned_agent,
            "client": row.client_name,
            "hours": round(float(row.resolution_hours), 1),
        }
        for row in recent.itertuples()
    ]
