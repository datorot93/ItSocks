from sqlite3 import Timestamp
from typing import Optional

from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str = None
    talla: str = None
    price: str = None
    state: bool = None
    color: str = None
    description: str = None
    compresion: bool = None
    quantity: int = None


class ProductCreate(ProductBase):
    id_design: Optional[int]
    id_type: Optional[int]
    id_subcategory: Optional[int]


class ProductUpdate(ProductBase):
    id_design: Optional[int]
    id_type: Optional[int]
    id_subcategory: Optional[int]
    

class ProductInDBBase(ProductBase):
    id: int
    name: str = None
    talla: str = None
    price: str = None
    state: bool = None
    color: str = None
    compresion: bool = None
    quantity: int = None
    description: str = None
    id_design: Optional[int]
    id_type: Optional[int]
    id_subcategory: Optional[int]

    class Config:
        orm_mode = True


class Product(ProductInDBBase):
    name: str = None
    talla: str = None
    price: str = None
    state: bool = None
    color: str = None
    compresion: bool = None
    quantity: int = None
    description: str = None
    id_design: Optional[int]
    id_type: Optional[int]
    id_subcategory: Optional[int]


class ProductDB(ProductInDBBase):
    pass
