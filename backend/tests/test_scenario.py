import pytest

from app import evidence, reasons


def test_scenario_zero_prevention_equals_actual(df):
    s = evidence.scenario(df, 0.0)
    assert s["hours_saved"] == 0
    assert s["open_now_scenario"] == s["open_now_actual"] == 48
    assert all(w["open_scenario"] == w["open_actual"] for w in s["weeks"])


def test_scenario_never_makes_things_worse_and_scales(df):
    half, full = evidence.scenario(df, 0.5), evidence.scenario(df, 1.0)
    assert 0 < half["hours_saved"] < full["hours_saved"]
    assert full["hours_saved"] == pytest.approx(2 * half["hours_saved"], abs=2)
    assert all(w["open_scenario"] <= w["open_actual"] for w in full["weeks"])
    assert (evidence.counterfactual_hours(df) <= df["age_hours"] + 1e-9).all()


def test_scenario_leaves_fixed_and_l1_tickets_alone(df):
    cf = evidence.counterfactual_hours(df)
    untouched = ~df["bounced"]
    assert (cf[untouched] == df.loc[untouched, "age_hours"]).all()
    dups = df["eng_outcome"] == reasons.DUP
    assert (cf[dups] == df.loc[dups, "age_hours"]).all()


def test_scenario_clamps_rate(df):
    assert evidence.scenario(df, 5)["prevention_rate"] == 1.0
    assert evidence.scenario(df, -1)["prevention_rate"] == 0.0
