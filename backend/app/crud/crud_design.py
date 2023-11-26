from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.design import Design
from app.schemas.design import DesignCreate, DesignUpdate

class CRUDDesign(CRUDBase[Design, DesignCreate, DesignUpdate]):
    
    def get_design_by_name(
        self, 
        db: Session, 
        *, 
        name: str 
    ):
        return db.query(Design).filter(Design.name == name).first()
    
    def get_by_code(
        self,
        db: Session,
        *,
        code: str
    ):
        return db.query(Design).filter(Design.code == code).first()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: DesignCreate
    ) -> Design:

        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data, 
            
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    def remove_design(
        self, 
        db: Session, 
        *, 
        code: str
    ) -> Design:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj


design = CRUDDesign(Design)