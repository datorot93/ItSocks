from datetime import datetime

from sqlalchemy import Column, String, Integer



from app.db.base_class import Base



class ContactInfo(Base):
    __tablename__ = 'contact_info'
    
    id = Column(Integer, primary_key=True, index=True)
    whatsapp_number = Column(String, nullable=True)
