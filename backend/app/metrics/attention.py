"""Open tickets the support lead should look at first."""

import pandas as pd

from .backlog import STALE_HOURS


def attention_queue(df: pd.DataFrame, limit: int = 50) -> list[dict]:
    """Open tickets the support lead should look at first: bounced back and
    forth, or simply old."""
    needs_look = df["is_open"] & ((df["eng_handoffs"] >= 2) | (df["age_hours"] >= STALE_HOURS))
    queue = df[needs_look].sort_values(["eng_handoffs", "age_hours"], ascending=False).head(limit)
    return [
        {
            "ticket_id": row.ticket_id,
            "client_name": row.client_name,
            "category": row.category,
            "priority": row.priority,
            "assigned_agent": row.assigned_agent,
            "status": row.status,
            "eng_handoffs": int(row.eng_handoffs),
            "age_hours": round(float(row.age_hours), 1),
        }
        for row in queue.itertuples()
    ]
