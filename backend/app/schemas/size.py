
from typing import Optional
from pydantic import BaseModel


class SizeBase( BaseModel ):
    size: str = None

class SizeCreate( SizeBase ):
    size: str = None

class SizeUpdate( SizeBase ):
    size: str = None

class SizeInDBBase( SizeBase ):
    id: int
    size: str = None

    class Config:
        orm_mode = True


class Size( SizeInDBBase ):
    size: str = None

class SizeInDB( SizeInDBBase ):
    pass