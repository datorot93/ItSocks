import os

from sqlalchemy.orm import Session

# from app.db.base import base
from app.db import base
# from app import crud, schemas
from app import crud, schemas


def init_db(db: Session) -> None:

    # Para que las tablas no sean creadas por las 
    # migrhaciones de alembic, usar la siguiente línea de código
    # Base.metadata.create_all(bind=engine)

    id = 1
    username = os.getenv("FIRST_SUPERUSER", "")
    password = os.getenv("FIRST_SUPERUSER_PASSWORD", "")
    user = crud.user.get_by_username(db, username=username)
    if not user:
        user_in = schemas.UserCreate(
            id=id, username=username, password=password, is_active=True, is_admin=True, full_name="admin"
        )
        user = crud.user.create(db, obj_in=user_in)  # noqa: F841


