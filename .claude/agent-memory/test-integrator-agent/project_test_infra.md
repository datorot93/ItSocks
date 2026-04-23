---
name: "Test Infrastructure — ItSocks"
description: "Test infrastructure setup details for all three layers of ItSocks"
type: "project"
---

Test infrastructure was implemented on 2026-04-16 across all three layers.

## Backend (backend/app/)
- pytest 7.4 + pytest-cov 4.1 + pytest-asyncio 0.21 + httpx in dev-dependencies
- SQLite in-memory DB via `sqlite:///:memory:` with FK enforcement OFF (PRAGMA foreign_keys=OFF)
- conftest.py at `backend/app/tests/conftest.py` provides `engine`, `db`, `client` fixtures
- Root conftest.py at `backend/app/conftest.py` adds `backend/app/` to sys.path (needed because crud/base.py uses `from db.base_class import Base` without `app.` prefix)
- pytest.ini at `backend/app/pytest.ini`

**Why:** crud/base.py has non-`app.`-prefixed imports that require sys.path manipulation.
**How to apply:** Always run pytest from `backend/app/` directory.

## Frontend (frontend/)
- vitest 1.6 + @testing-library/react 14 + jsdom 24 + @vitest/coverage-v8
- Setup file at `src/test/setup.js` — sets React Refresh globals to fix "can't detect preamble" error in jsdom
- Coverage scoped to §4 files via `coverage.include` in vite.config.js

**Why:** @vitejs/plugin-react v3 injects React Refresh code that checks `window.__vite_plugin_react_preamble_installed__` which doesn't exist in jsdom. Setup file sets the flag.
**How to apply:** Always include React Refresh globals in setup.js for any new frontend test projects using @vitejs/plugin-react.

## Admin (admin-itsocks/)
- Same vitest setup as frontend
- Setup file at `src/test/setup.js` — identical to frontend setup

## Known Quirks
- `backend/app/crud/base.py` uses `from db.base_class import Base` (not `app.db.base_class`) — this requires sys.path.insert(0, dir)
- `frontend/src/hooks/useOrderReducer.js` is a `.js` file (not `.jsx`) that imports React — works once preamble globals are set in setup
- `admin-itsocks/src/OrderReport/index.js` imports `./OrderReportList` but actual file is `OrderReportrList.jsx` (typo) — index.js is untestable without fixing the source
