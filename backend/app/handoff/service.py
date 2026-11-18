"""Choose between the template and the LLM note, with caching and fallback."""

import hashlib
import json

from .. import config, store
from . import llm
from .template import template_note


def _cache_key(ticket_id: str, answers: dict) -> str:
    blob = json.dumps({"t": ticket_id, "a": answers}, sort_keys=True)
    return hashlib.sha256(blob.encode()).hexdigest()


def build_note(ticket: dict, answers: dict, history: dict, use_llm: bool = True) -> dict:
    base = template_note(ticket, answers, history)
    if not (use_llm and config.llm_enabled()):
        return {"note": base, "source": "template"}
    key = _cache_key(ticket["ticket_id"], answers)
    cached = store.get_cached_note(key)
    if cached:
        return cached
    try:
        note = llm.rewrite(base)
    except Exception as exc:  # any LLM problem must not break the agent's flow
        return {"note": base, "source": "template", "llm_error": type(exc).__name__}
    store.cache_note(key, note, "llm")
    return {"note": note, "source": "llm"}
