from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session
from sqlalchemy import select, inspect, func, over, asc, desc

from app.crud.base import CRUDBase
from app.models.product import Product
from app.models.subcategory import Subcategory
from app.models.type import Type
from app.schemas.product import ProductCreate, ProductUpdate

from .crud_shipping import unaccent


class CRUDBulkPrice(CRUDBase[Product, ProductCreate, ProductUpdate]):
    
    def get_subcategory_type_price(
        self, 
        db: Session, 
        *, 
        subcategory: str,
        type: str
    ):
        query = (
            
            db.query(
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Product.price,
            ).select_from(Product)
            .join(Subcategory, Product.id_subcategory == Subcategory.id)
            .join(Type, Product.id_type == Type.id)
            .filter(
                unaccent(func.lower(Subcategory.name)) == subcategory.lower(),
                unaccent(func.lower(Type.name)) == type.lower()
            ).distinct().all()
        )
        
        return query
    
    def get_all_sub_type_prices(
        self, 
        db: Session
    ):
        query = (
            db.query(
                Subcategory.name.label('subcategory'),
                Type.name.label('type')
            ).select_from(Product)
            .join(Subcategory, Product.id_subcategory == Subcategory.id)
            .join(Type, Product.id_type == Type.id)
            .distinct().order_by(Subcategory.name).all()
        )
        
        return query
    
    def update_prices(
        self, 
        db: Session, 
        *, 
        subcategory: str,
        type: str,
        price: float
    ):
        """
        Update all the prices of the products based on the subcategory and type which are passed
        as parameters
        """
        # Primero identificamos los IDs de los productos que queremos actualizar
        subquery = (
            db.query(Product.id)
            .join(Subcategory, Product.id_subcategory == Subcategory.id)
            .join(Type, Product.id_type == Type.id)
            .filter(
                unaccent(func.lower(Subcategory.name)) == subcategory.lower(),
                unaccent(func.lower(Type.name)) == type.lower()
            )
        )
        
        # Luego hacemos el update usando el subquery para los IDs, sin joins en la operación de update
        result = (
            db.query(Product)
            .filter(Product.id.in_(subquery))
            .update(
                {Product.price: price},
                synchronize_session=False  # Importante para evitar problemas de sincronización
            )
        )
        
        db.commit()
        
        return {"updated_count": result}
    
    
bulk_price = CRUDBulkPrice(Product)
