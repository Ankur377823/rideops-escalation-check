"""Put the full check together for one ticket."""

import pandas as pd

from .. import checklists
from .advice import advice_for
from .agent import agent_context
from .examples import l1_examples
from .history import history_for


def ordered_checklist(category: str, history: dict) -> list[dict]:
    """Checklist items, with the ones that guard against this issue type's most
    common return reasons first."""
    rank = {reason["reason"]: position for position, reason in enumerate(history["return_reasons"])}
    last = len(rank)
    return sorted(checklists.checklist_for(category), key=lambda item: rank.get(item["prevents"], last))


def build_check(df: pd.DataFrame, ticket_id: str, known_issues: list[dict]) -> dict | None:
    match = df[df["ticket_id"] == ticket_id]
    if match.empty:
        return None
    ticket = match.iloc[0]
    history = history_for(df, ticket)
    return {
        "ticket_id": ticket_id,
        "history": history,
        "advice": advice_for(history),
        "agent": agent_context(df, ticket["assigned_agent"]),
        "checklist": ordered_checklist(ticket["category"], history),
        "known_issues": known_issues,
        "l1_examples": l1_examples(df, ticket),
    }
