from typing import Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

class CRUDCategory(CRUDBase[Category, CategoryCreate, CategoryUpdate]):
    
    def get_category_by_name(self, db: Session, *, nombre: str ) -> Optional[ Category ]:
        return db.query( Category ).filter( Category.nombre == nombre ).first()


    def create(self, db: Session, *, nombre: str ) -> Category:
        db_obj = Category(
            nombre= nombre
        )

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj


category = CRUDCategory(Category)