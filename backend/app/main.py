"""FastAPI app for Escalation Check."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import config, store
from .data import get_tickets
from .routes import router


@asynccontextmanager
async def lifespan(_: FastAPI):
    store.init_db()
    store.seed_known_issues(get_tickets())
    yield


app = FastAPI(title="Escalation Check", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.allowed_origins(),
    allow_origin_regex=config.allowed_origin_regex(),
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
