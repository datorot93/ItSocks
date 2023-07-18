
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship

from typing import TYPE_CHECKING

from app.db.base_class import Base

if TYPE_CHECKING:
    from .product import Product

class Type(Base):
    __tablename__ = 'type'
    

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    product = relationship('Product', back_populates='type')
    
    # type_subcategory = relationship('TypeSubcategory', back_populates='type')
    # type_design = relationship('TypeDesign', back_populates='type')