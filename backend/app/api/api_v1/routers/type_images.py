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
    response_model=schemas.TypeImage,
    response_model_exclude_none=True
)
async def type_image_create(
    request: Request,
    # type_image_in: schemas.TypeImageCreate,
    type_name: str,
    category: str,
    subcategory: str,
    description: str = "",
    alt: str = "",
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    
    """
    Create a new TypeImage Image
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


    
    type_image_in = schemas.TypeImageCreate(
        name = type_name,
        category = category,
        subcategory = subcategory,
        description = description,
        alt = alt,
        image_url = url,
    )

    type_image = crud.type_image.create(
        db,
        obj_in=type_image_in
    )
    
    return type_image


@router.get("", response_model=List[schemas.TypeImage], response_model_exclude_none=True)
async def type_images_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all type_images
    """
    type_images = crud.type_image.get_type_image_list(
        db, 
        skip=skip, 
        limit=limit
    )
    response.headers["Content-Range"] = f"0-9/{len(type_images)}"
    return type_images


@router.get(
    "/{type_image_id}", response_model=schemas.TypeImage, response_model_exclude_none=True
)
async def type_image_by_id(
    type_image_id: int,
    # current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific TypeImage by id.
    """
    type_image = crud.type_image.get(db, id=type_image_id)
    if not type_image:
        raise HTTPException(
            status_code=404,
            detail=f"No existe type_image con el ID {type_image_id}",
        )
    return type_image

@router.delete(
    "/{type_image_id}", response_model=schemas.TypeImage, response_model_exclude_none=True
)
async def type_image_delete(
    request: Request,
    type_image_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete a TypeImage
    """
    type_image = crud.type_image.get(db, id=type_image_id)
    if not type_image:
        raise HTTPException(
            status_code=404,
            detail=f"No existe type_image con el ID {type_image_id}",
        )
    type_image = crud.type_image.remove(db, id=type_image_id)
    return type_image


@router.put(
    "/{type_image_id}", 
    response_model_exclude_none=True
)
async def type_image_edit(
    request: Request,
    type_image_id: int,
    subcategory: str,
    category: str,
    name: str,
    description: str = "",
    alt: str = "",
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db)
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update existing TypeImage
    """
    type_image = crud.type_image.get(db, id=type_image_id)

    if not type_image:
        raise HTTPException(
            status_code=404,
            detail=f"No existe type_image con el ID {type_image_id}",
        )
    
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

    
    type_image_in = schemas.TypeImageCreate(
        category = category,
        name = name,
        subcategory = subcategory,
        description = description,
        alt = alt,
        image_url = url
    )

    type_image = crud.type_image.update(
        db, db_obj=type_image, obj_in=type_image_in
    )

    return type_image