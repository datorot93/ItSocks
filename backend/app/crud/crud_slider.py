from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.slider import Slider
from app.schemas.slider import SliderCreate, SliderUpdate

class CRUDSlider(CRUDBase[Slider, SliderCreate, SliderUpdate]):
    
    def get_slider_by_id_url(
        self,
        db: Session, 
        *,
        id_product: str,
        url: str
    ):
        return db.query(Slider).filter(Slider.id_product == id_product and Slider.url == url).first()
    
    def create(
            self,
            db: Session,
            *,
            obj_in: SliderCreate
    ) -> Slider:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    def get_sliders(
        self,
        db: Session,
        *,
        skip: int,
        limit: int   
    ):
        sliders_list = db.query(
                Slider.id,
                Slider.link,
                Slider.description,
                Slider.alt,
                Slider.url
            ).all()
        # print(products)
        
        return sliders_list
    
    def remove_slider(
        self, 
        db: Session, 
        *, 
        id_product: str,
        url: str
    ) -> Slider:
        obj = self.get_slider_by_id_url(
            db, 
            id_product=id_product, 
            url=url
        )
        db.delete(obj)
        db.commit()
        return obj


slider = CRUDSlider(Slider)