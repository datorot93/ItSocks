from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session
from sqlalchemy import select, inspect, func, over, asc, desc

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.color import Color
from app.schemas.color import ColorCreate, ColorUpdate

class CRUDColor(CRUDBase[Color, ColorCreate, ColorUpdate]):
    
    def get_color_by_name(
        self, 
        db: Session, 
        *, 
        name: str 
    ):
        return db.query(Color).filter(Color.name == name).first()
    
    def get_color(
        self, 
        db: Session, 
        *, 
        name: str
    ):

        return db.query(Color).filter(
            Color.name == name
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
        return db.query(Color).filter(Color.code == code).first()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: ColorCreate
    ) -> Color:

        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data, 
            
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    def remove_color(
        self, 
        db: Session, 
        *, 
        code: str
    ) -> Color:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj
    
    
color = CRUDColor(Color)