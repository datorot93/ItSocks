from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.category import Category
from schemas.category import CategoryCreate, CategoryUpdate

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
    
    # def update(
    #         self, 
    #         db:Session,
    #         *,
    #         db_obj: Category,
    #         obj_in: Union[CategoryUpdate, Dict[str, Any]]
    #         nombre: str,

    #     ):
    #     db_obj = Category(
    #         nombre = nombre
    #     )




category = CRUDCategory(Category)