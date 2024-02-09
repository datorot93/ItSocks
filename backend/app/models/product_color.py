from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


if TYPE_CHECKING:
    from .product import Product
    from .color import Color

class ProductColor(Base):
    __tablename__ = 'product_color'

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('product.id'), index=True)
    color_id = Column(Integer, ForeignKey('color.id'), index=True)
    
    product = relationship('Product', back_populates=('product_color'))
    color = relationship('Color', back_populates=('product_color'))