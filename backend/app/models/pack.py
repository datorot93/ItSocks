from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean

from app.db.base_class import Base



class Pack(Base):
    __tablename__ = 'pack'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    product_quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    discount = Column(Integer, nullable=True, default=0)
    state = Column(Boolean, nullable=False, default=True)
    description = Column(String, nullable=True)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())