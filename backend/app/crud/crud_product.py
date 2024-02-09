from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from sqlalchemy import select, inspect, func, over, asc, desc
from sqlalchemy.orm import join

from .crud_shipping import unaccent

from fastapi.encoders import jsonable_encoder


# MODELS
from app.crud.base import CRUDBase
from app.models.product import Product
from app.models.subcategory import Subcategory
from app.models.category import Category
from app.models.type import Type
from app.models.design import Design
from app.models.image import Image
from app.models.tag import Tag
from app.models.tag_product import TagProduct
from app.models.product_color import ProductColor
from app.models.product_size import ProductSize
from app.models.color import Color
from app.models.size import Size

# SCHEMAS
from app.schemas.product import ProductCreate, ProductUpdate
from app.schemas.color import ColorCreate, ColorUpdate
from app.schemas.size import SizeCreate, SizeUpdate
from app.schemas.product_color import ProductColorCreate, ProductColorUpdate
from app.schemas.product_size import ProductSizeCreate, ProductSizeUpdate

from unidecode import unidecode

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
    

    def get_product_by_id(
        self, 
        db: Session, 
        *, 
        id: int
    ):  
        print('ESTE ES EL PRODUCTO')
        print(db.query(Product).filter(
            Product.id == id
        ))
        return db.query(Product).filter(
            Product.id == id
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
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                Product.state == True).offset(skip).limit(limit).all()

        product_images = db.query(
            Image.url,
            Image.id_product
        ).\
        join(Product, Product.id == Image.id_product).\
        join(Subcategory, Product.id_subcategory == Subcategory.id).\
        join(Category, Category.id == Subcategory.id_category).\
        filter(
            unaccent(func.lower(Category.name)) == unidecode(category.strip().lower())
        ).\
        all()


        lista_productos = self._get_product_list(
            products=products,
            product_images=product_images
        )
        
        return lista_productos
    
    def get_products_by_category_design(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        category: str,
        design: str,
    ):

        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
                Product.state == True).offset(skip).limit(limit).all()

        product_images = db.query(
            Image.url,
            Image.id_product
        ).\
        join(Product, Product.id == Image.id_product).\
        join(Subcategory, Product.id_subcategory == Subcategory.id).\
        join(Category, Category.id == Subcategory.id_category).\
        filter(
            unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
            unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
            Product.state == True            
        ).\
        all()


        lista_productos = self._get_product_list(
            products=products,
            product_images=product_images
        )
        
        return lista_productos
    
    def _get_product_list(self, products, product_images):
        product_list = []

        selected_fields = [
            'id',
            'name', 
            'code', 
            'price', 
            'compresion', 
            'quantity', 
            'description', 
            'discount', 
            'category_discount', 
            'subcategory_discount', 
            'category', 
            'subcategory', 
            'type', 
            'design', 
            'images'
        ]

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
            product_dict = {key: product_dict[key] for key in selected_fields}
            product_list.append(product_dict)

        lista_productos = self.eliminar_repetidos(product_list)
        return lista_productos

    def get_products_by_subcat_cat(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        category: str,
        subcategory: str
    ):
            
            products = db.query(
                    Product.id,
                    Product.name,
                    Product.code,
                    Product.price,
                    Product.compresion,
                    Product.quantity,
                    Product.description,
                    Product.discount,
                    Category.discount.label('category_discount'),
                    Subcategory.discount.label('subcategory_discount'),
                    Category.name.label('category'),
                    Subcategory.name.label('subcategory'),
                    Type.name.label('type'),
                    Design.name.label('design'),
                ).\
                join(Subcategory, Subcategory.id == Product.id_subcategory).\
                join(Category, Category.id == Subcategory.id_category).\
                join(Type, Type.id == Product.id_type).\
                join(Design, Design.id == Product.id_design).\
                filter(
                    Product.state == True,
                    unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                    unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower())
                ).offset(skip).limit(limit).all()
    
            product_images = db.query(
                Image.url,
                Image.id_product
            ).\
            join(Product, Product.id == Image.id_product).\
            join(Subcategory, Product.id_subcategory == Subcategory.id).\
            join(Category, Category.id == Subcategory.id_category).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower())
            ).\
            all()
    
            lista_productos = self._get_product_list(
                products=products,
                product_images=product_images
            )
            
            return lista_productos
    
    def get_products_by_cat_subcat_type(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        category: str,
        subcategory: str,
        type: str,
    ):
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        
        product_images = db.query(
                Image.url,
                Image.id_product
            ).\
            join(Product, Product.id == Image.id_product).\
            join(Subcategory, Product.id_subcategory == Subcategory.id).\
            join(Category, Category.id == Subcategory.id_category).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower())
            ).\
        all()

        lista_productos = self._get_product_list(
                products=products,
                product_images=product_images
            )
            
        return lista_productos
    

    def get_products_by_cat_type(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        category: str,
        type: str,
    ):
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        
        product_images = db.query(
                Image.url,
                Image.id_product
            ).\
            join(Product, Product.id == Image.id_product).\
            join(Subcategory, Product.id_subcategory == Subcategory.id).\
            join(Category, Category.id == Subcategory.id_category).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower())
            ).\
        all()

        lista_productos = self._get_product_list(
                products=products,
                product_images=product_images
            )
            
        return lista_productos
    
    def get_products_by_cat_type_design(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        category: str,
        type: str,
        design: str,
    ):
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        
        product_images = db.query(
                Image.url,
                Image.id_product
            ).\
            join(Product, Product.id == Image.id_product).\
            join(Subcategory, Product.id_subcategory == Subcategory.id).\
            join(Category, Category.id == Subcategory.id_category).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower())
            ).\
        all()

        lista_productos = self._get_product_list(
                products=products,
                product_images=product_images
            )
            
        return lista_productos

    
    def get_products_by_cat_subcat_type_design(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        category: str,
        subcategory: str,
        type: str,
        design: str,
    ):
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        
        product_images = db.query(
                Image.url,
                Image.id_product
            ).\
            join(Product, Product.id == Image.id_product).\
            join(Subcategory, Product.id_subcategory == Subcategory.id).\
            join(Category, Category.id == Subcategory.id_category).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower())
            ).\
        all()

        lista_productos = self._get_product_list(
                products=products,
                product_images=product_images
            )
            
        return lista_productos
    

    def get_products_by_cat_subcat_type_design_compresion(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        category: str,
        subcategory: str,
        type: str,
        design: str,
        compresion: bool,
    ):
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
                Product.compresion == compresion,
                Product.state == True,
            ).offset(skip).limit(limit).all()
        
        product_images = db.query(
                Image.url,
                Image.id_product
            ).\
            join(Product, Product.id == Image.id_product).\
            join(Subcategory, Product.id_subcategory == Subcategory.id).\
            join(Category, Category.id == Subcategory.id_category).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
                Product.compresion == compresion,
                Product.state == True,
            ).\
        all()

        lista_productos = self._get_product_list(
                products=products,
                product_images=product_images
            )
            
        return lista_productos
    

    def get_products_by_cat_type_design_compresion(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        category: str,
        type: str,
        design: str,
        compresion: bool,
    ):
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
                Product.compresion == compresion,
                Product.state == True,
            ).offset(skip).limit(limit).all()
        
        product_images = db.query(
                Image.url,
                Image.id_product
            ).\
            join(Product, Product.id == Image.id_product).\
            join(Subcategory, Product.id_subcategory == Subcategory.id).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
                Product.compresion == compresion,
                Product.state == True,
            ).\
        all()

        lista_productos = self._get_product_list(
                products=products,
                product_images=product_images
            )
            
        return lista_productos

    
    def get_designs_by_cat_subcat(
            self,
            db: Session,
            *,
            category: str,
            subcategory: str,
            type: str,
    ):
        products_design = db.query(
                Product.id,
                Design.name.label('design')
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower()),
                Product.state == True,
            ).all()
        
        return {item['design']: False for item in products_design}
    
        
    def get_designs_by_cat_type(
            self,
            db: Session,
            *,
            category: str,
            type: str,
    ):
        products_design = db.query(
                Product.id,
                Design.name.label('design')
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                Product.state == True,
            ).all()
        
        return {item['design']: False for item in products_design}
    
    def get_subcategory_by_tag(
            self,
            db: Session,
            *,
            tag: str,
    ):
        products_design = db.query(
                Product.id,
                Subcategory.name.label('subcategory')
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            join(TagProduct, TagProduct.product_id == Product.id).\
            join(Tag, Tag.id == TagProduct.tag_id).\
            filter(
                unaccent(func.lower(Tag.name)) == unidecode(tag.strip().lower()),
                Product.state == True,
            ).all()
        
        return {item['subcategory']: False for item in products_design}
    
    def get_type_by_tag(
            self,
            db: Session,
            *,
            tag: str,
    ):
        products_design = db.query(
                Product.id,
                Type.name.label('type')
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            join(TagProduct, TagProduct.product_id == Product.id).\
            join(Tag, Tag.id == TagProduct.tag_id).\
            filter(
                unaccent(func.lower(Tag.name)) == unidecode(tag.strip().lower()),
                Product.state == True,
            ).all()
        
        return {item['type']: False for item in products_design}
    

    def get_accesorios_designs(
            self,
            db: Session,
            *,
            category: str
    ):
        products_design = db.query(
                Product.id,
                Subcategory.name.label('subcategory')
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                Product.state == True,
            ).all()
        
        return {item['subcategory']: False for item in products_design}


    def eliminar_repetidos(self, lista_diccionarios):
        lista = []
        for diccionario in lista_diccionarios:
            if diccionario['name'] not in self.get_names_products_query(lista):
                lista.append(diccionario)
    
        return lista
    
    def get_names_products_query(self, lista_productos):
        lista_nombres = []
        for producto in lista_productos:
            lista_nombres.append(producto['name'])
        return lista_nombres


    def get_products_by_name(
        self,
        db: Session,
        *,
        name: str,
        
    ):
        """
        Get all products by name
        """
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.color,
                Product.talla,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount
            ).\
            filter(unaccent(func.lower(Product.name)) == unidecode(name.strip().lower())).all()

        return products
    
    def get_products_by_name_type(
        self,
        db: Session,
        *,
        name: str,
        type: str,
        
    ):
        """
        Get all products by name
        """
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.color,
                Product.talla,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount
            ).\
            join(Type, Type.id == Product.id_type).\
            filter(
                unaccent(func.lower(Product.name)) == unidecode(name.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower())
            ).all()

        return products
    
    def get_product_by_name_subcat_type(
        self,
        db: Session,
        *,
        name: str,
        subcategory: str,
        type: str,
    ):
        """
        Get all products by name_subcategory_type
        """
        product = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.color,
                Product.talla,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Type, Type.id == Product.id_type).\
            filter(
                unaccent(func.lower(Product.name)) == unidecode(name.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower())
            ).first()

        return product
    
    def get_product_by_tag(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        tag: str,
    ):
        
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            join(TagProduct, TagProduct.product_id == Product.id).\
            join(Tag, Tag.id == TagProduct.tag_id).\
            filter(
                unaccent(func.lower(Tag.name)) == unidecode(tag.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        
        product_images = db.query(
                Image.url,
                Image.id_product
            ).\
            join(Product, Product.id == Image.id_product).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            join(TagProduct, TagProduct.product_id == Product.id).\
            join(Tag, Tag.id == TagProduct.tag_id).\
            filter(
                unaccent(func.lower(Tag.name)) == unidecode(tag.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        

        lista_productos = self._get_product_list(
                products=products,
                product_images=product_images
            )
            
        return lista_productos
    

    def get_products_by_tag_type(
            self,
            db: Session,
            *,
            tag: str,
            type: str,
            skip: int,
            limit: int,
    ):
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            join(TagProduct, TagProduct.product_id == Product.id).\
            join(Tag, Tag.id == TagProduct.tag_id).\
            filter(
                unaccent(func.lower(Tag.name)) == unidecode(tag.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        
        product_images = db.query(
                Image.url,
                Image.id_product
            ).\
            join(Product, Product.id == Image.id_product).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            join(TagProduct, TagProduct.product_id == Product.id).\
            join(Tag, Tag.id == TagProduct.tag_id).\
            filter(
                unaccent(func.lower(Tag.name)) == unidecode(tag.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        

        lista_productos = self._get_product_list(
                products=products,
                product_images=product_images
            )
            
        return lista_productos
    
    
    def get_products_by_tag_subcategory(
            self,
            db: Session,
            *,
            tag: str,
            subcategory: str,
            skip: int,
            limit: int,
    ):
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            join(TagProduct, TagProduct.product_id == Product.id).\
            join(Tag, Tag.id == TagProduct.tag_id).\
            filter(
                unaccent(func.lower(Tag.name)) == unidecode(tag.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        
        product_images = db.query(
                Image.url,
                Image.id_product
            ).\
            join(Product, Product.id == Image.id_product).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            join(TagProduct, TagProduct.product_id == Product.id).\
            join(Tag, Tag.id == TagProduct.tag_id).\
            filter(
                unaccent(func.lower(Tag.name)) == unidecode(tag.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        

        lista_productos = self._get_product_list(
                products=products,
                product_images=product_images
            )
            
        return lista_productos
    

    def get_product_by_design(
        self,
        db: Session,
        *,
        skip: int,
        limit: int,
        design: str,
    ):
        products = db.query(
                Product.id,
                Product.name,
                Product.code,
                Product.price,
                Product.compresion,
                Product.quantity,
                Product.description,
                Product.discount,
                Category.discount.label('category_discount'),
                Subcategory.discount.label('subcategory_discount'),
                Category.name.label('category'),
                Subcategory.name.label('subcategory'),
                Type.name.label('type'),
                Design.name.label('design'),
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        
        product_images = db.query(
                Image.url,
                Image.id_product
            ).\
            join(Product, Product.id == Image.id_product).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            join(TagProduct, TagProduct.product_id == Product.id).\
            join(Tag, Tag.id == TagProduct.tag_id).\
            filter(
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
                Product.state == True,
            ).offset(skip).limit(limit).all()
        

        lista_productos = self._get_product_list(
                products=products,
                product_images=product_images
            )
            
        return lista_productos
    
    def clave_personalizada(self, elemento):
        return int(elemento.split("-")[0])
    
    def get_colors_tallas_by_product(
        self, 
        db: Session, 
        *, 
        name: str,
        type: str,
    ):
        """
        Get all colors by product name
        """
        colors = db.query(
                Color.name,
            ).\
            join(ProductColor, ProductColor.color_id == Color.id).\
            join(Product, Product.id == ProductColor.product_id).\
            join(Type, Type.id == Product.id_type).\
            filter(
                unaccent(func.lower(Product.name)) == unidecode(name.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),

            ).distinct().all()
        
        products = [{"colores": [item["name"] for item in colors]}]

        tallas = db.query(
            Size.size
        ).\
        join(ProductSize, ProductSize.size_id == Size.id).\
        join(Product, Product.id == ProductSize.product_id).\
        join(Type, Type.id == Product.id_type).\
        filter(
            unaccent(func.lower(Product.name)) == unidecode(name.strip().lower()),
            unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
        ).distinct().order_by(Size.size).all()
        
        products[0]["size"] = [ item[0] for item in tallas ]

        products[0]["size"] = sorted(products[0]["size"], key=self.clave_personalizada)

        return products
    

    def get_compresion_filters(
        self, 
        db: Session, 
        *, 
        category: str,
        subcategory: str,
        type: str,
        design: str,
    ):
        """
        Get compresion filters
        """
        compresion_filters = db.query(
                Product.compresion,
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Subcategory.name)) == unidecode(subcategory.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
                Product.state == True,

            ).distinct().all()
        
        products = {
            "compresion_filters": [
                'Medias de compresión' if item[0] == True else 'Medias sin compresión' for item in compresion_filters
            ]
        }

        return products
    

    def get_pack_compresion_filters(
        self, 
        db: Session, 
        *, 
        category: str,
        type: str,
        design: str,
    ):
        """
        Get compresion filters
        """
        compresion_filters = db.query(
                Product.compresion,
            ).\
            join(Subcategory, Subcategory.id == Product.id_subcategory).\
            join(Category, Category.id == Subcategory.id_category).\
            join(Type, Type.id == Product.id_type).\
            join(Design, Design.id == Product.id_design).\
            filter(
                unaccent(func.lower(Category.name)) == unidecode(category.strip().lower()),
                unaccent(func.lower(Type.name)) == unidecode(type.strip().lower()),
                unaccent(func.lower(Design.name)) == unidecode(design.strip().lower()),
                Product.state == True,

            ).distinct().all()
        
        products = {
            "compresion_filters": [
                'Medias de compresión' if item[0] == True else 'Medias sin compresión' for item in compresion_filters
            ]
        }

        return products
    

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