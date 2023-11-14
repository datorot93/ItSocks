from sqlite3 import Timestamp

from pydantic import BaseModel


class DiscountCodeBase(BaseModel):
    code: str = None
    discount: int = None
    state: bool = None
    expiration_date: Timestamp = None
    

class DiscountCodeCreate(DiscountCodeBase):
    pass
    

class DiscountCodeUpdate(DiscountCodeBase):
    pass
    

class DiscountCodeInDBBase(DiscountCodeBase):
    id: int = None
    code: str = None
    discount: int = None
    state: bool = None
    expiration_date: Timestamp = None

    class Config:
        orm_mode = True


class DiscountCode(DiscountCodeInDBBase):
    code: str = None
    discount: int = None
    state: bool = None
    expiration_date: Timestamp = None


class DiscountCodeDB(DiscountCodeInDBBase):
    pass
