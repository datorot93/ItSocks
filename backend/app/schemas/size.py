
from typing import Optional
from pydantic import BaseModel


class SizeBase( BaseModel ):
    size: str = None

class SizeCreate( SizeBase ):
    pass

class SizeUpdate( SizeBase ):
    pass

class SizeInDBBase( SizeBase ):
    id: int

    class Config:
        orm_mode = True


class Size( SizeInDBBase ):
    pass

class SizeInDB( SizeInDBBase ):
    pass