def test_metrics_and_evidence_endpoints(client):
    assert client.get("/metrics/summary").json()["summary"]["bounced"] == 275
    # 13 Monday boundaries plus the partial last week up to the data pull.
    assert len(client.get("/metrics/weekly").json()) == 14
    assert len(client.get("/metrics/agents").json()) == 8
    attention = client.get("/metrics/attention").json()
    assert attention and all(t["eng_handoffs"] >= 2 or t["age_hours"] >= 48 for t in attention)
    assert len(client.get("/evidence/predictors").json()["rules"]) == 4
    assert client.get("/evidence/scenario", params={"prevention_rate": 0.5}).json()["hours_saved"] > 0
