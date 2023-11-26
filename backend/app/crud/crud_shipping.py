from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from sqlalchemy import select, inspect, func
from sqlalchemy.orm import join
from sqlalchemy.sql.functions import ReturnTypeFromArgs

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.shipping import Shipping
from app.schemas.shipping import ShippingCreate, ShippingUpdate

# Utils
import re
from unicodedata import normalize
import unicodedata

class unaccent(ReturnTypeFromArgs):
    pass

class CRUDShipping(CRUDBase[Shipping, ShippingCreate, ShippingUpdate]):
    
    def get_shipping_by_municipio(
        self,
        db: Session,
        *,
        municipio_ciudad,
    ):

        return db.query(Shipping).filter(
            Shipping.municipio_ciudad == municipio_ciudad
        ).first()
    
    def get_shipping_by_departamento(
        self,
        db: Session,
        *,
        departamento,
    ):

        return db.query(Shipping).filter(
            Shipping.departamento == departamento
        ).first()
    
    def object_as_dict(self, obj):
        return {c.key: getattr(obj, c.key)
                for c in inspect(obj).mapper.column_attrs}
    
    def get_shipping_by_id(
        self, 
        *,
        db: Session,
        id
    ):

        return db.query(Shipping).filter(
            Shipping.id == id
        ).first()
    
    def object_as_dict(self, obj):
        return {c.key: getattr(obj, c.key)
                for c in inspect(obj).mapper.column_attrs}

    def get_shippings(
        self,
        db: Session,
        *,
        skip: int,
        limit: int   
    ):
        shipping_list = db.query(
                Shipping.id,
                Shipping.municipio_ciudad,
                Shipping.departamento,
                Shipping.tarifa,
            ).all()
        # print(products)
        
        return shipping_list
    
    def get_shipping_municipios(
        self,
        db: Session,
        *,
        skip: int,
        limit: 100
    ):
        shipping_municipios = db.query(
                Shipping.municipio_ciudad
            ).all()
        
        return shipping_municipios
    
    def get_shipping_departamentos(
        self,
        db: Session,
        *,
        skip: int,
        limit: 100
    ):
        shipping_departamentos = db.query(
                Shipping.departamento
            ).distinct().all()
        
        return shipping_departamentos
    
    def get_municipios_by_departamento(
        self,
        db: Session,
        departamento,
        *,
        skip: int,
        limit: 100
    ):

        shipping_municipios = db.query(
                Shipping.municipio_ciudad
            ).filter(
                unaccent(func.lower(Shipping.departamento)) == departamento.lower()
            ).distinct().all()
        
        return shipping_municipios
    
    def limpiar_texto(self, s):

        s1 = s.replace("ñ", "#").replace("Ñ", "%")
        s2 = unicodedata.normalize("NFKD", s1)\
            .encode("ascii","ignore").decode("ascii")\
            .replace("#", "ñ").replace("%", "Ñ")
        return s2


    # def create(
    #         self,
    #         db: Session,
    #         *,
    #         obj_in: PackCreate
    # ) -> Pack:

    #     obj_in_data = jsonable_encoder(obj_in)
    #     db_obj = self.model(
    #         **obj_in_data,
    #     )
    #     db.add(db_obj)
    #     db.commit()
    #     db.refresh(db_obj)

    #     return db_obj
    
    # def remove_pack(
    #     self, 
    #     db: Session,
    #     *, 
    #     id: str
    # ) -> Pack:
    #     obj = self.get_pack_by_id(db, id=id)
    #     db.delete(obj)
    #     db.commit()
    #     return obj


shipping = CRUDShipping(Shipping)