"""The reasons engineering gives when it returns an escalation without a fix."""

INFO = "Insufficient info - returned to L1"
CONFIG = "Config issue - returned to L1"
DUP = "Duplicate of known issue"
HOWTO = "Not a bug - how-to"
REPRO = "Not reproducible"

BOUNCE_OUTCOMES = [INFO, CONFIG, DUP, HOWTO, REPRO]
