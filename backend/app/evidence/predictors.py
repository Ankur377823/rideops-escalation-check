"""Rules are learned on tickets raised before 1 Sep and scored on September
tickets, so nothing is tested on data it was built from."""

import pandas as pd

from ..reasons import DUP

SPLIT = pd.Timestamp("2026-09-01")
MIN_TRAIN = 3  # a group needs this many past escalations to be judged
THRESHOLD = 0.6  # flag when this share of the group came back before
RECENT_DAYS = 7
RULES = [
    ("Same issue type", ["issue_type"]),
    ("Same category", ["category"]),
    ("Same agent", ["assigned_agent"]),
    ("Same issue type and agent", ["issue_type", "assigned_agent"]),
]


def _score(flagged: pd.Series, actual: pd.Series) -> dict:
    hits, n_flagged, n_actual = int((flagged & actual).sum()), int(flagged.sum()), int(actual.sum())
    return {
        "flagged": n_flagged,
        "precision": round(hits / n_flagged, 3) if n_flagged else None,
        "recall": round(hits / n_actual, 3) if n_actual else None,
    }


def _flag_by_history(train: pd.DataFrame, test: pd.DataFrame, cols: list[str]) -> pd.Series:
    """True for test tickets whose group bounced often in the training period."""
    stats = train.groupby(cols)["bounced"].agg(["mean", "count"]).reset_index()
    risky = stats[(stats["count"] >= MIN_TRAIN) & (stats["mean"] >= THRESHOLD)][cols]
    flagged = test.merge(risky.assign(_flag=True), on=cols, how="left")["_flag"].eq(True)
    flagged.index = test.index
    return flagged


def _seen_recently(escalated: pd.DataFrame, test: pd.DataFrame) -> pd.Series:
    """True when the same issue type was escalated in the previous few days."""
    window = pd.Timedelta(days=RECENT_DAYS)

    def seen(row) -> bool:
        same = escalated["issue_type"] == row.issue_type
        earlier = (escalated["created_at"] < row.created_at) & (escalated["created_at"] >= row.created_at - window)
        return bool((same & earlier).any())

    return pd.Series([seen(row) for row in test.itertuples()], index=test.index)


def predictor_test(df: pd.DataFrame) -> dict:
    escalated = df[df["escalated"]]
    train, test = escalated[escalated["created_at"] < SPLIT], escalated[escalated["created_at"] >= SPLIT]
    is_duplicate = test["eng_outcome"].eq(DUP)
    return {
        "train_escalations": int(len(train)),
        "test_escalations": int(len(test)),
        "base_bounce_rate": round(float(test["bounced"].mean()), 3),
        "threshold": THRESHOLD,
        "rules": [
            {"rule": name, **_score(_flag_by_history(train, test, cols), test["bounced"])} for name, cols in RULES
        ],
        "known_issue_rule": {
            "rule": f"Same issue escalated in last {RECENT_DAYS} days (predicting 'duplicate')",
            **_score(_seen_recently(escalated, test), is_duplicate),
            "base_rate": round(float(is_duplicate.mean()), 3),
        },
    }
