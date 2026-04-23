# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project instructions

- Cada que vayas a empezar a ejecutar un fase de un plan vas a crear una rama con un nombre apropiado para la misma siguiendo la nomenclatura feature/*
- Al terminar cada fase y testearla vas a hacer un commit un push y un PR a main utilizando el MCP de Github.
- Cuando se utilice el MCP de Github para crear un PR ejecuta la skill /github-pr-changelog. Especificada en el archivo @.claude/skills/github-pr-changelog/SKILL.md

## Project Overview

ItSocks is an e-commerce platform for a socks store. It consists of three main applications:

- **`backend/`** — FastAPI + SQLAlchemy REST API (Python 3.9, PostgreSQL)
- **`frontend/`** — Customer-facing React 18 storefront (Vite, Redux, React Router v6)
- **`admin-itsocks/`** — Admin panel built with React Admin v5 (Vite, MUI)

Infrastructure runs via `docker-compose.yaml` (Nginx + PostgreSQL + backend). Production is hosted on AWS EC2 with static files on S3.

## Development Commands

### Backend

```bash
cd backend/app
# Install dependencies
poetry install

# Run development server (from backend/app directory)
uvicorn main:app --reload --port 8000

# Run with Docker Compose (full stack)
docker-compose up

# Database migrations
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Frontend (Customer Store)

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
npm run build
```

### Admin Panel

```bash
cd admin-itsocks
npm install
npm run dev        # starts on http://localhost:5174
npm run build
npm run lint
```

## Architecture

### Backend Structure

The backend follows a layered pattern: **Router → CRUD → Model/Schema**.

- `app/api/api_v1/routers/` — FastAPI route handlers; each file corresponds to one resource
- `app/crud/` — Database operations; all inherit from `CRUDBase` in `crud/base.py` which provides generic get/create/update/delete
- `app/models/` — SQLAlchemy ORM models
- `app/schemas/` — Pydantic schemas for request/response validation
- `app/core/config.py` — Environment-based configuration (DB credentials, AWS keys via env vars)
- `app/db/session.py` — SQLAlchemy engine and `SessionLocal`
- `app/migrations/` — Alembic migration scripts

DB sessions are injected per HTTP request via middleware in `main.py`.

API is mounted at `/api/v1/`. Swagger docs available at `/api/docs`.

### Frontend Structure

- `src/store/store.js` — Redux store (legacy `redux` + `redux-thunk`, not RTK)
- `src/reducers/` — Individual reducers (cart, orders, products, shipping, discounts, packs, preferences, wish list)
- `src/actions/` — Thunk action creators
- `src/itsocks/` — Main feature module with its own context and routes
- `src/router/AppRouter.jsx` — Top-level router
- `src/config/index.js` — Base URL configuration (switch between local/prod by commenting/uncommenting)

### Admin Panel Structure

Built with React Admin v5 using `ra-data-simple-rest` as the data provider connected to the backend. Resources map 1:1 to backend endpoints. Organized by resource in `src/` (e.g., `Product/`, `Order/`, `SellsReport/`).

## Environment Configuration

### Switching Between Local and Production

**Backend** (`app/core/config.py`): Reads `POSTGRES_SERVER`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `AWS_BUCKET_NAME` from environment variables.

**Frontend & Admin** (`src/config/index.js` in each): Comment/uncomment the relevant `BASE_URL` / `BACKEND_URL` / `FRONTEND_URL` block. Local dev uses `http://localhost:8000/api/v1` when running backend directly, or `http://localhost/api/v1` via Docker.

### Payment Integration

MercadoPago is integrated in the backend (`mercadopago` SDK) and frontend (`@mercadopago/sdk-react`). The preference ID is managed as global Redux state (`preferenceReducer`).

## Key Dependencies

| Layer | Key Libraries |
|-------|--------------|
| Backend | FastAPI, SQLAlchemy 1.3, Pydantic v1, Alembic, boto3, MercadoPago SDK |
| Frontend | React 18, Redux (legacy), React Router v6, React Bootstrap, React Admin (admin only) |
