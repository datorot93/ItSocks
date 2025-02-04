from typing import Any, List

from fastapi import UploadFile, APIRouter, Request, Depends, File, HTTPException, Response

import boto3

from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

from app.core.config import aws_access_key, aws_secret_key, aws_region_name, aws_bucket_name

import uuid

router = APIRouter()

[
    '__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'close', 'content_type', 'file', 'filename', 'read', 'seek', 'spool_max_size', 'write'
]

@router.post(
    "", 
    response_model=schemas.Slider,
    response_model_exclude_none=True
)
async def slider_create(
    request: Request,
    # slider_in: schemas.SliderCreate,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    
    """
    Create a new Slider Image
    """

    s3 = boto3.resource(
        's3', 
        aws_access_key_id=aws_access_key, 
        aws_secret_access_key=aws_secret_key,
        region_name=aws_region_name
    )
    
    file_name = file.filename
    url = ""
    with open(file_name, "wb") as buffer:
        buffer.write(await file.read())
        bucket = s3.Bucket(aws_bucket_name)
        obj = bucket.Object(file.filename)
        obj.upload_file(buffer.name)
        url = f"https://{bucket.name}.s3.amazonaws.com/{obj.key}"


    
    slider_in = schemas.SliderCreate(
        link = "",
        description = "",
        alt = "",
        url = url,
        state = True
    )


    slider = crud.slider.create(
        db,
        obj_in=slider_in
    )
    
    return slider

@router.get("", response_model=List[schemas.Slider], response_model_exclude_none=True)
async def sliders_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all sliders
    """
    sliders = crud.slider.get_sliders(db, skip=skip, limit=limit)
    response.headers["Content-Range"] = f"0-9/{len(sliders)}"
    return sliders

@router.get("/active", response_model=List[schemas.Slider], response_model_exclude_none=True)
async def active_sliders_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all sliders
    """
    sliders = crud.slider.get_active_sliders(db, skip=skip, limit=limit)
    response.headers["Content-Range"] = f"0-9/{len(sliders)}"
    return sliders

@router.get(
    "/{slider_id}", response_model=schemas.Slider, response_model_exclude_none=True
)
async def slider_by_id(
    slider_id: int,
    # current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific Slider by id.
    """
    slider = crud.slider.get(db, id=slider_id)
    if not slider:
        raise HTTPException(
            status_code=404,
            detail=f"No existe slider con el ID {slider_id}",
        )
    return slider

@router.delete(
    "/{slider_id}", response_model=schemas.Slider, response_model_exclude_none=True
)
async def slider_delete(
    request: Request,
    slider_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete a Slider
    """
    slider = crud.slider.get(db, id=slider_id)
    if not slider:
        raise HTTPException(
            status_code=404,
            detail=f"No existe slider con el ID {slider_id}",
        )
    slider = crud.slider.remove(db, id=slider_id)
    return slider


@router.put(
    "/{slider_id}", 
    response_model=schemas.Slider, 
    response_model_exclude_none=True
)
async def slider_edit(
    request: Request,
    slider_id: int,
    slider_in: schemas.SliderUpdate,
    db: Session = Depends(deps.get_db)
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update existing Slider
    """
    slider = crud.slider.get(db, id=slider_id)
    if not slider:
        raise HTTPException(
            status_code=404,
            detail=f"No existe slider con el ID {slider_id}",
        )
    slider = crud.slider.update(db, db_obj=slider, obj_in=slider_in)
    return slider