from typing import Optional, Any, Union, Dict

from sqlalchemy import asc
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
    
    def get_by_id(
        self,
        db: Session,
        *,
        id: int
    ):
        
        return db.query(Subcategory).filter(Subcategory.id == id).first()

    
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

    def get_subcategory_list(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100
    ):
        return db.query(Subcategory).order_by(asc(Subcategory.priority)).offset(skip).limit(limit).all()



subcategory = CRUDSubcategory(Subcategory)