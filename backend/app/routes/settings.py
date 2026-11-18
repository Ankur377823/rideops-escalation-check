"""Read and change monitor / enforce mode."""

from fastapi import APIRouter

from .. import store
from ..schemas import Mode

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/mode")
def get_mode():
    return {"mode": store.get_mode()}


@router.put("/mode")
def put_mode(body: Mode):
    return {"mode": store.set_mode(body.mode)}
