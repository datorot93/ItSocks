from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from typing import TYPE_CHECKING

from app.db.base_class import Base

if TYPE_CHECKING:
    from .product import Product


class Image(Base):
    __tablename__ = 'image'
    id = Column(Integer, primary_key=True, index=True)
    id_product = Column(Integer, ForeignKey('product.id'), index=True)

    url = Column(String, nullable=False)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    product = relationship('Product', back_populates='image')