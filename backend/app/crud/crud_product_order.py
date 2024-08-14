from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session
from sqlalchemy import select, inspect, func, over, asc, desc

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.product_order import ProductOrder
from app.models.order import Order
from app.schemas.product_order import ProductOrderCreate, ProductOrderUpdate

class CRUDProductOrder(CRUDBase[ProductOrder, ProductOrderCreate, ProductOrderUpdate]):
    
    def get_order_by_name(
        self, 
        db: Session, 
        *, 
        order: str 
    ):
        return db.query(Order).filter(Order.order == order).first()
    
    def get_product_order(
        self, 
        db: Session, 
        *, 
        product_id: int,
        order_id: int
    ):

        return db.query(ProductOrder).filter(
            ProductOrder.order_id == order_id, ProductOrder.product_id == product_id
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
        return db.query(ProductOrder).filter(ProductOrder.code == code).first()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: ProductOrderCreate
    ) -> ProductOrder:

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
    ) -> ProductOrder:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj
    
    





product_order = CRUDProductOrder(ProductOrder)