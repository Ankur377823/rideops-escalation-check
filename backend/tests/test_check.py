import pandas as pd

from app import check, checklists, reasons
from app.data import prepare


def test_history_excludes_the_ticket_itself(df):
    ticket = df[df["escalated"]].iloc[0]
    h = check.history_for(df, ticket)
    assert h["total"] == int((df["issue_type"] == ticket["issue_type"]).sum()) - 1
    assert h["resolved_at_l1"] + h["escalated"] == h["total"]
    assert h["fixed_by_eng"] + h["bounced"] <= h["escalated"]
    assert sum(r["count"] for r in h["return_reasons"]) == h["bounced"]


def test_advice_says_so_when_history_is_thin():
    df = prepare(
        pd.DataFrame(
            [
                {
                    "ticket_id": "SUP-1",
                    "created_at": "2026-07-02 01:00",
                    "channel": "Email",
                    "client_id": "C1",
                    "client_name": "X",
                    "client_tier": "SMB",
                    "category": "OTP / boarding issue",
                    "priority": "P3",
                    "description": "Something new",
                    "assigned_agent": "A",
                    "first_response_at": "2026-07-02 02:00",
                    "escalated_to_eng": "No",
                    "eng_ticket_id": None,
                    "eng_handoffs": 0,
                    "eng_outcome": None,
                    "status": "Closed",
                    "first_closed_at": "2026-07-02 03:00",
                    "final_closed_at": "2026-07-02 03:00",
                    "reopen_count": 0,
                    "csat_score": None,
                }
            ]
        )
    )
    result = check.build_check(df, "SUP-1", [])
    assert result["history"]["enough_history"] is False
    assert "not enough history" in result["advice"][0]["text"]


def test_build_check_unknown_ticket(df):
    assert check.build_check(df, "SUP-00000", []) is None


def test_checklist_puts_top_return_reason_first(df):
    ticket = df[df["issue_type"] == "Scheduled report email not received"].iloc[0]
    h = check.history_for(df, ticket)
    items = check.ordered_checklist(ticket["category"], h)
    assert h["return_reasons"][0]["reason"] == reasons.DUP
    assert items[0]["prevents"] == reasons.DUP
    assert {i["id"] for i in items} == {i["id"] for i in checklists.checklist_for(ticket["category"])}
