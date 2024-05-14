from typing import Optional

from pydantic import BaseModel


# Shared properties
class CustomerBase(BaseModel):
    email: str = None
    full_name: Optional[str] = None


# Properties to receive via API on creation
class CustomerCreate(CustomerBase):
    email: str
    full_name: str


# Properties to receive via API on update
class CustomerUpdate(CustomerBase):
    email: str
    full_name: str


class CustomerInDBBase(CustomerBase):
    email: str
    full_name: str

    class Config:
        orm_mode = True


# Additional properties to return via API
class Customer(CustomerInDBBase):
    pass


# Additional properties stored in DB
class CustomerInDB(CustomerInDBBase):
    email: str
    full_name: str
