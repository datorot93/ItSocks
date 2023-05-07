from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .design import Design
    from .category import Category
    from .subcategory import Subcategory

class Product( Base ):

    __tablename__ = 'product'

    id = Column(Integer, primary_key=True, index=True)

    # Llaves Foráneas
    id_categoria = Column(Integer, ForeignKey('category.id'), index=True)
    id_subcategoria = Column(Integer, ForeignKey('subcategory.id'), index=True)
    id_disenio = Column(Integer, ForeignKey('design.id'), index=True)

    name = Column(String, nullable=False)
    talla = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    state = Column(Boolean, nullable=False, default=True)
    factory_rference = Column(String, nullable=False)
    image_url = Column(String, )

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    design = relationship('Design', back_populates='product')
    subcategory = relationship('Subcategory', back_populates='product')
    category = relationship('Category', back_populates='product')
