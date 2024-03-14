from sqlite3 import Timestamp

from pydantic import BaseModel


class ShippingBase(BaseModel):
    municipio_ciudad: str = None
    departamento: str = None
    tarifa: float = None

class ShippingCreate(ShippingBase):
    pass
    

class ShippingUpdate(ShippingBase):
    pass
    

class ShippingInDBBase(ShippingBase):
    id: int = None
    municipio_ciudad: str = None
    departamento: str = None
    tarifa: float = None

    class Config:
        orm_mode = True


class Shipping(ShippingInDBBase):
    municipio_ciudad: str = None
    departamento: str = None
    tarifa: float = None


class ShippingDB(ShippingInDBBase):
    pass
