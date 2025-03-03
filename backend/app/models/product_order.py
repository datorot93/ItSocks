from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


if TYPE_CHECKING:
    from .product import Product
    from .color import Color

class ProductOrder(Base):
    __tablename__ = 'product_order'

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('product.id'), index=True)
    order_id = Column(Integer, ForeignKey('order.id'), index=True)

    # product_id = Column(Integer, primary_key=True)
    # order_id = Column(Integer, primary_key=True)

    quantity = Column(Integer, default=1, nullable=False)
    pack = Column(String, nullable=True)
    num_in_order = Column(Integer, default=1, nullable=False)
    size = Column(String, nullable=True)
    
    product = relationship('Product', back_populates=('product_order'))
    order = relationship('Order', back_populates=('product_order'))