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
    response_model=schemas.SizeGuide,
    response_model_exclude_none=True
)
async def size_guide_create(
    request: Request,
    # size_guide_in: schemas.SizeGuideCreate,
    size_guide: str,
    alt: str='',
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    
    """
    Create a new SizeGuide Image
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
        bucket = s3.Bucket('itsocks-images')
        obj = bucket.Object(file.filename)
        obj.upload_file(buffer.name)
        url = f"https://{bucket.name}.s3.amazonaws.com/{obj.key}"


    
    size_guide_in = schemas.SizeGuideCreate(
        size_guide = size_guide,
        alt = alt,
        image_url = url,
    )


    size_guide = crud.size_guide.create(
        db,
        obj_in=size_guide_in
    )
    
    return size_guide

@router.get("", response_model=List[schemas.SizeGuide], response_model_exclude_none=True)
async def size_guides_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all size_guides
    """
    size_guides = crud.size_guide.get_size_guides(db, skip=skip, limit=limit)
    response.headers["Content-Range"] = f"0-9/{len(size_guides)}"
    return size_guides



@router.get(
    "/name/{size_guide}", 
    response_model=schemas.SizeGuide, 
    response_model_exclude_none=True
)
async def get_size_guide_by_name(
    size_guide: str,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get a specific SizeGuide by name.
    """
    size_guide = crud.size_guide.get_size_guide_by_name(db, size_guide=size_guide)
    if not size_guide:
        raise HTTPException(
            status_code=404,
            detail=f"No existe size_guide con el nombre {size_guide}",
        )
    return size_guide


@router.get(
    "/{size_guide_id}", 
    response_model=schemas.SizeGuide, 
    response_model_exclude_none=True
)
async def size_guide_by_id(
    size_guide_id: int,
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific SizeGuide by id.
    """
    size_guide = crud.size_guide.get(db, id=size_guide_id)
    if not size_guide:
        raise HTTPException(
            status_code=404,
            detail=f"No existe size_guide con el ID {size_guide_id}",
        )
    return size_guide


@router.delete(
    "/{size_guide_id}", response_model=schemas.SizeGuide, response_model_exclude_none=True
)
async def size_guide_delete(
    request: Request,
    size_guide_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete a SizeGuide
    """
    size_guide = crud.size_guide.get(db, id=size_guide_id)
    if not size_guide:
        raise HTTPException(
            status_code=404,
            detail=f"No existe size_guide con el ID {size_guide_id}",
        )
    size_guide = crud.size_guide.remove(db, id=size_guide_id)
    return size_guide


@router.put(
    "/{size_guide_id}", 
    # response_model=schemas.SizeGuide, 
    response_model_exclude_none=True
)
async def size_guide_edit(
    request: Request,
    size_guide: str,
    size_guide_id: int,
    alt: str = '',
    file: UploadFile = File(None),
    db: Session = Depends(deps.get_db)
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update existing SizeGuide
    """

    print('*' * 20)
    print(size_guide_by_id)
    print(size_guide)

    size_guide = crud.size_guide.get(db, id=size_guide_id)

    if not size_guide:
        raise HTTPException(
            status_code=404,
            detail=f"No existe size_guide con el ID {size_guide_id}",
        )

    url = ""
    if file:
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
            bucket = s3.Bucket('itsocks-images')
            obj = bucket.Object(file.filename)
            obj.upload_file(buffer.name)
            url = f"https://{bucket.name}.s3.amazonaws.com/{obj.key}"


    # size_guide_in = schemas.SizeGuide(
    #     size_guide = size_guide,
    #     image_url = url,
    #     alt = alt
    # )

    # size_guide = crud.size_guide.update(db, db_obj=size_guide, obj_in=size_guide_in)
    # return size_guide
    return ""