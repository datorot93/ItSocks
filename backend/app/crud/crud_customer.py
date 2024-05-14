from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate

class CRUDCustomer(CRUDBase[Customer, CustomerCreate, CustomerUpdate]):
    
    def get_customer_by_fullname(
        self, 
        db: Session, 
        *, 
        fullname: str 
    ):
        return db.query(Customer).filter(Customer.fullname == fullname).first()
    
    def get_by_email(
        self,
        db: Session,
        *,
        email: str
    ):
        return db.query(Customer).filter(Customer.email == email).first()
    

    def create(
            self,
            db: Session,
            *,
            obj_in: CustomerCreate
    ) -> Customer:

        obj_in_data = jsonable_encoder(obj_in)

        db_obj = self.model(
            **obj_in_data, 
            
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    def remove_customer(
        self, 
        db: Session, 
        *,
        email: str
    ) -> Customer:
        obj = self.get_by_email(db, email=email)
        db.delete(obj)
        db.commit()
        return obj
    

customer = CRUDCustomer(Customer)