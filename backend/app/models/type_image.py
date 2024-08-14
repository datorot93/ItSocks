from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, Boolean
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class TypeImage(Base):
    __tablename__ = 'type_image'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    subcategory = Column(String, nullable=False)

    description = Column(String, nullable=True)
    alt = Column(String, nullable=True)

    image_url = Column(String, nullable=False)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())