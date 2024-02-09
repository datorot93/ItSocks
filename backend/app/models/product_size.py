from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


if TYPE_CHECKING:
    from .product import Product
    from .size import Size

class ProductSize(Base):
    __tablename__ = 'product_size'

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('product.id'), index=True)
    size_id = Column(Integer, ForeignKey('size.id'), index=True)
    
    product = relationship('Product', back_populates=('product_size'))
    size = relationship('Size', back_populates=('product_size'))