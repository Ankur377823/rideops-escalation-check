# Escalation Check

A pre-escalation check for RideOps L1 support agents, built for the RideOps Support case study.

## The problem

RideOps' open tickets are rising. The ticket data points to one main cause: escalations that engineering
cannot act on.

- 486 of 1,444 tickets were escalated to engineering.
- 275 of those (57%) came back without an engineering fix: missing information, config issues L1 could
  have handled, duplicates of known issues, how-to questions.
- Those 275 tickets are 19% of all tickets but 47% of all ticket waiting time.
- Each extra trip to engineering adds about two days and lowers the client rating.

## The tool

Before an agent escalates, Escalation Check:

1. shows what happened to past tickets of the same type
2. lists open known issues for that category
3. runs a checklist aimed at the reasons engineering gives for sending tickets back
4. writes a handoff note for engineering that states what was and was not provided
5. logs the decision, so the effect can be measured

It has two modes. **Monitor** warns and logs gaps. **Enforce** blocks escalation until the checklist is
complete.

| Screen | For | What it does |
|---|---|---|
| Tickets | L1 agent | Queue with search and filters |
| Ticket check | L1 agent | History, known issues, checklist, handoff note, decision |
| Lead dashboard | Support lead | Weekly measures, agent table, tickets needing attention |
| Does it work? | Reviewer | Predictor test and what-if scenario on the ticket history |
| Known issues | Engineering | Board that agents see during the check |
| Decision log | Support lead | Every check and what the agent decided |

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (React, TypeScript), Tailwind CSS, TanStack Query, Recharts |
| Backend | FastAPI, pandas |
| Storage | CSV for ticket data, SQLite for decisions and known issues |
| Handoff note | Plain template, optionally rewritten by Gemini through LiteLLM |
| Tests | pytest |
| Analysis | Jupyter notebooks |

## Project structure

Each file does one job and is kept short (the longest backend file is under 90 lines).

```
.
├── backend/
│   ├── app/
│   │   ├── main.py            create the app, CORS, startup
│   │   ├── config.py          settings from the environment
│   │   ├── data.py            load the CSV, derived columns
│   │   ├── reasons.py         engineering return reasons
│   │   ├── stats.py           shared rounding helpers
│   │   ├── schemas.py         request bodies
│   │   ├── serialize.py       rows to JSON
│   │   ├── routes/            one file per group of endpoints
│   │   ├── check/             history, advice, agent context, examples
│   │   ├── checklists/        checklist items and rules
│   │   ├── metrics/           weekly measures, summary, agent table
│   │   ├── evidence/          predictor test and what-if scenario
│   │   ├── handoff/           handoff note: template and optional LLM
│   │   └── store/             SQLite: decisions, known issues, mode
│   ├── data/                  the two case-study CSV files
│   ├── tests/                 32 pytest tests, one file per module
│   ├── requirements.txt       runtime dependencies
│   ├── requirements-dev.txt   adds pytest and ruff
│   └── pyproject.toml         pytest and ruff settings
├── frontend/
│   └── src/
│       ├── app/               pages (thin: they only compose features)
│       ├── features/          tickets, check, dashboard, evidence, known-issues, log
│       ├── components/        shared ui, layout and charts
│       └── lib/               API client, formatters, types
├── notebooks/
│   ├── 01_diagnosis.ipynb
│   ├── 02_success_measures.ipynb
│   └── 03_does_it_work.ipynb
├── render.yaml                backend deploy config
└── README.md
```

## Getting started

Requires Python 3.11 and Node 20 or later.

### 1. Python environment

```bash
python -m venv .venv
.venv\Scripts\activate          # macOS / Linux: source .venv/bin/activate
pip install -r backend/requirements-dev.txt -r notebooks/requirements.txt
```

### 2. Backend

```bash
cd backend
copy .env.example .env          # macOS / Linux: cp .env.example .env
uvicorn app.main:app --port 8001
```

API docs: http://localhost:8001/docs

### 3. Frontend

```bash
cd frontend
npm install
copy .env.example .env.local    # macOS / Linux: cp .env.example .env.local
npm run dev
```

App: http://localhost:3000

### 4. Tests, lint and formatting

Backend:

```bash
cd backend
pytest
ruff check .
ruff format .
```

Frontend:

```bash
cd frontend
npm run typecheck
npm run lint
npm run format
```

### 5. Notebooks

```bash
cd notebooks
jupyter lab
```

Each notebook is self-contained: it reads the CSV and uses plain pandas steps. The numbers match the app.

## Environment variables

| Where | Variable | Purpose |
|---|---|---|
| backend | `ALLOWED_ORIGINS` | Comma-separated frontend origins allowed to call the API |
| backend | `ALLOWED_ORIGIN_REGEX` | Optional pattern, for example for Vercel preview URLs |
| backend | `GEMINI_API_KEY` | Optional. Enables the AI-written handoff note |
| backend | `LLM_MODEL` | Optional. Any LiteLLM model name |
| frontend | `NEXT_PUBLIC_API_URL` | URL of the backend, no trailing slash |

Without `GEMINI_API_KEY` the app uses the template note, and everything else works the same.

## Deploy

**Backend on Render.** Create a Web Service from this repo, or use `render.yaml`. Root directory
`backend`, build `pip install -r requirements.txt`, start
`uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set `ALLOWED_ORIGINS` to the Vercel URL.

**Frontend on Vercel.** Import the repo, set the root directory to `frontend`, and set
`NEXT_PUBLIC_API_URL` to the Render URL.

Two things to know about the free tiers:

- Render sleeps when idle, so the first request can take up to a minute.
- The decision log and known-issue edits are in SQLite on Render's disk, which resets on redeploy.

## What the data testing changed

Two ideas were tested on the data before building. Both are shown on the "Does it work?" page and in
`notebooks/03_does_it_work.ipynb`.

1. **Predicting which escalations will come back.** Rules were learned on July and August and scored on
   September. Issue type flags tickets that come back 56% of the time, against a 59% base rate. It does
   not predict.
2. **Detecting duplicates automatically** from "same issue escalated in the last 7 days": 17% precision
   against a 14% base rate. It does not work either.

So the tool does not score tickets as risky. It applies the same reason-based checklist to every
escalation, and duplicates are handled by a board that engineering maintains.

## Assumptions and limits

- **Checklists are a first draft.** The data does not say what engineering needs per category. The items
  in `backend/app/checklists.py` were written from the category names and return reasons and need
  engineering review.
- **The scenario is a what-if, not a measurement.** The prevention rate is an input. Only a pilot can
  measure it.
- **The tool does not fix everything.** Volume grew 52% from July to September, and properly fixed
  escalations still take about 65 hours. At 100% prevention the what-if still leaves 35 open tickets
  against 48 actual.
- **Known issues are seeded** from issue types that engineering returned as duplicates four or more
  times. Workarounds are placeholders.
- **No login.** Agent identity comes from the ticket's assigned agent.
- **Ticket data is static.** Logging a decision does not change a ticket's status.
