from typing import Optional
from pydantic import BaseModel


class DesignBase( BaseModel ):
    name: str = None
    code: str = None

class DesignCreate( DesignBase ):
    pass

class DesignUpdate( DesignBase ):
    pass

class DesignInDBBase( DesignBase ):
    id: Optional[ int ] = None

    class Config:
        orm_mode = True


class Design( DesignInDBBase ):
    pass

class DesignInDB( DesignInDBBase ):
    pass