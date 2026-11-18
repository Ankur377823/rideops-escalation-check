"""The predictor test and the what-if scenario."""

from fastapi import APIRouter, Query

from .. import evidence
from ..data import get_tickets

router = APIRouter(prefix="/evidence", tags=["evidence"])


@router.get("/predictors")
def predictors():
    return evidence.predictor_test(get_tickets())


@router.get("/scenario")
def scenario(prevention_rate: float = Query(0.5, ge=0, le=1)):
    return evidence.scenario(get_tickets(), prevention_rate)
