"""Optional LLM rewrite of the handoff note, through LiteLLM."""

from .. import config

SYSTEM_PROMPT = (
    "You rewrite support escalation notes for engineers. Be brief and factual. "
    "Use only the facts given; never invent IDs, causes or steps. Keep the first "
    "header line unchanged. Clearly list anything marked as not provided. "
    "Write plain text only: no Markdown, no asterisks, no bold."
)


def rewrite(base_note: str) -> str:
    """Ask the LLM to tidy the template note. Raises on any problem."""
    import litellm  # imported lazily: slow to import and optional

    response = litellm.completion(
        model=config.llm_model(),
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": base_note}],
        temperature=0.2,
        timeout=20,
    )
    text = (response.choices[0].message.content or "").strip()
    if not text:
        raise ValueError("empty LLM response")
    return text
