from typing import Optional
from pydantic import BaseModel


class CategoryBase( BaseModel ):
    nombre: str = None

class CategoryCreate( CategoryBase ):
    nombre: str

class CategoryUpdate( CategoryBase ):
    nombre: str

class CategoryInDBBase( CategoryBase ):
    id: Optional[ int ] = None

    class Config:
        orm_mode: True

class Category( CategoryInDBBase ):
    pass

class CategoryInDB( CategoryInDBBase ):
    pass