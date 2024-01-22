from typing import Optional
from pydantic import BaseModel


class TagProductBase( BaseModel ):
    tag_id: int = None
    product_id: int = None

class TagProductCreate( TagProductBase ):
    tag_id: int = None
    product_id: int = None

class TagProductUpdate( TagProductBase ):
    tag_id: int = None
    product_id: int = None

class TagProductInDBBase( TagProductBase ):
    id: int
    tag_id: int = None
    product_id: int = None

    class Config:
        orm_mode = True

class TagProduct( TagProductInDBBase ):
    tag_id: int = None
    product_id: int = None

class TagProductInDB( TagProductInDBBase ):
    pass