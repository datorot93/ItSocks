# from typing import List, Any, Dict, Union
# import random
# import uuid

# # from backend.app.models import user_order

# from fastapi.encoders import jsonable_encoder
# from sqlalchemy.orm import Session
# from sqlalchemy import desc, asc

# from app.core.security import get_password_hash, verify_password
# from app.crud.base import CRUDBase
# from app.models.type_design import TypeDesign
# from app.schemas.type_design import TypeDesignCreate, TypeDesignUpdate


# class CRUDTypeDesign(CRUDBase[TypeDesign, TypeDesignCreate, TypeDesignUpdate]):
#     """ Class with the basic operations to do TypeDesign """

#     def get_by_id(self, db: Session, *, id: int):
#         return db.query(TypeDesign).filter(TypeDesign.id == id).first()
    
#     def get_by_ids(self, db: Session, *, design_id: int, type_id: int):
#         return db.query(TypeDesign).filter(
#             TypeDesign.design_id == design_id and TypeDesign.type_id == type_id
#         ).first()

#     def create(
#         self, 
#         db: Session, 
#         *, 
#         obj_in: TypeDesignCreate
#     ) -> TypeDesign:
#         db_obj = TypeDesign(            
#             type_id = obj_in.type_id,
#             design_id = obj_in.design_id,
#             id = int(uuid.uuid4().int/1000000000000000000000000000)
#         )
#         db.add(db_obj)
#         db.commit()
#         db.refresh(db_obj)
#         return db_obj

#     def update(
#         self,
#         db: Session,
#         *,
#         db_obj: TypeDesign,
#         obj_in: Union[TypeDesignUpdate, Dict[str, Any]]
#     ) -> TypeDesign:
#         if isinstance(obj_in, dict):
#             update_data = obj_in
#         else:
#             update_data = obj_in.dict(exclude_unset=True)
#         return super().update(db, db_obj=db_obj, obj_in=update_data)

#     def get_multi_by_type_design(
#         self, db: Session, *, skip: int = 0, limit: int = 100
#     ) -> List[TypeDesign]:

#         return db.query(self.model).offset(skip).limit(limit).all()

#     def remove_type_design(
#             self, 
#             db: Session, 
#             *, 
#             design_id: int,
#             type_id
#     ) -> TypeDesign:
#         obj = self.get_by_ids(
#             db, 
#             design_id=design_id, 
#             type_id=type_id
#         )

#         db.delete(obj)
#         db.commit()
#         return obj
    

    


# type_design = CRUDTypeDesign(TypeDesign)
