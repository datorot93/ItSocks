from typing import Generator
import os

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core import security
from app.db.session import SessionLocal

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/v1/token")
SECRET_KEY = os.getenv("SECRET_KEY", "")


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()