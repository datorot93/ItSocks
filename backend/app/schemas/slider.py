from typing import Optional
from pydantic import BaseModel


class SliderBase( BaseModel ):
    link: str = ""
    description: str
    alt: str
    url: str

class SliderCreate( SliderBase ):
    link: str = ""
    description: str = ""
    alt: str = ""
    url: str = ""

class SliderIn( BaseModel ):
    link: str = ""
    description: str
    alt: str

class SliderUpdate( SliderBase ):
    link: str = ""
    description: str
    alt: str
    url: str

class SliderInDBBase( SliderBase ):
    id: Optional[ int ] = None
    link: Optional[str]
    description: Optional[str]
    alt: Optional[str]
    url: str

    class Config:
        orm_mode = True


class Slider( SliderInDBBase ):
    link: Optional[str] = None
    description: Optional[str] = None
    alt: Optional[str] = None
    url: str

class SliderInDB( SliderInDBBase ):
    pass