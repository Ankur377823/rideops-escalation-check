from app import evidence


def test_predictor_test_uses_a_clean_time_split(df):
    r = evidence.predictor_test(df)
    assert r["train_escalations"] + r["test_escalations"] == 486
    assert r["test_escalations"] == int((df["escalated"] & (df["created_at"] >= evidence.SPLIT)).sum())
    for rule in r["rules"]:
        assert rule["flagged"] <= r["test_escalations"]
