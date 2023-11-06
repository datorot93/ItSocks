from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from sqlalchemy import select, inspect
from sqlalchemy.orm import join

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.pack import Pack
from app.schemas.pack import PackCreate, PackUpdate

class CRUDPack(CRUDBase[Pack, PackCreate, PackUpdate]):
    
    def get_pack_by_name(
        self,
        db: Session,
        *,
        name,
    ):

        return db.query(Pack).filter(
            Pack.name == name
        ).first()
    
    def object_as_dict(self, obj):
        return {c.key: getattr(obj, c.key)
                for c in inspect(obj).mapper.column_attrs}
    
    def get_pack_by_id(
        self, 
        *,
        db: Session,
        id
    ):

        return db.query(Pack).filter(
            Pack.id == id
        ).first()
    
    def object_as_dict(self, obj):
        return {c.key: getattr(obj, c.key)
                for c in inspect(obj).mapper.column_attrs}

    def get_packs(
        self,
        db: Session,
        *,
        skip: int,
        limit: int   
    ):
        pack_list = db.query(
                Pack.id,
                Pack.name,
                Pack.price,
                Pack.image_url,
                Pack.product_quantity,
                Pack.description,
                Pack.state,
                Pack.discount
            ).all()
        # print(products)
        
        return pack_list
    
    def get_packs_names(
        self,
        db: Session,
        *,
        skip: int,
        limit: 100
    ):
        packs_names = db.query(
                Pack.id,
                Pack.name
            ).all()
        
        return packs_names


    def create(
            self,
            db: Session,
            *,
            obj_in: PackCreate
    ) -> Pack:

        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    def remove_pack(
        self, 
        db: Session,
        *, 
        id: str
    ) -> Pack:
        obj = self.get_pack_by_id(db, id=id)
        db.delete(obj)
        db.commit()
        return obj


pack = CRUDPack(Pack)