"""All API routes, collected into one router."""

from fastapi import APIRouter

from . import check, decisions, evidence, health, known_issues, metrics, settings, tickets

router = APIRouter()
for module in (health, tickets, check, decisions, settings, known_issues, metrics, evidence):
    router.include_router(module.router)
