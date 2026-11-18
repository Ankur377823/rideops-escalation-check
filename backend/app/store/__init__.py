"""Small SQLite store for things the tool itself creates: the decision log,
the known-issues board, the monitor/enforce setting and cached handoff notes."""

from .db import init_db
from .decisions import list_decisions, log_decision, summarise_decisions
from .known_issues import add_known_issue, count_known_issues, list_known_issues, set_known_issue_status
from .notes import cache_note, get_cached_note
from .seed import seed_known_issues
from .settings import get_mode, set_mode

__all__ = [
    "add_known_issue",
    "cache_note",
    "count_known_issues",
    "get_cached_note",
    "get_mode",
    "init_db",
    "list_decisions",
    "list_known_issues",
    "log_decision",
    "seed_known_issues",
    "set_known_issue_status",
    "set_mode",
    "summarise_decisions",
]
