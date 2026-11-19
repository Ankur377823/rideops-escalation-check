"""Starting content for the known-issues board."""

import pandas as pd

from ..reasons import DUP
from .known_issues import add_known_issue, count_known_issues

MIN_DUPLICATES = 4

# The data has no real workarounds, so three seeded issues carry a clearly labelled example.
EXAMPLE_WORKAROUNDS = {
    "Booking cutoff changed but roster still uses old cutoff": (
        "Example: re-save the shift in the client config, then run a manual roster re-sync."
    ),
    "Cancelled bookings still appearing in tomorrow's roster": (
        "Example: run a manual roster re-sync after the booking cutoff."
    ),
    "Exported report missing N trips": "Example: export two smaller date ranges until the fix ships.",
}


def seed_known_issues(df: pd.DataFrame) -> None:
    """First run only: start the board from issue types engineering already
    returned as 'duplicate of known issue' several times."""
    if count_known_issues():
        return
    duplicates = df[df["eng_outcome"] == DUP].groupby(["category", "issue_type"]).size()
    frequent = duplicates[duplicates >= MIN_DUPLICATES].sort_values(ascending=False)
    for (category, issue), times in frequent.items():
        add_known_issue(
            title=issue,
            category=category,
            issue_type=issue,
            workaround=EXAMPLE_WORKAROUNDS.get(issue, "Not added yet."),
            source=f"Seeded from data: returned as duplicate {times} times",
        )
