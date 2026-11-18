"""Turn ticket rows into JSON-safe dictionaries."""

import pandas as pd

LIST_COLS = [
    "ticket_id",
    "created_at",
    "channel",
    "client_name",
    "client_tier",
    "category",
    "priority",
    "description",
    "assigned_agent",
    "escalated_to_eng",
    "eng_handoffs",
    "eng_outcome",
    "status",
    "reopen_count",
    "age_hours",
]
DETAIL_COLS = [
    *LIST_COLS,
    "client_id",
    "first_response_at",
    "eng_ticket_id",
    "first_closed_at",
    "final_closed_at",
    "csat_score",
    "issue_type",
]


def records(df: pd.DataFrame, cols: list[str]) -> list[dict]:
    """Dates become text and missing values become null."""
    out = df[cols].copy()
    for col in out.columns:
        if pd.api.types.is_datetime64_any_dtype(out[col]):
            out[col] = out[col].dt.strftime("%Y-%m-%d %H:%M")
    out["age_hours"] = out["age_hours"].round(1)
    return out.astype(object).where(out.notna(), None).to_dict("records")
