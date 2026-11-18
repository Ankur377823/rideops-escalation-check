"""Builders for checklist items. Every item names the return reason it prevents,
so the tool can show the agent why it is being asked."""


def text(item_id: str, prevents: str, label: str) -> dict:
    """An item the agent answers by typing."""
    return {"id": item_id, "prevents": prevents, "kind": "text", "label": label}


def confirm(item_id: str, prevents: str, label: str) -> dict:
    """An item the agent answers by ticking a box."""
    return {"id": item_id, "prevents": prevents, "kind": "confirm", "label": label}
