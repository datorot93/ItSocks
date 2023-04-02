import os

from sqlalchemy.orm import Session

# from app.db.base import base
from db import base
# from app import crud, schemas
import crud
import schemas


def init_db(db: Session) -> None:

    # Para que las tablas no sean creadas por las 
    # migrhaciones de alembic, usar la siguiente línea de código
    # Base.metadata.create_all(bind=engine)

    id = 1
    nombre = "categoría 1"

    category = crud.category.get_category_by_name(db, nombre=nombre)

    if not category:
        category_in = schemas.CategoryCreate(
            nombre = nombre
        )
        category = crud.category.create( db, ob_in=category_in)

