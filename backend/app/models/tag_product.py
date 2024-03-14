from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, ForeignKey, BigInteger
from sqlalchemy.orm import relationship

from app.db.base_class import Base


if TYPE_CHECKING:
    from .product import Product
    from .tag import Tag

class TagProduct(Base):
    __tablename__ = 'tag_product'

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('product.id'), index=True)
    tag_id = Column(Integer, ForeignKey('tag.id'), index=True)
    
    product = relationship('Product', back_populates=('tag_product'))
    tag = relationship('Tag', back_populates=('tag_product'))