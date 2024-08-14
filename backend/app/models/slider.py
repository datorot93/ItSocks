from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, Boolean
from sqlalchemy.orm import relationship

from typing import TYPE_CHECKING

from app.db.base_class import Base

if TYPE_CHECKING:
    from .product import Product


class Slider(Base):
    __tablename__ = 'slider'
    
    id = Column(Integer, primary_key=True, index=True)
    link = Column(String, nullable=True)
    description = Column(String, nullable=True)
    alt = Column(String, nullable=True)
    state = Column(Boolean, nullable=False, default=True)

    url = Column(String, nullable=False)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())