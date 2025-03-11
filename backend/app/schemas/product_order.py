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
    discount: int = 0
    discount_code: str = ""

class ProductOrderCreate(ProductOrderBase):
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int
    size: str
    pack_cost: Optional[float] = None
    discount: int = 0
    discount_code: str = ""
    
class ProductOrderUpdate(ProductOrderBase):
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int
    size: str
    pack_cost: Optional[float] = None
    discount: int = 0
    discount_code: str = ""
    
class ProductOrderInDBBase(ProductOrderBase):
    id: int
    product_id: int
    order_id: int
    quantity: int
    pack: str
    num_in_order: int
    size: str
    pack_cost: Optional[float] = None
    discount: int = 0
    discount_code: str = ""
    
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
    discount: int = 0
    discount_code: str = ""
    
class ProductOrderInDB(ProductOrderInDBBase):
    pass