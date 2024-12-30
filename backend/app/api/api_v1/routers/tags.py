from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response,UploadFile, File
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

import boto3

from app.core.config import aws_access_key, aws_secret_key, aws_region_name, aws_bucket_name

router = APIRouter()


@router.get("", response_model=List[schemas.Tag], response_model_exclude_none=True)
async def tag_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all Tags
    """

    tags = crud.tag.get_multi(
        db, 
        skip=skip, 
        limit=limit
    )

    # print(devices)
    response.headers["Content-Range"] = f"0-9/{len(tags)}"
    return tags


@router.get("/{tag_id}", response_model=schemas.Tag, response_model_exclude_none=True)
async def tag_detail(
    tag_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get a specific Tag by id
    """
    tag = crud.tag.get(db, id=tag_id)

    if tag is None:
        raise HTTPException(
            status_code=404, detail="The tag with this id does not exist in the system",
        )

    return tag


@router.post(
    "", 
    response_model=schemas.Tag, 
    response_model_exclude_none=True
)
async def tag_create(
    request: Request,
    name: str = "",
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Tag
    """

    tag = crud.tag.get_tag_by_name(db, name=name)
    

    if tag:
        raise HTTPException(
            status_code=400, detail=f"Ya existe la talla que intentas crear {name}",
        )
    
    s3 = boto3.resource(
        's3', 
        aws_access_key_id=aws_access_key, 
        aws_secret_access_key=aws_secret_key,
        region_name=aws_region_name
    )
    
    file_name = file.filename
    with open(file_name, "wb") as buffer:
        buffer.write(await file.read())
        bucket = s3.Bucket('itsocks-images')
        obj = bucket.Object(file.filename)
        obj.upload_file(buffer.name)
        url = f"https://{bucket.name}.s3.amazonaws.com/{obj.key}"


    tag_in = schemas.TagCreate(
        name = name.upper(),
        discount = 0,
        image_url = url
    )
    
    tag = crud.tag.create(
        db,
        obj_in=tag_in
    )
    
    return tag


@router.put("/{tag_id}", response_model=schemas.Tag, response_model_exclude_none=True)
async def tag_update(
    request: Request,
    tag_id: int,
    tag_in: schemas.TagUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update an Tag
    """
    tag = crud.tag.get(db, id=tag_id)

    if tag is None:
        raise HTTPException(
            status_code=404, detail="The tag with this id does not exist in the system",
        )

    tag = crud.tag.update(
        db,
        db_obj=tag,
        obj_in=tag_in
    )
    
    return tag


@router.delete("/{tag_id}", response_model=schemas.Tag, response_model_exclude_none=True)
async def tag_delete(
    tag_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete an Tag
    """
    tag = crud.tag.get(db, id=tag_id)

    if tag is None:
        raise HTTPException(
            status_code=404, detail="The tag with this id does not exist in the system",
        )

    tag = crud.tag.remove(db, id=tag_id)
    
    return tag