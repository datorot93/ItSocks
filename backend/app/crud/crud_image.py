from typing import Optional, Any, Union, Dict

from sqlalchemy import select, inspect, func, over, asc, desc
from sqlalchemy.orm import Session

from fastapi.encoders import jsonable_encoder

from unidecode import unidecode

from app.crud.base import CRUDBase
from app.models.image import Image
from app.models.product import Product
from app.schemas.image import ImageCreate, ImageUpdate

from .crud_shipping import unaccent

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


        return query.all()
    
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
    
    
    def get_filteret_images(
        self,
        db: Session,
        *,
        filters: str,
        sort: None,
        range: None
    ):
        query = db.query(
            Image
        ).join(
            Product, Image.id_product == Product.id
        )

        #  Apply filters
        if filters:
            if 'q' in filters:
                query = query.\
                    filter(
                        unaccent(func.lower(Product.name)).ilike(f"%{unidecode(filters['q'].strip().lower())}%")
                    )

        # Apply sorting
        if sort:
            sort_field, sort_order = sort
            if sort_order.lower() == "asc":
                query = query.order_by(asc(getattr(Product, sort_field)))
            else:
                query = query.order_by(desc(getattr(Product, sort_field)))

        # Apply range (pagination)
        if range:
            start, end = range
            query = query.offset(start).limit(end - start + 1)
            
        return query.all()


image = CRUDImage(Image)