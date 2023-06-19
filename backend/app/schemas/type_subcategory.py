from typing import Optional
from pydantic import BaseModel


class TypeSubcategoryBase( BaseModel ):
    type_id: int = None
    subcategory_id: int = None

class TypeSubcategoryCreate( TypeSubcategoryBase ):
    pass

class TypeSubcategoryUpdate( TypeSubcategoryBase ):
    pass

class TypeSubcategoryInDBBase( TypeSubcategoryBase ):
    id: int


    class Config:
        orm_mode = True


class TypeSubcategory( TypeSubcategoryInDBBase ):
    pass

class TypeSubcategoryInDB( TypeSubcategoryInDBBase ):
    pass