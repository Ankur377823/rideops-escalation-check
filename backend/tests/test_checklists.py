from app import checklists


def test_every_category_in_data_has_a_checklist(df):
    for category in df["category"].unique():
        assert category in checklists.BY_CATEGORY
        ids = [i["id"] for i in checklists.checklist_for(category)]
        assert len(ids) == len(set(ids))


def test_missing_items():
    cat = "OTP / boarding issue"
    all_ids = [i["id"] for i in checklists.checklist_for(cat)]
    assert checklists.missing_items(cat, {}) == all_ids
    full = {i["id"]: ("x" if i["kind"] == "text" else True) for i in checklists.checklist_for(cat)}
    assert checklists.missing_items(cat, full) == []
    assert checklists.missing_items(cat, {**full, "trip_emp": "   "}) == ["trip_emp"]
    assert checklists.missing_items(cat, {**full, "otp_mode": False}) == ["otp_mode"]
