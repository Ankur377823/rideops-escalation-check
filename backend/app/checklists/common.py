"""Items asked on every escalation, whatever the category."""

from ..reasons import DUP, HOWTO, REPRO
from .item import confirm, text

COMMON = [
    confirm("known_issue", DUP, "I checked the known-issues board and this is not already listed"),
    confirm("howto", HOWTO, "This is not a how-to question (the feature is behaving wrongly, not just unclear)"),
    text("repro_steps", REPRO, "Steps to reproduce, or the exact time it happened"),
]
