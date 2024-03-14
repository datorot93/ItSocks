from typing import Optional
from pydantic import BaseModel


class TagBase( BaseModel ):
    name: str = None
    image_url: str = None
    discount: float = 0

class TagCreate( TagBase ):
    name: str = None
    image_url: str = None
    discount: float = 0

class TagUpdate( TagBase ):
    name: str = None
    image_url: str = None
    discount: float = 0

class TagInDBBase( TagBase ):
    id: int
    name: str = None
    image_url: str = None
    discount: float = 0

    class Config:
        orm_mode = True


class Tag( TagInDBBase ):
    name: str = None
    image_url: str = None
    discount: float = 0

class TagInDB( TagInDBBase ):
    pass