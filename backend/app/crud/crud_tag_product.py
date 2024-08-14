from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session
from sqlalchemy import select, inspect, func, over, asc, desc

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.tag_product import TagProduct
from app.schemas.tag_product import TagProductCreate, TagProductUpdate

class CRUDTagProduct(CRUDBase[TagProduct, TagProductCreate, TagProductUpdate]):
    
    def get_tag_by_id(
        self, 
        db: Session, 
        *, 
        name: str 
    ):
        return db.query(TagProduct).filter(TagProduct.name == name).first()
    
    def get_tag_product(
        self, 
        db: Session, 
        *, 
        id_product: int,
        id_tag: int
    ):

        return db.query(TagProduct).filter(
            TagProduct.tag_id == id_tag, TagProduct.product_id == id_product
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
        return db.query(TagProduct).filter(TagProduct.code == code).first()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: TagProductCreate
    ) -> TagProduct:

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
    ) -> TagProduct:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj


tag_product = CRUDTagProduct(TagProduct)