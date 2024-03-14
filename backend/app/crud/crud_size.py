from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session
from sqlalchemy import select, inspect, func, over, asc, desc

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.size import Size
from app.schemas.size import SizeCreate, SizeUpdate

class CRUDSize(CRUDBase[Size, SizeCreate, SizeUpdate]):
    
    def get_size_by_name(
        self, 
        db: Session, 
        *, 
        size: str 
    ):
        return db.query(Size).filter(Size.size == size).first()
    
    def get_size_by_id(
        self, 
        db: Session, 
        *, 
        id: int 
    ):
        return db.query(Size).filter(Size.id == id).first()
    
    def get_size(
        self, 
        db: Session, 
        *, 
        size: str
    ):

        return db.query(Size).filter(
            Size.size == size
        ).first()
    
    def object_as_dict(self, obj):
        return {c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs}    
    
    def get_by_code(
        self,
        db: Session,
        *,
        code: str
    ):
        return db.query(Size).filter(Size.code == code).first()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: SizeCreate
    ) -> Size:

        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data, 
            
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    def remove_tag(
        self, 
        db: Session, 
        *, 
        code: str
    ) -> Size:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj
    
    
size = CRUDSize(Size)