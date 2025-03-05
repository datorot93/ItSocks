from pydantic import BaseModel
from typing import Optional

class ProductOrderBase(BaseModel):
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int
    size: str
    pack_cost: Optional[float] = None

class ProductOrderCreate(ProductOrderBase):
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int
    size: str
    pack_cost: Optional[float] = None

class ProductOrderUpdate(ProductOrderBase):
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int
    size: str
    pack_cost: Optional[float] = None

class ProductOrderInDBBase(ProductOrderBase):
    id: int
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int
    size: str
    pack_cost: Optional[float] = None

    class Config:
        orm_mode: True

class ProductOrder(ProductOrderInDBBase):
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int
    size: str
    pack_cost: Optional[float] = None

class ProductOrderInDB(ProductOrderInDBBase):
    pass