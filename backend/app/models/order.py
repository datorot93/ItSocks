from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.db.base_class import Base


if TYPE_CHECKING:
    from .product_order import ProductOrder

class Order(Base):

    __tablename__ = 'order'
    

    id = Column(Integer, primary_key=True, index=True)
    
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    address = Column(String, nullable=True)
    phone_number = Column(String, nullable=False)
    billing_addess = Column(String, nullable=False)
    region = Column(String, nullable=False)
    country = Column(String, nullable=False)
    city = Column(String, nullable=False)
    document = Column(String, nullable=True)
    email = Column(String, nullable=False)
    extra_info = Column(String, nullable=True)
    de = Column(String, nullable=True)
    para = Column(String, nullable=True)
    isGift = Column(Boolean, nullable=False, default=False)
    state = Column(String, nullable=False, default=True)
    quantity = Column(Integer, nullable=False)
    shipping_cost = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)
    shipping_guide = Column(String, nullable=False, default='No asignada')
    shipping_guide_url = Column(String, nullable=True, default='')
    paid_status = Column(String, nullable=False, default='Pendiente')
    preference = Column(String, nullable=False)
    pyment_id = Column(String, nullable=True, default='')

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    product_order = relationship('ProductOrder', back_populates='order')