"""How one agent compares with the team."""

import pandas as pd

from ..stats import rate


def agent_context(df: pd.DataFrame, agent: str) -> dict:
    """How this agent's escalations compare with the team's."""
    mine = df[df["assigned_agent"] == agent]
    return {
        "agent": agent,
        "tickets": int(len(mine)),
        "escalation_rate": rate(mine["escalated"]),
        "bounce_rate": rate(mine[mine["escalated"]]["bounced"]),
        "team_escalation_rate": rate(df["escalated"]),
        "team_bounce_rate": rate(df[df["escalated"]]["bounced"]),
    }
