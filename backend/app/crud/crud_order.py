from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session
from sqlalchemy import select, inspect, func, over, asc, desc

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderUpdate

class CRUDOrder(CRUDBase[Order, OrderCreate, OrderUpdate]):
    
    def get_order_by_name(
        self, 
        db: Session, 
        *, 
        name: str 
    ):
        return db.query(Order).filter(Order.name == name).first()
    
    def get_orders(
        self, 
        db: Session, 
        *, 
        skip: int,
        limit: int,
    ):

        orders = db.query(Order).offset(skip).limit(limit).all()

        return orders
    
    def object_as_dict(self, obj):
        return {c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs}    
    
    def get_by_code(
        self,
        db: Session,
        *,
        code: str
    ):
        return db.query(Order).filter(Order.code == code).first()
    
    def get_single_order(
        self,
        db: Session,
        *,
        id: int
    ):
        my_order = db.query(Order).filter(Order.id == id).first()

        # print(my_order.product_order)

        return my_order
    

    def get_order_list(
        self,
        db: Session,
        *,
        skip: int,
        limit: int
    ):
        return db.query(Order).offset(skip).limit(limit).all()
    
    # def create(
    #         self,
    #         db: Session,
    #         *,
    #         obj_in: OrderCreate
    # ) -> Order:
    #     print('*'*100)
    #     print(obj_in)
    #     obj_in_data = jsonable_encoder(obj_in)
    #     db_obj = self.model(
    #         **obj_in_data, 
    #     )
    #     db.add(db_obj)
    #     db.commit()
    #     db.refresh(db_obj)

    #     return db_obj
    
    def remove_order(
        self, 
        db: Session, 
        *, 
        code: str
    ) -> Order:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj
    
    
order = CRUDOrder(Order)