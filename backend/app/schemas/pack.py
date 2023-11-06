from sqlite3 import Timestamp
from typing import Optional

from pydantic import BaseModel


class PackBase(BaseModel):
    name: str = None
    price: float = None
    image_url: str = None
    product_quantity: int = None
    state: bool = None
    discount: int = None
    description: str = None

class PackCreate(PackBase):
    pass
    

class PackUpdate(PackBase):
    pass
    

class PackInDBBase(PackBase):
    id: int
    name: str = None
    image_url: str = None
    price: float = None
    product_quantity: int = None
    state: bool = None
    discount: int = None
    description: str = None

    class Config:
        orm_mode = True


class Pack(PackInDBBase):
    name: str = None
    image_url: str = None
    price: float = None
    product_quantity: int = None
    state: bool = None
    discount: int = None
    description: str = None


class PackDB(PackInDBBase):
    pass
