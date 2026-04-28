"""
Root conftest: ensure that backend/app/ is on sys.path so that both
  `from app.xxx import ...` and `from db.xxx import ...` style imports work.
"""
import sys
import os

# The backend runs with backend/app/ as the working directory (uvicorn main:app).
# pytest runs from backend/app/ too, so add it to sys.path.
sys.path.insert(0, os.path.dirname(__file__))
