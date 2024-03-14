from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session
from sqlalchemy import select, inspect, func, over, asc, desc

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.product_color import ProductColor
from app.models.color import Color
from app.schemas.product_color import ProductColorCreate, ProductColorUpdate

class CRUDProductColor(CRUDBase[ProductColor, ProductColorCreate, ProductColorUpdate]):
    
    def get_color_by_name(
        self, 
        db: Session, 
        *, 
        name: str 
    ):
        return db.query(Color).filter(Color.name == name).first()
    
    def get_product_color(
        self, 
        db: Session, 
        *, 
        product_id: int,
        color_id: int
    ):

        return db.query(ProductColor).filter(
            ProductColor.color_id == color_id, ProductColor.product_id == product_id
        ).first()
    
    def object_as_dict(self, obj):
        return {c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs}    
    
    def create(
            self,
            db: Session,
            *,
            obj_in: ProductColorCreate
    ) -> ProductColor:

        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data, 
            
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    def get_product_color(
        self, 
        db: Session, 
        *, 
        product_id: int,
        color_id: int
    ):

        return db.query(ProductColor).filter(
            ProductColor.color_id == color_id, ProductColor.product_id == product_id
        ).first()
    
    def remove_product_color(
        self, 
        db: Session, 
        *, 
        code: str
    ) -> ProductColor:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj
    
    





product_color = CRUDProductColor(ProductColor)