"""Record what the agent decided, and read the decision log."""

from fastapi import APIRouter, HTTPException

from .. import checklists, store
from ..schemas import Decision
from .deps import ticket_json

router = APIRouter(tags=["decisions"])


@router.post("/tickets/{ticket_id}/decision")
def record_decision(ticket_id: str, body: Decision):
    ticket = ticket_json(ticket_id)
    mode = store.get_mode()
    escalating = body.action == "escalated"
    missing = checklists.missing_items(ticket["category"], body.answers) if escalating else []
    if missing and mode == "enforce":
        detail = {"message": "Checklist incomplete. Escalation blocked in enforce mode.", "missing_items": missing}
        raise HTTPException(409, detail)
    return store.log_decision(ticket_id, ticket["assigned_agent"], mode, body.action, missing, body.answers, body.note)


@router.get("/decisions")
def decisions():
    everything = store.list_decisions(limit=-1)  # SQLite: a negative limit means no limit
    return {"items": everything[:200], "summary": store.summarise_decisions(everything)}
