from app.data import issue_type


def test_issue_type_collapses_numbers():
    assert issue_type("Roster shows duplicate entries for 16 employees") == issue_type(
        "Roster shows duplicate entries for 34 employees"
    )
    assert issue_type("Cab arrived 25 mins late for 6 PM shift") == "Cab arrived N mins late for N PM shift"


def test_bounced_only_counts_escalated_unfixed(df):
    assert not df[~df["escalated"]]["bounced"].any()
    assert not df[df["eng_outcome"] == "Fixed"]["bounced"].any()
