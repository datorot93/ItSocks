
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship

from typing import TYPE_CHECKING

from app.db.base_class import Base

if TYPE_CHECKING:
    from .type_subcategory import TypeSubcategory
    from .type_design import TypeDesign
    from .product import Product

class Type(Base):
    __tablename__ = 'type'
    

    id = Column(Integer, primary_key=True, index=True)
    desription = Column(String, nullable=False)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    
    type_subcategory = relationship('TypeSubcategory', back_populates='type')
    type_design = relationship('TypeDesign', back_populates='type')