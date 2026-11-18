"""The known-issues board that engineering maintains."""

from fastapi import APIRouter, HTTPException

from .. import store
from ..schemas import IssueStatus, KnownIssue

router = APIRouter(prefix="/known-issues", tags=["known issues"])


@router.get("")
def known_issues(category: str | None = None):
    return store.list_known_issues(category=category)


@router.post("", status_code=201)
def create_known_issue(body: KnownIssue):
    return store.add_known_issue(body.title, body.category, workaround=body.workaround, source="Added in app")


@router.patch("/{issue_id}")
def update_known_issue(issue_id: int, body: IssueStatus):
    issue = store.set_known_issue_status(issue_id, body.status)
    if not issue:
        raise HTTPException(404, "Known issue not found")
    return issue
