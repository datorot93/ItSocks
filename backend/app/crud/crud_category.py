from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

class CRUDCategory(CRUDBase[Category, CategoryCreate, CategoryUpdate]):
    """
    Operaciones CRUD para entidades de Categoría.
    
    Hereda de la clase genérica CRUDBase y especifica operaciones para entidades de Categoría,
    incluyendo la recuperación por nombre y ID, y la creación de nuevas categorías.
    """
    
    def get_category_by_name(
            self, 
            db: Session, 
            *, 
            name: str 
    ):
        """
        Recupera una categoría por su nombre.
        
        Parámetros:
            db (Session): Sesión de la base de datos.
            name (str): Nombre de la categoría a recuperar.
            
        Devuelve:
            Una instancia de Category si se encuentra, de lo contrario None.
        """
        return db.query(Category).filter(Category.name == name).first()
    
    def get_category_by_id(
        self,
        db: Session,
        *,
        id: int
    ):
        """
        Recupera una categoría por su ID.
        
        Parámetros:
            db (Session): Sesión de la base de datos.
            id (int): ID de la categoría a recuperar.
            
        Devuelve:
            Una instancia de Category si se encuentra, de lo contrario None.
        """
        return db.query(Category).filter(Category.id == id).first()

    def create(
            self,
            db: Session,
            *,
            obj_in: CategoryCreate 
    ) -> Category:
        """
        Crea una nueva categoría.
        
        Parámetros:
            db (Session): Sesión de la base de datos.
            obj_in (CategoryCreate): Objeto de creación de categoría que contiene los datos.
            
        Devuelve:
            La instancia de Category recién creada.
        """
        db_obj = Category(
            name=obj_in.name
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj
    
    # def update(
    #         self, 
    #         db:Session,
    #         *,
    #         db_obj: Category,
    #         obj_in: Union[CategoryUpdate, Dict[str, Any]],
    #     ) -> Category:
    
    #     if isinstance(obj_in, dict):
    #         update_data = obj_in

    #     else:
    #         update_data = obj_in.dict(exclude_unset=True)

    #     return super().update(db, db_obj=db_obj, obj_in=update_data)





category = CRUDCategory(Category)