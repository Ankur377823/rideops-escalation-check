# Escalation Check

A pre-escalation check for RideOps L1 support agents, built for the RideOps Support case study.

**Live demo:** https://rideops-escalation-check.vercel.app

**Write-up (4 pages):** [docs/RideOps_Support_Writeup.pdf](docs/RideOps_Support_Writeup.pdf). It covers the
diagnosis, the success measures, what was built and the four-week plan.

The API runs on Render's free plan and sleeps when idle, so the first page can take up to a minute to
load. API docs: https://escalation-check-api.onrender.com/docs

## The problem

RideOps' open tickets rose 60% in two months: 30 at the end of July, 48 at the end of September. Two
things explain the rise: 52% more tickets arrived, and every stage of handling slowed by about a fifth
under that load.

The team cannot control volume this quarter. It can control where engineering's time goes:

- 486 of 1,444 tickets were escalated to engineering.
- 275 of those (57%) came back without an engineering fix: missing information, config issues L1 could
  have handled, duplicates of known issues, how-to questions. This was already true in July.
- Counted as work, 528 of engineering's 777 trips (68%) went to tickets it did not end up fixing.
- Each extra trip to engineering adds about two days and lowers the client rating.

Removing those trips is how engineering gets time back for real fixes without new hires.

## The tool

Before an agent escalates, Escalation Check:

1. shows what happened to past tickets of the same type
2. lists open known issues for that category
3. runs a checklist aimed at the reasons engineering gives for sending tickets back
4. writes a handoff note for engineering that states what was and was not provided
5. logs the decision, so the effect can be measured

It has two modes. **Monitor** warns and logs gaps. **Enforce** blocks escalation until the checklist is
complete. The mode switch is at the bottom of the side menu.

The side menu is grouped by who uses each screen, and the top bar shows where you are, the data period
and the current mode.

| Screen | For | What it does |
|---|---|---|
| Overview | Reviewer | The problem in four numbers, how the check works, a two-minute demo path |
| Ticket queue | L1 agent | Queue with search and filters |
| Ticket check | L1 agent | Five numbered steps: history, known issues, checklist, handoff note, decision |
| Dashboard | Support lead | Weekly measures, agent table, tickets needing attention |
| Does it work? | Reviewer | Predictor test and what-if scenario on the ticket history |
| Known issues | Engineering | Board that agents see during the check |
| Decision log | Support lead | Every check and what the agent decided |

### A two-minute tour

1. Open the **Overview** page. It shows the problem in four numbers and how the check works.
2. Open ticket `SUP-11438` from the **Ticket queue**. The history shows most past escalations of this
   issue came back.
3. Fill in part of the checklist and click **Generate note**. The note lists what was not provided.
4. Click **Escalate to engineering**. In Monitor mode it is allowed and the gaps are logged.
5. Switch to **Enforce** and try again. Escalation is blocked until the checklist is complete.
6. Open the **Decision log** to see what was recorded.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (React, TypeScript), Tailwind CSS, TanStack Query, Recharts |
| Backend | FastAPI, pandas |
| Storage | CSV for ticket data, SQLite for decisions and known issues |
| Handoff note | Plain template, optionally rewritten by Gemini through LiteLLM (the only use of AI) |
| Tests | pytest (34 tests, including one end-to-end journey), ruff, TypeScript, ESLint, Prettier |
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
│   ├── tests/                 34 pytest tests: one file per module, plus one end-to-end journey
│   ├── Dockerfile             backend image
│   ├── requirements.txt       runtime dependencies
│   ├── requirements-dev.txt   adds pytest and ruff
│   └── pyproject.toml         pytest and ruff settings
├── frontend/
│   ├── Dockerfile             frontend image
│   └── src/
│       ├── app/               pages (thin: they only compose features)
│       ├── features/          overview, tickets, check, dashboard, evidence, known-issues, log
│       ├── components/        shared ui, layout (sidebar, top bar) and charts
│       └── lib/               API client, formatters, clipboard helper, types
├── docs/
│   └── RideOps_Support_Writeup.pdf   the case study write-up
├── notebooks/
│   ├── 01_diagnosis.ipynb
│   ├── 02_success_measures.ipynb
│   └── 03_does_it_work.ipynb
├── docker-compose.yml         runs backend and frontend together
├── render.yaml                backend deploy config
└── README.md
```

## Run with Docker

The quickest way to run everything. It needs only Docker Desktop.

```bash
docker compose up --build
```

Then open http://localhost:3000. The API is at http://localhost:8001/docs.

To stop it:

```bash
docker compose down
```

Good to know:

- **Ports.** If 3000 or 8001 is already used on your machine, create a file named `.env` next to
  `docker-compose.yml` with, for example, `API_PORT=8011` or `WEB_PORT=3010`, then run
  `docker compose up --build` again.
- **AI note.** To turn on the Gemini handoff note, put `GEMINI_API_KEY` in `backend/.env` before
  starting. Without it the template note is used. The key is passed to the container when it runs and
  is never copied into the image.
- **Saved data.** The decision log and known issues are kept in a Docker volume, so they survive a
  restart. `docker compose down -v` deletes them.

## Run without Docker

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
npm run build
```

### 5. Notebooks

```bash
cd notebooks
jupyter lab
```

Each notebook is self-contained: it reads the CSV and uses plain pandas steps. The numbers match the app.

| Notebook | Question it answers |
|---|---|
| `01_diagnosis.ipynb` | What is driving the open tickets? |
| `02_success_measures.ipynb` | What should "better" mean, and how do we track it weekly? |
| `03_does_it_work.ipynb` | Do the assumptions behind the tool hold, and how much could it help? |

## Environment variables

| Where | Variable | Purpose |
|---|---|---|
| backend | `ALLOWED_ORIGINS` | Comma-separated frontend origins allowed to call the API |
| backend | `ALLOWED_ORIGIN_REGEX` | Optional pattern, for example for Vercel preview URLs |
| backend | `GEMINI_API_KEY` | Optional. Enables the AI-written handoff note |
| backend | `LLM_MODEL` | Optional. Any LiteLLM model name. Default `gemini/gemini-3.5-flash-lite` |
| frontend | `NEXT_PUBLIC_API_URL` | URL of the backend, no trailing slash |

Without `GEMINI_API_KEY` the app uses the template note, and everything else works the same. If Gemini
is slow or returns an error, the app also falls back to the template note. The label under the note
says which one was used. Never commit a real key: `backend/.env` is git-ignored.

## Deploy

**Backend on Render.** Create a Web Service from this repo, or use `render.yaml`. Root directory
`backend`, build `pip install -r requirements.txt`, start
`uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set `ALLOWED_ORIGINS` to the Vercel URL, with
`https` and no trailing slash. Without it the browser blocks every API call.

**Frontend on Vercel.** Import the repo, set the root directory to `frontend`, and set
`NEXT_PUBLIC_API_URL` to the Render URL. This value is built into the site, so redeploy after changing it.

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
escalation, and duplicates are handled by a board that engineering maintains. The history panel is
shown as context. It becomes a warning only when an issue's return rate is clearly above the team's.

## Assumptions and limits

- **Checklists are a first draft.** The data does not say what engineering needs per category. The items
  in `backend/app/checklists/` were written from the category names and return reasons and need
  engineering review.
- **The scenario is a what-if, not a measurement.** The prevention rate is an input. Only a pilot can
  measure it.
- **The tool does not fix everything.** Volume grew 52% from July to September, and properly fixed
  escalations still take about 65 hours. At 100% prevention the what-if still leaves 35 open tickets
  against 48 actual.
- **Known issues are seeded** from issue types that engineering returned as duplicates four or more
  times. Their workarounds are empty until engineering adds them.
- **History uses the whole file.** On an old ticket the tool also sees tickets raised later, and the
  known-issues board is seeded from the same data. In live use it would only see the past.
- **"Similar tickets" means the same description** once numbers are removed. That works on this data
  (201 descriptions become 48 issue types) but real free-text tickets would need looser matching.
- **AI is used in one place only**, to reword the handoff note. It never decides whether a ticket is
  escalated.
- **No login.** Agent identity comes from the ticket's assigned agent.
- **Ticket data is static.** Logging a decision does not change a ticket's status.
