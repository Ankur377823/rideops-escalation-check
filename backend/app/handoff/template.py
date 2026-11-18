"""The plain handoff note, built from the ticket and the checklist answers."""

from .. import checklists


def _sort_answers(category: str, answers: dict) -> tuple[list[str], list[str], list[str]]:
    """Split the checklist into details typed, checks confirmed, and gaps."""
    details, checks, gaps = [], [], []
    for item in checklists.checklist_for(category):
        value = answers.get(item["id"])
        if isinstance(value, str) and value.strip():
            details.append(f"- {item['label']}: {value.strip()}")
        elif value is True:
            checks.append(f"- {item['label']}")
        else:
            gaps.append(f"- {item['label']}")
    return details, checks, gaps


def template_note(ticket: dict, answers: dict, history: dict) -> str:
    details, checks, gaps = _sort_answers(ticket["category"], answers)
    lines = [
        f"ESCALATION: {ticket['ticket_id']} | {ticket['priority']} | {ticket['category']}",
        f"Client: {ticket['client_name']} ({ticket['client_tier']})",
        f"Raised: {ticket['created_at']} via {ticket['channel']} | L1 owner: {ticket['assigned_agent']}",
        "",
        f"Problem: {ticket['description']}",
        "",
        "Details collected:",
        *(details or ["- none"]),
        "",
        "Already checked by L1:",
        *(checks or ["- none"]),
    ]
    if gaps:
        lines += ["", "NOT provided / not checked:", *gaps]
    if history.get("escalated"):
        fixed, total = history["fixed_by_eng"], history["escalated"]
        lines += ["", f"History: {fixed} of {total} past escalations of this issue type were fixed by engineering."]
    return "\n".join(lines)
