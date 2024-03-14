from typing import Optional
from pydantic import BaseModel


class ProductColorBase( BaseModel ):
    color_id: int = None
    product_id: int = None

class ProductColorCreate( ProductColorBase ):
    color_id: int = None
    product_id: int = None

class ProductColorUpdate( ProductColorBase ):
    color_id: int = None
    product_id: int = None

class ProductColorInDBBase( ProductColorBase ):
    id: int
    color_id: int = None
    product_id: int = None

    class Config:
        orm_mode = True

class ProductColor( ProductColorInDBBase ):
    color_id: int = None
    product_id: int = None

class ProductColorInDB( ProductColorInDBBase ):
    pass