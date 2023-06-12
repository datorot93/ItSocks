from typing import Optional

from pydantic import BaseModel


class TypeBase( BaseModel ):
    name: str = None
    code: str = None

class TypeCreate( TypeBase ):
    pass

class TypeUpdate( TypeBase ):
    pass

class TypeInDBBase( TypeBase ):
    id: Optional[ int ] = None

    class Config:
        orm_mode = True


class Type( TypeInDBBase ):
    pass

class TypeInDB( TypeInDBBase ):
    pass