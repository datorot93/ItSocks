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
from unidecode import unidecode

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
        
        lista_departamentos = [item["municipio_ciudad"] for item in shipping_municipios]

        result = {
                "municipio_ciudad": lista_departamentos
            }
        
        return result
    
    def get_shipping_departamentos(
        self,
        db: Session,
        *,
        skip: int,
        limit: 100
    ):
        shipping_departamentos = db.query(
                Shipping.departamento
            ).order_by(Shipping.departamento).distinct().all()
        
        lista_departamentos = [item["departamento"] for item in shipping_departamentos]

        result = {
                "departamentos": lista_departamentos
            }
        
        
        return result
    
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
                unaccent(func.lower(Shipping.departamento)) == unidecode(departamento.lower())
            ).order_by(Shipping.municipio_ciudad).distinct().all()
        
        lista_departamentos = [item["municipio_ciudad"] for item in shipping_municipios]

        result = {
                "municipio_ciudad": lista_departamentos
            }
        
        return result
    
    def get_shipping_cost(
        self,
        db: Session,
        departamento,
        municipio_ciudad,
        *,
        skip: int,
        limit: int
    ):
        shipping_cost = db.query(
                Shipping.tarifa
            ).filter(
                unaccent(func.lower(Shipping.departamento)) == unidecode(departamento.lower()),
                unaccent(func.lower(Shipping.municipio_ciudad)) == unidecode(municipio_ciudad.lower())
            ).first()
        
        print(shipping_cost)
        
        return shipping_cost


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