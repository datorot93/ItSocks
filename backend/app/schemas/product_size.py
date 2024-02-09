from typing import Optional
from pydantic import BaseModel


class ProductSizeBase( BaseModel ):
    size_id: int = None
    product_id: int = None

class ProductSizeCreate( ProductSizeBase ):
    size_id: int = None
    product_id: int = None

class ProductSizeUpdate( ProductSizeBase ):
    size_id: int = None
    product_id: int = None

class ProductSizeInDBBase( ProductSizeBase ):
    id: int
    size_id: int = None
    product_id: int = None

    class Config:
        orm_mode = True

class ProductSize( ProductSizeInDBBase ):
    size_id: int = None
    product_id: int = None

class ProductSizeInDB( ProductSizeInDBBase ):
    pass