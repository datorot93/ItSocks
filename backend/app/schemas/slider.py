from typing import Optional
from pydantic import BaseModel


class SliderBase( BaseModel ):
    link: str = ""
    description: str
    alt: str
    url: str
    state: bool

class SliderCreate( SliderBase ):
    link: str = ""
    description: str = ""
    alt: str = ""
    url: str = ""
    state: bool = True

class SliderIn( BaseModel ):
    link: str = ""
    description: str
    alt: str
    state: bool

class SliderUpdate( SliderBase ):
    link: str = ""
    description: str
    alt: str
    url: str
    state: bool

class SliderInDBBase( SliderBase ):
    id: Optional[ int ] = None
    link: Optional[str]
    description: Optional[str]
    alt: Optional[str]
    url: str
    state: bool

    class Config:
        orm_mode = True


class Slider( SliderInDBBase ):
    link: Optional[str] = None
    description: Optional[str] = None
    alt: Optional[str] = None
    url: str
    state: bool

class SliderInDB( SliderInDBBase ):
    pass