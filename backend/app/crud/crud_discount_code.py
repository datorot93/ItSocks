from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from sqlalchemy import select, inspect, func
from sqlalchemy.orm import join

from .crud_product import unaccent

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.discount_code import DiscountCode
from app.schemas.discount_code import DiscountCodeCreate, DiscountCodeUpdate

# Utils
import re
from unicodedata import normalize
import unicodedata
from datetime import datetime, timedelta


class CRUDDiscountCode(CRUDBase[DiscountCode, DiscountCodeCreate, DiscountCodeUpdate]):
    
    def get_discount_by_id(
        self, 
        *,
        db: Session,
        id
    ):

        return db.query(DiscountCode).filter(
            DiscountCode.id == id
        ).first()
    
    def object_as_dict(self, obj):
        return {c.key: getattr(obj, c.key)
                for c in inspect(obj).mapper.column_attrs}
    
    def get_discount_by_code(
        self, 
        db: Session,
        *,
        code
    ):

        return db.query(DiscountCode).filter(
            func.upper(DiscountCode.code) == code.upper()
        ).first()
    
    def object_as_dict(self, obj):
        return {c.key: getattr(obj, c.key)
                for c in inspect(obj).mapper.column_attrs}
    

    def get_codes(
        self,
        db: Session,
        *,
        skip: int,
        limit: int   
    ):
        discount_codes = db.query(
                DiscountCode.id,
                DiscountCode.code,
                DiscountCode.state,
                DiscountCode.expiration_date
            ).all()
        # print(products)
        
        return discount_codes

    def get_active_codes(
        self,
        db: Session,
        *,
        skip: int,
        limit: int   
    ):
        discount_codes = db.query(
                DiscountCode.id,
                DiscountCode.code,
                DiscountCode.state,
                DiscountCode.expiration_date
            ).filter( DiscountCode.state == True).all()
        
        return discount_codes
    


    def create(
            self,
            db: Session,
            *,
            obj_in: DiscountCodeCreate
    ) -> DiscountCode:

        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    

    def create_unique_code(
        self,
        db: Session,
        *,
        email: str,
        name: str,
        promo: int,
        user_id: int
    ):
        num_week = datetime.now().isocalendar()[1]
        code = f'{name[0]}{num_week:02}W{user_id}{email[0].upper()}'
        if not self.get_discount_by_code(db, code=code):
            expiration_date = datetime.now() + timedelta(days=365*5)
            db_obj = DiscountCode(
                code=code,
                discount=promo,
                state= True,
                expiration_date=expiration_date
            )
            print(db_obj)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)

        else:
            return None

        return db_obj
    
    


discount_code = CRUDDiscountCode(DiscountCode)