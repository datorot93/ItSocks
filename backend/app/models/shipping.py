from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from app.db.base_class import Base



class Shipping(Base):
    __tablename__ = 'shipping'
    
    id = Column(Integer, primary_key=True, index=True)
    municipio_ciudad = Column(String, nullable=False)
    departamento = Column(String, nullable=False)
    tarifa = Column(Integer, nullable=False)
    
    created_at = Column(DateTime, nullable=True, default=datetime.utcnow())
    updated_at = Column(DateTime, nullable=True, default=datetime.utcnow())

    
    
