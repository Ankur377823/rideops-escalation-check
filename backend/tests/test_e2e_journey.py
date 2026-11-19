"""End-to-end test: one L1 agent takes one ticket through the whole product.

It calls the API in the same order the screens do: ticket queue, escalation check,
handoff note, decision in both modes, decision log, known-issues board, and the
lead's dashboard and evidence pages.
"""

TICKET = "SUP-11438"  # open roster ticket; most past escalations of this issue came back


def test_agent_takes_a_ticket_from_queue_to_decision_log(client):
    # 1. Ticket queue: the agent finds the ticket among the open ones.
    queue = client.get("/tickets", params={"open_only": True, "q": TICKET}).json()
    assert queue["total"] == 1 and queue["items"][0]["ticket_id"] == TICKET

    # 2. Escalation check: history, known issues and a checklist come back together.
    check = client.get(f"/tickets/{TICKET}/check").json()
    history, checklist = check["history"], check["checklist"]
    assert check["mode"] == "monitor"
    assert history["bounced"] > history["fixed_by_eng"]  # this issue usually comes back
    assert "20 of 33 past escalations" in check["advice"][0]["text"]  # history is shown as context
    assert len(check["known_issues"]) > 0 and len(checklist) > 0

    # 3. The agent answers only the first item, then asks for the handoff note.
    first, missing = checklist[0], checklist[1:]
    partial = {first["id"]: "30 Sep, morning shift" if first["kind"] == "text" else True}
    note = client.post(f"/tickets/{TICKET}/handoff-note", json={"answers": partial}).json()
    assert note["source"] == "template" and note["note"].startswith(f"ESCALATION: {TICKET}")
    assert all(item["label"] in note["note"] for item in missing)  # gaps are stated

    # 4. Monitor mode: escalating with gaps is allowed, and the gaps are recorded.
    decision = client.post(f"/tickets/{TICKET}/decision", json={"action": "escalated", "answers": partial})
    assert decision.status_code == 200
    assert sorted(decision.json()["missing_items"]) == sorted(item["id"] for item in missing)

    # 5. The lead switches to enforce mode: the same escalation is now blocked.
    assert client.put("/settings/mode", json={"mode": "enforce"}).json() == {"mode": "enforce"}
    assert client.get(f"/tickets/{TICKET}/check").json()["mode"] == "enforce"
    blocked = client.post(f"/tickets/{TICKET}/decision", json={"action": "escalated", "answers": partial})
    assert blocked.status_code == 409

    # 6. The agent completes the checklist, and the escalation goes through.
    complete = {item["id"]: "filled in" if item["kind"] == "text" else True for item in checklist}
    allowed = client.post(f"/tickets/{TICKET}/decision", json={"action": "escalated", "answers": complete})
    assert allowed.status_code == 200 and allowed.json()["missing_items"] == []

    # 7. Decision log: both escalations are there, and only the first one had gaps.
    log = client.get("/decisions").json()
    assert [row["ticket_id"] for row in log["items"]] == [TICKET, TICKET]
    assert log["summary"]["checks"] == 2 and log["summary"]["escalated_with_gaps"] == 1

    # 8. Engineering marks a known issue as fixed, and it leaves the agent's check screen.
    issue = check["known_issues"][0]
    fixed = client.patch(f"/known-issues/{issue['id']}", json={"status": "Fixed"}).json()
    assert fixed["status"] == "Fixed"
    still_shown = client.get(f"/tickets/{TICKET}/check").json()["known_issues"]
    assert issue["id"] not in [known["id"] for known in still_shown]

    # 9. The lead's dashboard and the evidence page still load with the headline numbers.
    summary = client.get("/metrics/summary").json()["summary"]
    assert summary["open_over_48h_now"] == 25 and summary["bounced"] == 275
    scenario = client.get("/evidence/scenario", params={"prevention_rate": 0.5}).json()
    assert scenario["open_over_48h_now_scenario"] < scenario["open_over_48h_now_actual"]
