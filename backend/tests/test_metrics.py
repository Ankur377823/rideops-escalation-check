from app import metrics


def test_headline_numbers(df):
    s = metrics.summary(df)
    assert s["tickets"] == 1444
    assert s["escalated"] == 486
    assert s["bounced"] == 275
    assert s["open_now"] == 48
    assert s["multi_handoff"] == 229
    assert s["tickets_by_month"] == {"2026-07": 390, "2026-08": 462, "2026-09": 592}
    assert s["median_hours_l1"] == 12.6
    assert s["median_hours_escalated"] == 86.8
    assert df["issue_type"].nunique() == 48


def test_weekly_open_count_matches_status_at_pull(df):
    weeks = metrics.weekly(df)
    assert weeks[-1]["open_at_end"] == int(df["is_open"].sum())
    assert sum(w["created"] for w in weeks) == len(df)
    assert all(w["open_over_48h"] <= w["open_at_end"] for w in weeks)


def test_agent_table_shows_the_two_outliers(df):
    agents = {a["assigned_agent"]: a for a in metrics.by_agent(df)}
    assert agents["Rahul T"]["escalation_rate"] == max(a["escalation_rate"] for a in agents.values())
    assert agents["Karan B"]["reopen_rate"] == max(a["reopen_rate"] for a in agents.values())
    assert agents["Karan B"]["median_hours"] == min(a["median_hours"] for a in agents.values())
