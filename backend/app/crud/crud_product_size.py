from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session
from sqlalchemy import select, inspect, func, over, asc, desc

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.product_size import ProductSize
from app.models.size import Size
from app.schemas.product_size import ProductSizeCreate, ProductSizeUpdate

class CRUDProductSize(CRUDBase[ProductSize, ProductSizeCreate, ProductSizeUpdate]):
    
    def get_size_by_name(
        self, 
        db: Session, 
        *, 
        size: str 
    ):
        return db.query(Size).filter(Size.size == size).first()
    
    def get_product_size(
        self, 
        db: Session, 
        *, 
        product_id: int,
        size_id: int
    ):

        return db.query(ProductSize).filter(
            ProductSize.size_id == size_id, ProductSize.product_id == product_id
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
        return db.query(ProductSize).filter(ProductSize.code == code).first()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: ProductSizeCreate
    ) -> ProductSize:

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
    ) -> ProductSize:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj
    
    





product_size = CRUDProductSize(ProductSize)