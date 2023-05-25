from typing import Optional

from pydantic import BaseModel


class CategoryBase( BaseModel ):
    name: str = None

class CategoryCreate( CategoryBase ):
    pass

class CategoryInDBBase( CategoryBase ):
    id: Optional[ int ] = None
    
    class Config:
        orm_mode = True

class CategoryUpdate( CategoryBase ):
    pass

class Category(CategoryInDBBase):
    pass

class CategoryInDB( CategoryInDBBase ):
    pass