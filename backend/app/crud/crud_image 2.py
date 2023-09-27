from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.image import Image
from app.schemas.image import ImageCreate, ImageUpdate

class CRUDImage(CRUDBase[Image, ImageCreate, ImageUpdate]):
    
    def get_image_by_id_url(
        self,
        db: Session, 
        *,
        id_product: str,
        url: str
    ):
        return db.query(Image).filter(Image.id_product == id_product and Image.url == url).first()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: ImageCreate
    ) -> Image:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    def remove_image(
        self, 
        db: Session, 
        *, 
        id_product: str,
        url: str
    ) -> Image:
        obj = self.get_image_by_id_url(
            db, 
            id_product=id_product, 
            url=url
        )
        db.delete(obj)
        db.commit()
        return obj


image = CRUDImage(Image)