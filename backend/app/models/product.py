from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .design import Design
    from .image import Image
    from .type import Type
    from .subcategory import Subcategory

class Product(Base):

    __tablename__ = 'product'
    

    id = Column(Integer, primary_key=True, index=True)

    # Llaves Foráneas
    
    id_design = Column(Integer, ForeignKey('design.id'), index=True)
    id_type = Column(Integer, ForeignKey('type.id'), index=True)
    id_subcategory = Column(Integer, ForeignKey('subcategory.id'), index=True)
    

    name = Column(String, nullable=False)
    talla = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    state = Column(Boolean, nullable=False, default=True)
    color = Column(String, nullable=True)
    compresion = Column(Boolean, nullable=False, default=False)
    

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    design = relationship('Design', back_populates='product')
    type = relationship('Type', back_populates='product')
    subcategory = relationship('Subcategory', back_populates='product')
    image = relationship('Image', back_populates='product')
    
