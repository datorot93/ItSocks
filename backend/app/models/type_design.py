from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, ForeignKey, BigInteger
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .design import Design
    from .type import Type

class TypeDesign(Base):
    __tablename__ = 'type_design'
    
    id = Column(BigInteger, primary_key=True, index=True)
    type_id = Column(Integer, ForeignKey('type.id'), primary_key=True, index=True)
    design_id = Column(Integer, ForeignKey('design.id'), primary_key=True, index=True)

    type = relationship('Type', back_populates=('type_design'))
    design = relationship('Design', back_populates=('type_design'))