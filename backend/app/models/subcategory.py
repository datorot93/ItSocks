from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base



class Subcategory(Base):
    __tablename__ = 'subcategory'
    

    id = Column(Integer, primary_key=True, index=True)
    id_category = Column(Integer, ForeignKey("category.id"), index=True)
    
    code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    discount = Column(Integer, nullable=True, default=0)
    image_url = Column(String, nullable=True)
    priority = Column(Integer, nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow())

    category = relationship('Category', back_populates='subcategory')
    product = relationship('Product', back_populates='subcategory')
    # type_subcategory = relationship('TypeSubcategory', back_populates='subcategory')

