ESCALATED_OPEN = "SUP-10004"  # Live tracking ticket, escalated


def test_check_payload(client):
    r = client.get(f"/tickets/{ESCALATED_OPEN}/check").json()
    assert r["mode"] == "monitor"
    assert r["ticket"]["ticket_id"] == ESCALATED_OPEN
    assert r["history"]["total"] > 0 and r["checklist"] and r["advice"]
    assert r["agent"]["team_bounce_rate"] == round(275 / 486, 3)


def test_handoff_note_without_key_uses_template(client):
    r = client.post(f"/tickets/{ESCALATED_OPEN}/handoff-note", json={"answers": {"trip_id": "T-88 / KA01"}}).json()
    assert r["source"] == "template"
    assert "T-88 / KA01" in r["note"] and ESCALATED_OPEN in r["note"]
