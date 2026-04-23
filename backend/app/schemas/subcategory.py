from typing import Optional

from pydantic import BaseModel


class SubcategoryBase( BaseModel ):
    pass

class SubcategoryCreate( SubcategoryBase ):
    id_category: int
    code: str 
    name: str
    discount: int = 0
    image_url: str = ''
    priority: int = 0

class SubcategoryInDBBase( SubcategoryBase ):
    id: Optional[ int ] = None
    id_category: Optional[ int ] = None
    code: Optional[ str ] = None
    name: Optional[ str ] = None
    discount: Optional[ int ] = 0
    image_url: Optional[ str ] = None
    priority: int = 0

    
    class Config:
        orm_mode = True

class SubcategoryUpdate( SubcategoryBase ):
    id_category: Optional[int] = None
    code: Optional[str] = None
    name: Optional[str] = None
    discount: Optional[int] = 0
    image_url: Optional[str] = None
    priority: int = 0

class Subcategory(SubcategoryInDBBase):
    id_category: Optional[ int ] = None
    name: Optional[ str ] = None
    code: Optional[ str ] = None
    discount: Optional[ int ] = 0
    image_url: Optional[ str ] = None
    priority: int = 0

class SubcategoryInDB( SubcategoryInDBBase ):
    pass