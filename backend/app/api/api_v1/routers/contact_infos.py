from typing import Any, List

from fastapi import UploadFile, APIRouter, Request, Depends, File, HTTPException, Response

import boto3

from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.models.contact_info import ContactInfo
from app.api import deps

from app.core.config import aws_access_key, aws_secret_key, aws_region_name, aws_bucket_name

import uuid

router = APIRouter()

[
    '__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'close', 'content_type', 'file', 'filename', 'read', 'seek', 'spool_max_size', 'write'
]



@router.get("", response_model=List[schemas.ContactInfo], response_model_exclude_none=True)
async def contact_info_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all contact_infos
    """
    contact_info = crud.contact_info.get_multi(db, skip=skip, limit=limit)
    response.headers["Content-Range"] = f"0-9/{len(contact_info)}"
    return contact_info



@router.get(
    "/{contact_info_id}", response_model=schemas.ContactInfo, response_model_exclude_none=True
)
async def contact_info_by_id(
    contact_info_id: int,
    # current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific Slider by id.
    """
    contact_info = crud.contact_info.get(db, id=contact_info_id)
    if not contact_info:
        raise HTTPException(
            status_code=404,
            detail=f"No existe contact_info con el ID {contact_info_id}",
        )
    return contact_info

@router.delete(
    "/{contact_info_id}", response_model=schemas.Slider, response_model_exclude_none=True
)
async def contact_info_delete(
    request: Request,
    contact_info_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete a Slider
    """
    contact_info = crud.contact_info.get(db, id=contact_info_id)
    if not contact_info:
        raise HTTPException(
            status_code=404,
            detail=f"No existe contact_info con el ID {contact_info_id}",
        )
    contact_info = crud.contact_info.remove(db, id=contact_info_id)
    return contact_info


@router.put(
    "/{contact_info_id}", 
    response_model=schemas.ContactInfo, 
    response_model_exclude_none=True
)
async def contact_info_edit(
    request: Request,
    contact_info_id: int,
    contact_info_in: schemas.ContactInfoUpdate,
    db: Session = Depends(deps.get_db)
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update existing Slider
    """
    contact_info = crud.contact_info.get(db, id=contact_info_id)
    if not contact_info:
        raise HTTPException(
            status_code=404,
            detail=f"No existe contact_info con el ID {contact_info_id}",
        )
    contact_info = crud.contact_info.update(db, db_obj=contact_info, obj_in=contact_info_in)
    return contact_info
