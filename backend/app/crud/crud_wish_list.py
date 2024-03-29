from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.wish_list import WishList
from app.schemas.wish_list import WishListCreate, WishListUpdate

class CRUDWishList(CRUDBase[WishList, WishListCreate, WishListUpdate]):
    
    def get_wish_list_by_id_list(
        self, 
        db: Session, 
        *, 
        id_list: str 
    ):
        return db.query(WishList).filter(WishList.id_list == id_list).all()
    
    def get_by_code(
        self,
        db: Session,
        *,
        code: str
    ):
        return db.query(WishList).filter(WishList.code == code).first()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: WishListCreate
    ) -> WishList:

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
    ) -> WishList:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj


wish_list = CRUDWishList(WishList)