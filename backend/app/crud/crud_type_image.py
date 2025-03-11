from typing import Optional, Any, Union, Dict

from sqlalchemy import asc
from sqlalchemy.orm import Session

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.type_image import TypeImage
from app.schemas.type_image import TypeImageCreate, TypeImageUpdate

class CRUDTypeImage(CRUDBase[TypeImage, TypeImageCreate, TypeImageUpdate]):
    
    def get_slider_by_id_url(
        self,
        db: Session, 
        *,
        id_product: str,
        url: str
    ):
        return db.query(TypeImage).filter(TypeImage.id_product == id_product and TypeImage.url == url).first()
    
    def get_type_image_list(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100
    ):
        return db.query(
            TypeImage
        ).order_by(asc(TypeImage.priority)).offset(skip).limit(limit).all()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: TypeImageCreate
    ) -> TypeImage:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    def get_type_images(
        self,
        db: Session,
        *,
        skip: int,
        limit: int   
    ):
        type_images_list = db.query(
                TypeImage.id,
                TypeImage.link,
                TypeImage.description,
                TypeImage.alt,
                TypeImage.url,
                TypeImage.state
            ).all()
        # print(products)
        
        return type_images_list
    
    def get_active_type_images(
        self,
        db: Session,
        *,
        skip: int,
        limit: int   
    ):
        type_images_list = db.query(
                TypeImage.id,
                TypeImage.link,
                TypeImage.description,
                TypeImage.alt,
                TypeImage.url,
                TypeImage.state
            ).filter(
                TypeImage.state == True
            ).all()
        # print(products)
        
        return type_images_list


type_image = CRUDTypeImage(TypeImage)