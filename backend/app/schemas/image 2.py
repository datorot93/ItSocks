from typing import Optional
from pydantic import BaseModel


class ImageBase( BaseModel ):
    id_product: int = None
    url: str

class ImageCreate( ImageBase ):
    id_product: int = None
    url: str = None

class ImageUpdate( ImageBase ):
    id_product: int = None

class ImageInDBBase( ImageBase ):
    id: Optional[ int ] = None
    id_product: Optional[ int ]
    url: Optional[ str ]

    class Config:
        orm_mode = True


class Image( ImageInDBBase ):
    id_product: Optional[int]
    url: Optional[str]

class ImageInDB( ImageInDBBase ):
    pass