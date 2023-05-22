
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Type(Base):
    __tablename__ = 'type'

    id = Column(Integer, primary_key=True, index=True)
    desription = Column(String, nullable=False)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    product = relationship('Product', back_populates='type')
    type_subcategory = relationship('TypeSubcategory', back_populates='type')
    types_design = relationship('TypeDesign', back_populates='type')