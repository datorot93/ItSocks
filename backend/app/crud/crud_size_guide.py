from typing import Optional, Any, Union, Dict

from sqlalchemy import select, inspect, func, over, asc, desc
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.size_guide import SizeGuide
from app.schemas.size_guide import SizeGuideCreate, SizeGuideUpdate
from .crud_shipping import unaccent


from unidecode import unidecode

class CRUDSizeGuide(CRUDBase[SizeGuide, SizeGuideCreate, SizeGuideUpdate]):

    
    def create(
            self,
            db: Session,
            *,
            obj_in: SizeGuideCreate
    ) -> SizeGuide:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    

    def get_size_guides(
        self,
        db: Session,
        *,
        skip: int,
        limit: int   
    ):
        size_guides_list = db.query(
                SizeGuide.id,
                SizeGuide.size_guide,
                SizeGuide.image_url,
                SizeGuide.alt
            ).all()
        # print(products)
        
        return size_guides_list
    
    def get_size_guide_by_name(
        self,
        db: Session,
        *,
        size_guide: str
    ):
        return db.query(SizeGuide).filter(
            unaccent(func.lower(SizeGuide.size_guide)) == unidecode(size_guide.strip().lower()),
        ).first()
    
    
    def remove_size_guide(
        self, 
        db: Session, 
        *, 
        id_product: str,
        url: str
    ) -> SizeGuide:
        obj = self.get_size_guide_by_id_url(
            db, 
            id_product=id_product, 
            url=url
        )
        db.delete(obj)
        db.commit()
        return obj


size_guide = CRUDSizeGuide(SizeGuide)