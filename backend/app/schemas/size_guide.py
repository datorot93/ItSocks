from typing import Optional
from pydantic import BaseModel


class SizeGuideBase(BaseModel):
    """
    Clase base para la guía de tallas.

    Atributos:
    ----------
    size_guide : str
        Descripción de la guía de tallas.
    image_url : str
        URL de la imagen asociada a la guía de tallas.
    alt : str
        Texto alternativo para la imagen.
    """
    size_guide: str
    image_url: str
    alt: str

class SizeGuideCreate(SizeGuideBase):
    """
    Clase para la creación de una nueva guía de tallas.

    Atributos:
    ----------
    size_guide : str
        Descripción de la guía de tallas.
    image_url : str
        URL de la imagen asociada a la guía de tallas.
    alt : str
        Texto alternativo para la imagen.
    """
    size_guide: str
    image_url: str
    alt: str

class SizeGuideIn(BaseModel):
    """
    Clase para la entrada de datos de la guía de tallas.

    Atributos:
    ----------
    size_guide : str
        Descripción de la guía de tallas.
    image_url : str
        URL de la imagen asociada a la guía de tallas.
    alt : str
        Texto alternativo para la imagen.
    """
    size_guide: str
    image_url: str
    alt: str

class SizeGuideUpdate(SizeGuideBase):
    """
    Clase para la actualización de una guía de tallas existente.

    Atributos:
    ----------
    size_guide : str
        Descripción de la guía de tallas.
    image_url : str
        URL de la imagen asociada a la guía de tallas.
    alt : str
        Texto alternativo para la imagen.
    """
    size_guide: str
    image_url: str
    alt: str

class SizeGuideInDBBase(SizeGuideBase):
    """
    Clase base para la guía de tallas en la base de datos.

    Atributos:
    ----------
    id : int
        Identificador único de la guía de tallas.
    size_guide : str
        Descripción de la guía de tallas.
    image_url : str
        URL de la imagen asociada a la guía de tallas.
    alt : str
        Texto alternativo para la imagen.
    """
    id: int = None
    size_guide: str
    image_url: str
    alt: str

    class Config:
        orm_mode = True

class SizeGuide(SizeGuideInDBBase):
    """
    Clase que representa una guía de tallas.

    Atributos:
    ----------
    size_guide : str
        Descripción de la guía de tallas.
    image_url : str
        URL de la imagen asociada a la guía de tallas.
    alt : str
        Texto alternativo para la imagen.
    """
    size_guide: str
    image_url: str
    alt: str

class SizeGuideInDB(SizeGuideInDBBase):
    """
    Clase que representa una guía de tallas en la base de datos.
    """
    pass