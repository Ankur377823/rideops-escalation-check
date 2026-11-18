"""The escalation check for a ticket and its handoff note."""

from fastapi import APIRouter

from .. import check, handoff, store
from ..data import get_tickets
from ..schemas import Answers
from .deps import ticket_json, ticket_row

router = APIRouter(prefix="/tickets", tags=["check"])


@router.get("/{ticket_id}/check")
def ticket_check(ticket_id: str):
    ticket = ticket_json(ticket_id)
    known = store.list_known_issues(category=ticket["category"], only_open=True)
    result = check.build_check(get_tickets(), ticket_id, known)
    return {"ticket": ticket, "mode": store.get_mode(), **result}


@router.post("/{ticket_id}/handoff-note")
def handoff_note(ticket_id: str, body: Answers, use_llm: bool = True):
    history = check.history_for(get_tickets(), ticket_row(ticket_id))
    return handoff.build_note(ticket_json(ticket_id), body.answers, history, use_llm=use_llm)
