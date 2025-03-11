from typing import Optional, Any, Union, Dict

from sqlalchemy.orm import Session

from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.contact_info import ContactInfo
from app.schemas.contact_info import ContactInfoCreate, ContactInfoUpdate

class CRUDContactInfo(CRUDBase[ContactInfo, ContactInfoCreate, ContactInfoUpdate]):
    
    
    def get_contact_info_list(
        self,
        db: Session,
        *,
        skip: int,
        limit: int   
    ):
        contact_info_list = db.query(
                ContactInfo
            ).all()

        
        return contact_info_list
    


contact_info = CRUDContactInfo(ContactInfo)