from typing import Optional

from pydantic import BaseModel


class CategoryBase(BaseModel):
    """
    Clase base para categorías. Define los campos comunes para todas las categorías.
    
    Atributos:
        name (str): Nombre de la categoría. Inicialmente sin valor.
        discount (int): Descuento aplicable a la categoría. Inicialmente sin valor.
    """
    name: str = None
    discount: int = None  

class CategoryCreate(CategoryBase):
    """
    Clase para crear una nueva categoría. Hereda de CategoryBase.
    """
    pass

class CategoryInDBBase(CategoryBase):
    """
    Clase base para categorías en la base de datos. Extiende CategoryBase con campos adicionales.
    
    Atributos:
        id (Optional[int]): Identificador único de la categoría. Opcionalmente sin valor.
        name (Optional[str]): Nombre de la categoría. Opcionalmente sin valor.
        discount (Optional[int]): Descuento aplicable a la categoría. Opcionalmente sin valor.
    
    Configuraciones:
        orm_mode (bool): Configuración para permitir el uso del modelo con ORMs.
    """
    id: Optional[int] = None
    name: Optional[str] = None
    discount: Optional[int] = None
    
    class Config:
        orm_mode = True

class CategoryUpdate(CategoryBase):
    """
    Clase para actualizar una categoría existente. Hereda de CategoryBase.
    """
    pass

class Category(CategoryInDBBase):
    """
    Clase que representa una categoría. Hereda de CategoryInDBBase.
    
    Atributos:
        name (Optional[str]): Nombre de la categoría. Opcionalmente sin valor.
        discount (Optional[int]): Descuento aplicable a la categoría. Opcionalmente sin valor.
    """
    name: Optional[str] = None
    discount: Optional[int] = None

class CategoryInDB(CategoryInDBBase):
    """
    Clase representativa de una categoría en la base de datos. Hereda de CategoryInDBBase.
    """
    pass