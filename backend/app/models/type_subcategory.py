from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, ForeignKey, BigInteger
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class TypeSubcategory(Base):
    __tablename__ = 'type_subcategory'

    id = Column(BigInteger, primary_key=True, index=True)
    type_id = Column(Integer, ForeignKey('type.id'), primary_key=True)
    subcategory_id = Column(Integer, ForeignKey('subcategory.id'), primary_key=True)
    

    type = relationship('Type', back_populates=('type_subcategory'))
    subcategory = relationship('Subcategory', back_populates=('type_subcategory'))