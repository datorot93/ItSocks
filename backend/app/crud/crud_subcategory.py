from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.subcategory import Subcategory
from app.schemas.subcategory import SubcategoryCreate, SubcategoryUpdate

class CRUDSubcategory(CRUDBase[Subcategory, SubcategoryCreate, SubcategoryUpdate]):
    
    def get_subcategory_by_name(
        self, 
        db: Session, 
        *, 
        name: str 
    ):
        return db.query(Subcategory).filter(Subcategory.name == name).first()
    
    def get_by_code(
        self,
        db: Session,
        *,
        code: str
    ):
        return db.query(Subcategory).filter(Subcategory.code == code).first()


    def create(
            self,
            db: Session,
            *,
            obj_in: SubcategoryCreate,
            id_category: int
    ) -> Subcategory:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data, 
            id_category=id_category
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    def remove_subcategory(
        self, 
        db: Session, 
        *, 
        code: str
    ) -> Subcategory:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj





subcategory = CRUDSubcategory(Subcategory)