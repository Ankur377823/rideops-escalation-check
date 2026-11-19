"""Plain-language notes for the agent. Each one quotes its own numbers.

The history is context, not a prediction. Notebook 3 shows that an issue type's past does not tell us
which escalation will come back, so a note becomes a warning only when the issue is clearly worse than
the team as a whole.
"""

L1_FIRST_SHARE = 0.7  # at or above this, L1 usually resolves the issue itself
CLEARLY_ABOVE_TEAM = 0.15  # warn only when the return rate is this far above the team's
MIN_ESCALATIONS = 8  # and only when at least this many past escalations back it up


def _note(level: str, text: str) -> dict:
    return {"level": level, "text": text}


def _returns_note(h: dict, team_bounce_rate: float | None) -> dict:
    text = f"{h['bounced']} of {h['escalated']} past escalations like this came back without an engineering fix"
    if team_bounce_rate is None:
        return _note("info", text + ".")
    clearly_worse = (
        h["escalated"] >= MIN_ESCALATIONS and (h["bounce_rate"] or 0) >= team_bounce_rate + CLEARLY_ABOVE_TEAM
    )
    text += f" (team average: {round(team_bounce_rate * 100)}%)."
    return _note("warn" if clearly_worse else "info", text)


def advice_for(history: dict, team_bounce_rate: float | None = None) -> list[dict]:
    h = history
    if not h["enough_history"]:
        return [
            _note("info", f"Only {h['total']} past tickets like this, so there is not enough history to guide you.")
        ]
    out = []
    if h["escalated"]:
        out.append(_returns_note(h, team_bounce_rate))
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
