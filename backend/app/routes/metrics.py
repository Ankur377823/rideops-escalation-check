"""Numbers for the lead dashboard."""

from fastapi import APIRouter

from .. import metrics
from ..data import get_tickets

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/summary")
def summary():
    df = get_tickets()
    return {"summary": metrics.summary(df), "by_handoffs": metrics.by_handoffs(df)}


@router.get("/weekly")
def weekly():
    return metrics.weekly(get_tickets())


@router.get("/agents")
def agents():
    return metrics.by_agent(get_tickets())


@router.get("/attention")
def attention():
    return metrics.attention_queue(get_tickets())
