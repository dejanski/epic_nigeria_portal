# Stage 1: Build static assets (optional for DRF-only, but future-proof)
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.8.3

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production
FROM base AS production

# Create non-root user
RUN addgroup --system django && adduser --system --ingroup django django
USER django

# Copy code
COPY --chown=django:django . .

# Collect static (if frontend added later)
# RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "epic_nigeria_portal.wsgi:application"]