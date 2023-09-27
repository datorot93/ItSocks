from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Preview(Base):

    __tablename__ = 'preview'

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    subcategory = Column(String, nullable=False)
    type = Column(String, nullable=True),
    image_url = Column(String, nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    
