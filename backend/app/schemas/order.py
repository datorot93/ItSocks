from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class OrderBase(BaseModel):
    first_name: str
    last_name: str
    address: Optional[str]
    phone_number: str
    billing_addess: str
    region: str
    country: str
    city: str
    document: Optional[str]
    email: str
    extra_info: Optional[str]
    de: Optional[str]
    para: Optional[str]
    isGift: bool
    state: str
    quantity: int
    shipping_cost: float
    total: float
    subtotal: float
    shipping_guide: Optional[str] = "No asignada"
    shipping_guide_url: Optional[str] = ""
    shipping_guide_number: Optional[str] = ""
    paid_status: Optional[str] = "Pendiente"
    preference: str
    pyment_id: Optional[str] = ""



class OrderCreate(OrderBase):
    pass


class OrderUpdate(OrderBase):
    pass


class OrderInDBBase(OrderBase):
    id: int

    class Config:
        orm_mode: True


class Order(OrderInDBBase):
    pass


class OrderInDB(OrderInDBBase):
    pass