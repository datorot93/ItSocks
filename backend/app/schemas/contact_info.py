from typing import Optional
from pydantic import BaseModel


class ContactInfoBase( BaseModel ):
    whatsapp_number: str

class ContactInfoCreate( ContactInfoBase ):
    pass

class ContactInfoIn( BaseModel ):
    whatsapp_number: str

class ContactInfoUpdate( ContactInfoBase ):
    whatsapp_number: str

class ContactInfoInDBBase( ContactInfoBase ):
    id: Optional[ int ] = None
    whatsapp_number: str

    class Config:
        orm_mode = True


class ContactInfo( ContactInfoInDBBase ):
    whatsapp_number: str

class ContactInfoInDB( ContactInfoInDBBase ):
    pass