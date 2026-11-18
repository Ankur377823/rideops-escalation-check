# Backend API: FastAPI served by uvicorn on port 8001.
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    # Decisions and known issues are stored here, on a volume, so they survive restarts.
    ESCALATION_CHECK_DB=/var/lib/escalation-check/app.db

WORKDIR /app

# Install dependencies first, so this layer is reused when only the code changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY data/*.csv ./data/

# Run as a normal user, not root.
RUN useradd --create-home appuser \
    && mkdir -p /var/lib/escalation-check \
    && chown appuser /var/lib/escalation-check
USER appuser

EXPOSE 8001

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
