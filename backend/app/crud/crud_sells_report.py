from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session
from sqlalchemy import select, inspect, func, over, asc, desc

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.order import Order
from app.models.size import Size
from app.models.product_size import ProductSize
from app.schemas.order import OrderCreate, OrderUpdate

from app.models.product_order import ProductOrder
from app.models.product import Product  # Añadir este import al inicio del archivo

# Add new imports
from app.models.type import Type
from app.models.subcategory import Subcategory
from app.models.design import Design

class CRUDSellsReport(CRUDBase[Order, OrderCreate, OrderUpdate]):
    
    def get_order_by_name(
        self, 
        db: Session, 
        *, 
        name: str 
    ):
        return db.query(Order).filter(Order.name == name).first()
    
    def get_orders(
        self, 
        db: Session, 
        *, 
        skip: int,
        limit: int,
    ):

        orders = db.query(Order).offset(skip).limit(limit).all()

        return orders
    
    def get_products_by_city(
        self,
        db: Session,  # Changed from df to db
        *,
        filters: dict = {},
        sort = None,
        skip,
        limit,
        range = None
    ):
        
        """
        Get sells reports grouped by city
        """
        results = db.query(
            Order.city,
            func.sum(Order.quantity).label('quantity'),
            func.count(Order.id).label('orders')
        ).group_by(Order.city).all()
        
        # Convert results to list of dictionaries
        return [
            {
                'city': row.city,
                'quantity': int(row.quantity),  # Convert Decimal to float
                'orders': row.orders
            }
            for row in results
        ]
    
    def get_product_selled_quantity(
        self,
        db: Session,  # Changed from df to db
        *,
        filters: dict = {},
        sort = None,
        skip,
        limit,
        range = None
    ):
        ...
    
    def get_products_sum(
        self,
        db: Session,
        *,
        filters: dict = {},
        skip: int = 0,
        limit: int = 100
    ):
        """
        Get sum of products grouped by product name
        """
        results = (
            db.query(
                Product.name,
                func.count(ProductOrder.product_id)
            )
            .select_from(Product)
            .join(ProductOrder, ProductOrder.product_id == Product.id)
            .join(Order, Order.id == ProductOrder.order_id)
            .group_by(Product.name)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
        return [
            {
                'name': name,
                'sum': int(total)
            }
            for name, total in results
        ]
    
    def object_as_dict(self, obj):
        return {c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs}    
    
    def get_by_code(
        self,
        db: Session,
        *,
        code: str
    ):
        return db.query(Order).filter(Order.code == code).first()
    
    def get_single_order(
        self,
        db: Session,
        *,
        id: int
    ):
        my_order = db.query(Order).filter(Order.id == id).first()

        # print(my_order.product_order)

        return my_order
    

    def get_order_list(
        self,
        db: Session,
        *,
        skip: int,
        limit: int
    ):
        return db.query(Order).offset(skip).limit(skip).all()
    
    # def create(
    #         self,
    #         db: Session,
    #         *,
    #         obj_in: OrderCreate
    # ) -> Order:
    #     print('*'*100)
    #     print(obj_in)
    #     obj_in_data = jsonable_encoder(obj_in)
    #     db_obj = self.model(
    #         **obj_in_data, 
    #     )
    #     db.add(db_obj)
    #     db.commit()
    #     db.refresh(db_obj)

    #     return db_obj
    
    def remove_order(
        self, 
        db: Session, 
        *, 
        code: str
    ) -> Order:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj

    def get_detailed_orders(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        filters: dict = {}
    ):
        query = (
            db.query(
                Order.id,
                Order.created_at.label('fecha_orden'),
                Order.first_name,
                Order.last_name,
                Order.address,
                Order.phone_number,
                Order.billing_addess,
                Order.country,
                Order.region,
                Order.city,
                Order.document,
                Order.email,
                Order.extra_info,
                Order.de,
                Order.para,
                Order.isGift,
                Order.state,
                Product.price,
                ProductOrder.quantity,
                (ProductOrder.quantity * Product.price).label('subtotal'),
                Order.shipping_cost.label('costo_envio'),
                Order.total,
                Product.name.label('nombre_producto'),
                ProductOrder.size,
                Product.compresion,
                Subcategory.name.label('subcategoria'),
                Type.name.label('tipo'),
                ProductOrder.num_in_order,
                Design.name.label('disenio')
            )
            .select_from(Order)
            .join(ProductOrder, Order.id == ProductOrder.order_id)
            .join(Product, ProductOrder.product_id == Product.id)
            .join(Type, Product.id_type == Type.id)
            .join(Subcategory, Product.id_subcategory == Subcategory.id)
            .join(Design, Product.id_design == Design.id)
            .order_by(asc(Order.id))
        )
        # Apply date filters if they exist
        if "from_date" in filters:
            query = query.filter(Order.created_at >= filters["from_date"])
        if "to_date" in filters:
            query = query.filter(Order.created_at <= filters["to_date"])

        results = query.offset(skip).limit(limit).all()
        print(results)
        
        return [
            {
                'id': row.id,
                'first_name': row.first_name,
                'last_name': row.last_name,
                'address': row.address,
                'phone_number': row.phone_number,
                'billing_addess': row.billing_addess,
                'country': row.country,
                'region': row.region,
                'city': row.city,
                'document': row.document,
                'email': row.email,
                'extra_info': row.extra_info,
                'de': row.de,
                'para': row.para,
                'isGift': row.isGift,
                'state': row.state,
                'quantity': row.quantity,
                'valor_unitario': float(row.price),
                'costo_envio': float(row.costo_envio),
                'subtotal': float(row.subtotal),
                'total': float(row.total),
                'fecha_orden': row.fecha_orden,
                'nombre_producto': row.nombre_producto,
                'size': row.size,
                'compresion': row.compresion,
                'subcategoria': row.subcategoria,
                'num_en_orden': row.num_in_order,
                'tipo': row.tipo,
                'disenio': row.disenio
            }
            for row in results
        ]
    
    
sells_report = CRUDSellsReport(Order)
