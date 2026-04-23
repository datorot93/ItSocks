from typing import Optional, Any, Union, Dict

from sqlalchemy import asc
from sqlalchemy.orm import Session

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.type import Type
from app.schemas.type import TypeCreate, TypeUpdate

class CRUDType(CRUDBase[Type, TypeCreate, TypeUpdate]):
    
    def get_type_by_name(
        self, 
        db: Session, 
        *, 
        name: str 
    ):
        return db.query(Type).filter(Type.name == name).first()
    
    def get_type_list(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100
    ):
        
        return db.query(
            Type
        ).order_by(
            asc(
                Type.priority
            )
        ).offset(skip).limit(limit).all()
        
    
    def get_by_code(
        self,
        db: Session,
        *,
        code: str
    ):
        return db.query(Type).filter(Type.code == code).first()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: TypeCreate
    ) -> Type:

        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data, 
            
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    
    def remove_type(
        self, 
        db: Session, 
        *, 
        code: str
    ) -> Type:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj
    
    





type = CRUDType(Type)