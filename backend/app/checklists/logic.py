"""Build the checklist for a category and find what is still missing."""

from .categories import BY_CATEGORY
from .common import COMMON


def checklist_for(category: str) -> list[dict]:
    return BY_CATEGORY.get(category, []) + COMMON


def is_answered(item: dict, value) -> bool:
    """Text items need non-blank text; confirm items need a ticked box."""
    if item["kind"] == "text":
        return isinstance(value, str) and bool(value.strip())
    return value is True


def missing_items(category: str, answers: dict) -> list[str]:
    """Ids of checklist items not yet satisfied."""
    return [item["id"] for item in checklist_for(category) if not is_answered(item, answers.get(item["id"]))]
