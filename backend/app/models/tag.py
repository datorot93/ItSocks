from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.db.base_class import Base


if TYPE_CHECKING:
    from .tag_product import TagProduct


class Tag(Base):
    __tablename__ = 'tag'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) # cilclismo, running, trabajo, casual, fitness
    image_url = Column(String, nullable=False)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    
    
