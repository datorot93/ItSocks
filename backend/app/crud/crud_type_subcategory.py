from typing import List, Any, Dict, Union
import random
import uuid

# from backend.app.models import user_order

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.type_subcategory import TypeSubcategory
from app.schemas.type_subcategory import TypeSubcategoryCreate, TypeSubcategoryUpdate


class CRUDTypeSubcategory(CRUDBase[TypeSubcategory, TypeSubcategoryCreate, TypeSubcategoryUpdate]):
    """ Class with the basic operations to do TypeSubcategories """

    def get_by_id(self, db: Session, *, id: int):
        return db.query(TypeSubcategory).filter(TypeSubcategory.id == id).first()
    
    def get_by_ids(self, db: Session, *, subcategory_id: int, type_id: int):
        return db.query(TypeSubcategory).filter(
            TypeSubcategory.subcategory_id == subcategory_id and TypeSubcategory.type_id == type_id
        ).first()

    def create(
        self, 
        db: Session, 
        *, 
        obj_in: TypeSubcategoryCreate
    ) -> TypeSubcategory:
        db_obj = TypeSubcategory(            
            type_id = obj_in.type_id,
            subcategory_id = obj_in.subcategory_id,
            id = int(uuid.uuid4().int/1000000000000000000000000000)
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: TypeSubcategory,
        obj_in: Union[TypeSubcategoryUpdate, Dict[str, Any]]
    ) -> TypeSubcategory:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def get_multi_by_type_subcategory(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[TypeSubcategory]:

        return db.query(self.model).offset(skip).limit(limit).all()

    def remove_type_subcategory(
            self, 
            db: Session, 
            *, 
            subcategory_id: int,
            type_id
    ) -> TypeSubcategory:
        obj = self.get_by_ids(
            db, 
            subcategory_id=subcategory_id, 
            type_id=type_id
        )

        db.delete(obj)
        db.commit()
        return obj
    
    def get_multi_by_station(
        self, 
        db: Session, 
        *, 
        id_station: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[TypeSubcategory]:

        return (
            db.query(self.model)
            .filter(TypeSubcategory.id_station == id_station)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def get_multi_by_station_ordered(
        self, 
        db: Session, 
        *, 
        id_station: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[TypeSubcategory]:


        return (
            db.query(self.model)
            .filter(TypeSubcategory.id_station == id_station)
            .order_by(asc(TypeSubcategory.priority))
            .offset(skip)
            .limit(limit)
            .all()            
        )
    


type_subcategory = CRUDTypeSubcategory(TypeSubcategory)
