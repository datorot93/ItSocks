from typing import Optional
from pydantic import BaseModel


class TypeImageBase( BaseModel ):
    name: str
    category: str
    subcategory: str
    description: str = ""
    alt: str = ""
    image_url: str

class TypeImageCreate( TypeImageBase ):
    pass

class TypeImageIn( BaseModel ):
    pass

class TypeImageUpdate( TypeImageBase ):
    pass

class TypeImageInDBBase( TypeImageBase ):
    id: Optional[ int ] = None

    class Config:
        orm_mode = True


class TypeImage( TypeImageInDBBase ):
    pass

class TypeImageInDB( TypeImageInDBBase ):
    pass