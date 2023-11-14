from datetime import datetime

from sqlalchemy import Boolean, Column, Integer, String, DateTime

from app.db.base_class import Base



class DiscountCode(Base):
    __tablename__ = 'discount_code'
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, nullable=False)
    discount = Column(Integer, nullable=False)
    state = Column(Boolean, nullable=False)
    expiration_date = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, nullable=True, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=True, default=datetime.utcnow())

    
    
