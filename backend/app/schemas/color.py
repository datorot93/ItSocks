
from typing import Optional
from pydantic import BaseModel


class ColorBase( BaseModel ):
    name: str = None
    code: str = None

class ColorCreate( ColorBase ):
    name: str = None
    code: str = None

class ColorUpdate( ColorBase ):
    name: str = None
    code: str = None

class ColorInDBBase( ColorBase ):
    id: int
    name: str = None
    code: str = None

    class Config:
        orm_mode = True


class Color( ColorInDBBase ):
    name: str = None
    code: str = None

class ColorInDB( ColorInDBBase ):
    pass