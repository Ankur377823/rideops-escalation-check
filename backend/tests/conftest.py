import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def client(tmp_path, monkeypatch):
    """App wired to a throwaway database, with the LLM switched off."""
    monkeypatch.setenv("ESCALATION_CHECK_DB", str(tmp_path / "test.db"))
    # An empty value (not a missing one) stops backend/.env from switching the LLM back on.
    monkeypatch.setenv("GEMINI_API_KEY", "")
    from app.main import app

    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def df():
    from app.data import get_tickets

    return get_tickets()
