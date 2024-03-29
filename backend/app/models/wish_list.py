from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.db.base_class import Base




class WishList(Base):
    __tablename__ = 'whish_list'
    
    id = Column(Integer, primary_key=True, index=True)
    json_list = Column(String, nullable=False)
    url_list = Column(String, nullable=True)
    id_list = Column(String, nullable=False)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())