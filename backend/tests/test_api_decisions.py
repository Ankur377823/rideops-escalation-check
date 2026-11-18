from app import checklists

ESCALATED_OPEN = "SUP-10004"  # Live tracking ticket, escalated


def full_answers(category):
    return {i["id"]: ("filled in" if i["kind"] == "text" else True) for i in checklists.checklist_for(category)}


def test_monitor_mode_logs_gaps_but_allows(client):
    r = client.post(f"/tickets/{ESCALATED_OPEN}/decision", json={"action": "escalated", "answers": {}})
    assert r.status_code == 200
    assert r.json()["mode"] == "monitor" and len(r.json()["missing_items"]) > 0
    s = client.get("/decisions").json()["summary"]
    assert s == {"checks": 1, "escalated": 1, "escalated_with_gaps": 1, "kept_at_l1": 0, "linked_known_issue": 0}


def test_enforce_mode_blocks_incomplete_escalation(client):
    assert client.put("/settings/mode", json={"mode": "enforce"}).json() == {"mode": "enforce"}
    r = client.post(f"/tickets/{ESCALATED_OPEN}/decision", json={"action": "escalated", "answers": {"trip_id": "T1"}})
    assert r.status_code == 409
    assert "trip_id" not in r.json()["detail"]["missing_items"]
    assert client.get("/decisions").json()["summary"]["checks"] == 0

    ok = client.post(
        f"/tickets/{ESCALATED_OPEN}/decision",
        json={"action": "escalated", "answers": full_answers("Live tracking / GPS incorrect")},
    )
    assert ok.status_code == 200 and ok.json()["missing_items"] == []


def test_enforce_mode_never_blocks_keeping_it_at_l1(client):
    client.put("/settings/mode", json={"mode": "enforce"})
    r = client.post(f"/tickets/{ESCALATED_OPEN}/decision", json={"action": "resolved_at_l1", "answers": {}})
    assert r.status_code == 200 and r.json()["missing_items"] == []


def test_bad_inputs_rejected(client):
    assert client.put("/settings/mode", json={"mode": "off"}).status_code == 422
    assert client.post(f"/tickets/{ESCALATED_OPEN}/decision", json={"action": "deleted"}).status_code == 422
    assert client.get("/evidence/scenario", params={"prevention_rate": 2}).status_code == 422
