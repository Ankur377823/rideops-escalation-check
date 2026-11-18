"""Plain-language prompts for the agent. Each one quotes its own numbers."""

L1_FIRST_SHARE = 0.7  # at or above this, L1 usually resolves the issue itself
HIGH_BOUNCE = 0.5


def _note(level: str, text: str) -> dict:
    return {"level": level, "text": text}


def advice_for(history: dict) -> list[dict]:
    h = history
    if not h["enough_history"]:
        return [
            _note("info", f"Only {h['total']} past tickets like this, so there is not enough history to guide you.")
        ]
    out = []
    if h["escalated"]:
        level = "warn" if (h["bounce_rate"] or 0) >= HIGH_BOUNCE else "info"
        text = f"{h['bounced']} of {h['escalated']} past escalations like this came back without an engineering fix."
        out.append(_note(level, text))
    if h["return_reasons"]:
        top = h["return_reasons"][0]
        out.append(_note("info", f"Most common reason for return: {top['reason']} ({top['count']} times)."))
    if (h["l1_share"] or 0) >= L1_FIRST_SHARE:
        text = (
            f"L1 resolved {h['resolved_at_l1']} of {h['total']} tickets like this without engineering. "
            "Try the L1 route first."
        )
        out.append(_note("warn", text))
    if h["median_hours_l1"] and h["median_hours_bounced"]:
        text = (
            f"Typical time to close: {h['median_hours_l1']}h at L1, "
            f"{h['median_hours_bounced']}h when an escalation bounces."
        )
        out.append(_note("info", text))
    return out
