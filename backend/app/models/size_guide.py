from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, Boolean
from sqlalchemy.orm import relationship

from typing import TYPE_CHECKING

from app.db.base_class import Base

if TYPE_CHECKING:
    from .product import Product


class SizeGuide(Base):
    """
    Clase que representa una guía de tallas en la base de datos.

    Atributos:
    ----------
    id : int
        Identificador único de la guía de tallas.
    size_guide : str
        Descripción de la guía de tallas.
    image_url : str
        URL de la imagen asociada a la guía de tallas.
    alt : str, opcional
        Texto alternativo para la imagen.
    created_at : datetime
        Fecha y hora de creación del registro.
    updated_at : datetime
        Fecha y hora de la última actualización del registro.
    """
    
    __tablename__ = 'size_guide'
    
    id = Column(Integer, primary_key=True, index=True)
    size_guide = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    alt = Column(String, nullable=True)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())