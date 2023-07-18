from typing import Optional

from pydantic import BaseModel


class SubcategoryBase( BaseModel ):
    code: str = None
    name: str = None

class SubcategoryCreate( SubcategoryBase ):
    pass

class SubcategoryInDBBase( SubcategoryBase ):
    id: Optional[ int ] = None
    id_category: Optional[ int ] = None
    name: Optional[ str ] = None

    
    class Config:
        orm_mode = True

class SubcategoryUpdate( SubcategoryBase ):
    id_category: Optional[ int ] = None

class Subcategory(SubcategoryInDBBase):
    id_category: Optional[ int ] = None
    name: Optional[ str ] = None

class SubcategoryInDB( SubcategoryInDBBase ):
    pass