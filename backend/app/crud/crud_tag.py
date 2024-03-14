from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session
from sqlalchemy import select, inspect, func, over, asc, desc

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagUpdate

class CRUDTag(CRUDBase[Tag, TagCreate, TagUpdate]):
    
    def get_tag_by_name(
        self, 
        db: Session, 
        *, 
        name: str 
    ):
        return db.query(Tag).filter(Tag.name == name).first()
    
    def get_tag(
        self, 
        db: Session, 
        *, 
        name: str
    ):

        return db.query(Tag).filter(
            Tag.name == name
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
        return db.query(Tag).filter(Tag.code == code).first()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: TagCreate
    ) -> Tag:

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
    ) -> Tag:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj
    
    
tag = CRUDTag(Tag)