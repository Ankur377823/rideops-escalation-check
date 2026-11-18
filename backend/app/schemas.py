"""Request bodies accepted by the API."""

from typing import Literal

from pydantic import BaseModel, Field


class Answers(BaseModel):
    answers: dict[str, str | bool] = Field(default_factory=dict)


class Decision(Answers):
    action: Literal["escalated", "resolved_at_l1", "linked_known_issue"]
    note: str | None = None


class Mode(BaseModel):
    mode: Literal["monitor", "enforce"]


class KnownIssue(BaseModel):
    title: str = Field(min_length=3)
    category: str
    workaround: str | None = None


class IssueStatus(BaseModel):
    status: Literal["Open", "Fixed"]
