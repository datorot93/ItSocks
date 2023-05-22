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
    
    def update(
            self, 
            db:Session,
            *,
            db_obj: Category,
            obj_in: Union[CategoryUpdate, Dict[str, Any]],
        ) -> Category:
    
        if isinstance(obj_in, dict):
            update_data = obj_in

        else:
            update_data = obj_in.dict(exclude_unset=True)

        return super().update(db, db_obj=db_obj, obj_in=update_data)





category = CRUDCategory(Category)