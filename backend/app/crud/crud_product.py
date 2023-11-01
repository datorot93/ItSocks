from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from sqlalchemy import select, inspect
from sqlalchemy.orm import join

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.product import Product
from app.models.subcategory import Subcategory
from app.models.category import Category
from app.models.type import Type
from app.models.design import Design
from app.models.image import Image
from app.schemas.product import ProductCreate, ProductUpdate

class CRUDProduct(CRUDBase[Product, ProductCreate, ProductUpdate]):
    
    def get_product(
        self, 
        db: Session, 
        *, 
        name: str,
        talla: str,
        compresion: bool,
        color: str
    ):

        return db.query(Product).filter(
            Product.color == color, Product.name == name, Product.talla == talla, Product.compresion == compresion
        ).first()
    
    def object_as_dict(self, obj):
        return {c.key: getattr(obj, c.key)
                for c in inspect(obj).mapper.column_attrs}

    def get_products_by_category(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        category: str,
        
    ):
        products = db.query(
                Product.id,
                Product.name,
                Product.price,
                Product.color,
                Product.talla,
                Product.compresion,
                Product.quantity,
                Product.description,
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design')
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(Category.name == category).offset(skip).limit(limit).all()
        # print(products)
        product_images = db.query(
            Image.url,
            Image.id_product
        ).\
        join(Product, Product.id == Image.id_product).\
        join(Subcategory, Product.id_subcategory == Subcategory.id).\
        join(Category, Category.id == Subcategory.id_category).\
        filter(Category.name == category).\
        all()

        product_list = []
        for product in products:
            image_index = 1
            images = {}
            product_dict = product._asdict()
            for image in product_images:
                image_dict = image._asdict()
                
                if product_dict['id'] == image_dict['id_product']:
                    images[f'image{image_index}'] = image_dict['url']
                    image_index = image_index + 1
            product_dict['images'] = images
            product_list.append(product_dict)
        
        return product_list
    

    def get_products_by_name(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        name: str,    
    ):
        products = db.query(
                Product.id,
                Product.name,
                Product.price,
                Product.color,
                Product.talla,
                Product.compresion,
                Product.quantity,
                Product.description,
                Category.name.label('category'),
                Subcategory.name.label('subcategory')
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            filter(Product.name == name).offset(skip).limit(limit).all()
        # print(products)
        product_images = db.query(
            Image.url,
            Image.id_product
        ).\
        join(Product, Product.id == Image.id_product).\
        join(Subcategory, Product.id_subcategory == Subcategory.id).\
        join(Category, Category.id == Subcategory.id_category).\
        filter(Product.name == name).\
        all()

        product_list = []
        for product in products:
            image_index = 1
            images = {}
            product_dict = product._asdict()
            for image in product_images:
                image_dict = image._asdict()
                
                if product_dict['id'] == image_dict['id_product']:
                    images[f'image{image_index}'] = image_dict['url']
                    image_index = image_index + 1
            product_dict['images'] = images
            product_list.append(product_dict)
        
        return product_list
    

    def create(
            self,
            db: Session,
            *,
            obj_in: ProductCreate
    ) -> Product:

        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(
            **obj_in_data, 
            
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    def remove_product(
        self, 
        db: Session, 
        *, 
        code: str
    ) -> Product:
        obj = self.get_by_code(db, code=code)
        db.delete(obj)
        db.commit()
        return obj


product = CRUDProduct(Product)