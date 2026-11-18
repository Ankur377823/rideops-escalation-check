"""Settings read from the environment (and backend/.env when present)."""

import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
TICKETS_CSV = DATA_DIR / "rideops_support_tickets.csv"
DEFAULT_LLM_MODEL = "gemini/gemini-3.5-flash-lite"

load_dotenv(BASE_DIR / ".env")  # real environment variables win over the file


def db_path() -> Path:
    return Path(os.environ.get("ESCALATION_CHECK_DB") or DATA_DIR / "app.db")


def allowed_origins() -> list[str]:
    raw = os.environ.get("ALLOWED_ORIGINS") or "http://localhost:3000"
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


def allowed_origin_regex() -> str | None:
    return os.environ.get("ALLOWED_ORIGIN_REGEX") or None


def llm_enabled() -> bool:
    return bool(os.environ.get("GEMINI_API_KEY"))


def llm_model() -> str:
    return os.environ.get("LLM_MODEL") or DEFAULT_LLM_MODEL
