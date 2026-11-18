"""The escalation check: what an L1 agent sees before sending a ticket to
engineering.

Design note (see app/evidence): issue type does not predict which escalations
bounce any better than the base rate. So nothing here scores a ticket as risky
or safe. It shows what happened to tickets like this one and runs the same
reason-based checklist on every escalation.
"""

from .advice import advice_for
from .agent import agent_context
from .builder import build_check, ordered_checklist
from .examples import l1_examples
from .history import history_for

__all__ = ["advice_for", "agent_context", "build_check", "history_for", "l1_examples", "ordered_checklist"]
