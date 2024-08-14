from pydantic import BaseModel
from typing import Optional

class ProductOrderBase(BaseModel):
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int

class ProductOrderCreate(ProductOrderBase):
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int

class ProductOrderUpdate(ProductOrderBase):
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int

class ProductOrderInDBBase(ProductOrderBase):
    id: int
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int

    class Config:
        orm_mode: True

class ProductOrder(ProductOrderInDBBase):
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int

class ProductOrderInDB(ProductOrderInDBBase):
    pass