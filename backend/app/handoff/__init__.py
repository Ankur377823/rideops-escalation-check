"""Handoff note for engineering.

The plain template always works. If GEMINI_API_KEY is set, the note is
rewritten by an LLM through LiteLLM; any failure falls back to the template so
the app never breaks on it.
"""

from .service import build_note
from .template import template_note

__all__ = ["build_note", "template_note"]
