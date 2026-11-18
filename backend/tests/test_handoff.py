from app import handoff, store

TICKET = {
    "ticket_id": "SUP-1",
    "priority": "P2",
    "category": "OTP / boarding issue",
    "client_name": "Acme",
    "client_tier": "SMB",
    "created_at": "2026-07-02 01:00",
    "channel": "Email",
    "assigned_agent": "A",
    "description": "OTP shown as invalid on driver app",
}


def test_template_note_separates_given_from_missing():
    note = handoff.template_note(
        TICKET, {"trip_emp": "T-9 / E-4", "otp_mode": True}, {"escalated": 10, "fixed_by_eng": 4}
    )
    assert "SUP-1 | P2" in note
    assert "Trip ID and employee ID: T-9 / E-4" in note
    given, missing = note.split("NOT provided / not checked:")
    assert "Client OTP mode" in given and "Steps to reproduce" in missing
    assert "4 of 10 past escalations" in note


def test_note_falls_back_to_template_when_llm_fails(monkeypatch, tmp_path):

    monkeypatch.setenv("ESCALATION_CHECK_DB", str(tmp_path / "n.db"))
    monkeypatch.setenv("GEMINI_API_KEY", "test-key")
    store.init_db()

    def boom(_):
        raise TimeoutError("rate limited")

    monkeypatch.setattr("app.handoff.llm.rewrite", boom)
    result = handoff.build_note(TICKET, {}, {"escalated": 0})
    assert result["source"] == "template" and result["llm_error"] == "TimeoutError"
    assert "SUP-1" in result["note"]


def test_llm_note_is_cached(monkeypatch, tmp_path):

    monkeypatch.setenv("ESCALATION_CHECK_DB", str(tmp_path / "c.db"))
    monkeypatch.setenv("GEMINI_API_KEY", "test-key")
    store.init_db()
    calls = []
    monkeypatch.setattr("app.handoff.llm.rewrite", lambda base: calls.append(1) or "LLM NOTE")
    first = handoff.build_note(TICKET, {"trip_emp": "a"}, {"escalated": 0})
    second = handoff.build_note(TICKET, {"trip_emp": "a"}, {"escalated": 0})
    assert first == second == {"note": "LLM NOTE", "source": "llm"}
    assert len(calls) == 1
