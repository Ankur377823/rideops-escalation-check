"""Starting content for the known-issues board."""

import pandas as pd

from ..reasons import DUP
from .known_issues import add_known_issue, count_known_issues

MIN_DUPLICATES = 4


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
            workaround="Not added yet.",
            source=f"Seeded from data: returned as duplicate {times} times",
        )
