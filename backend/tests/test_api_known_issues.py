ESCALATED_OPEN = "SUP-10004"  # Live tracking ticket, escalated


def test_known_issues_seeded_once_and_shown_in_check(client):
    issues = client.get("/known-issues").json()
    assert len(issues) >= 4
    assert all(i["source"].startswith("Seeded from data") for i in issues)
    report = client.get("/tickets", params={"category": "Report export failing", "limit": 1}).json()["items"][0]
    shown = client.get(f"/tickets/{report['ticket_id']}/check").json()["known_issues"]
    assert shown and all(i["category"] == "Report export failing" for i in shown)


def test_known_issue_add_and_close(client):
    made = client.post(
        "/known-issues", json={"title": "GPS drift on Android 15", "category": "Live tracking / GPS incorrect"}
    )
    assert made.status_code == 201
    issue_id = made.json()["id"]
    assert client.patch(f"/known-issues/{issue_id}", json={"status": "Fixed"}).json()["status"] == "Fixed"
    shown = client.get(f"/tickets/{ESCALATED_OPEN}/check").json()["known_issues"]
    assert issue_id not in [i["id"] for i in shown]
    assert client.patch("/known-issues/99999", json={"status": "Fixed"}).status_code == 404
