from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base



class Size(Base):
    __tablename__ = 'size'
    
    id = Column(Integer, primary_key=True, index=True)
    size = Column(String, nullable=False)

    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    product_size = relationship('ProductSize', back_populates=('size'))