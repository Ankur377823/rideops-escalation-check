def test_health_and_filters(client):
    assert client.get("/health").json() == {"ok": True, "tickets": 1444}
    f = client.get("/filters").json()
    assert len(f["category"]) == 10 and len(f["assigned_agent"]) == 8


def test_list_tickets_filters_and_pages(client):
    r = client.get("/tickets", params={"limit": 10}).json()
    assert r["total"] == 1444 and len(r["items"]) == 10
    r = client.get("/tickets", params={"open_only": True, "limit": 500}).json()
    assert r["total"] == 48 and all(t["status"] != "Closed" for t in r["items"])
    r = client.get("/tickets", params={"agent": "Rahul T", "category": "OTP / boarding issue"}).json()
    assert r["total"] > 0
    assert all(t["assigned_agent"] == "Rahul T" and t["category"] == "OTP / boarding issue" for t in r["items"])
    assert client.get("/tickets", params={"q": "sup-10004"}).json()["total"] == 1


def test_ticket_json_has_no_nan(client):
    t = client.get("/tickets/SUP-10001").json()
    assert t["eng_outcome"] == "" and t["csat_score"] is None
    assert t["created_at"] == "2026-07-02 01:27"


def test_unknown_ticket_is_404(client):
    assert client.get("/tickets/SUP-00000").status_code == 404
    assert client.get("/tickets/SUP-00000/check").status_code == 404
