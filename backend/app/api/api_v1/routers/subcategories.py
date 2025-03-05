# Utils
from typing import Any, List

# FastAPI
from fastapi import APIRouter, Request, Depends, HTTPException, Response, UploadFile, File

# SQLAlchemy
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

# AWS S3
from app.core.config import aws_access_key, aws_secret_key, aws_region_name, aws_bucket_name
import boto3

router = APIRouter()

@router.post("", response_model_exclude_none=True)
async def subcategory_create(
    request: Request,
    id_category: int,
    name: str,
    discount: int = 0,
    code: str = "",
    file: UploadFile = File(None),
    # file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Subcategory
    """
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
            bucket = s3.Bucket(aws_bucket_name)
            obj = bucket.Object(file.filename)
            obj.upload_file(buffer.name)
            url = f"https://{bucket.name}.s3.amazonaws.com/{obj.key}"

    else:
        url = ""

    subcategory_in = schemas.SubcategoryCreate(
        id_category = id_category,
        name = name,
        code = code,
        discount = discount,
        image_url = url
    )

    if id_category == 2:
        type_in = schemas.TypeCreate(
            name = name,
            code = code,
            discount = 0
        )

        design_in = schemas.DesignCreate(
            name = name,
            code = code,
            discount = 0
        )

        crud.type.create(db, obj_in=type_in)
        crud.design.create(db, obj_in=design_in)


    subcategory = crud.subcategory.create(db, obj_in=subcategory_in)
    
    return subcategory



@router.put(
    "/{subcategory_id}",
    response_model_exclude_none=True
)
async def subcategory_edit(
    request: Request,
    subcategory_id: int,
    id_category: int,
    name: str,
    discount: int = 0,
    code: str = "",
    file: UploadFile = File(None),  # Make file optional
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """ Update an existing Subcategory """

    subcategory = crud.subcategory.get_by_id(db, id=subcategory_id)

    if not subcategory:
        raise HTTPException(
            status_code=404,
            detail=f"No existe subcategoría con el ID {id}",
        )
    
    url = subcategory.image_url  # Default to existing URL if no new file is uploaded

    if file:
        s3 = boto3.resource(
            's3', 
            aws_access_key_id=aws_access_key, 
            aws_secret_access_key=aws_secret_key,
            region_name=aws_region_name
        )
        
        file_name = file.filename
        with open(file_name, "wb") as buffer:
            buffer.write(await file.read())
            bucket = s3.Bucket(aws_bucket_name)
            obj = bucket.Object(file.filename)
            obj.upload_file(buffer.name)
            url = f"https://{bucket.name}.s3.amazonaws.com/{obj.key}"

    subcategory_in = schemas.SubcategoryCreate(
        id_category = id_category,
        name = name,
        code = code,
        discount = discount,
        image_url = url
    )

    subcategory = crud.subcategory.update(
        db, db_obj=subcategory, obj_in=subcategory_in
    )

    return subcategory

@router.get(
    "", 
    response_model=List[schemas.Subcategory], 
    response_model_exclude_none=True,
)
async def subcategories_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all Subcategories
    """
    subcategories = crud.subcategory.get_multi(
        db, 
        skip=skip, 
        limit=limit
    )
    
    # print(devices)
    response.headers["Content-Range"] = f"0-9/{len(subcategories)}"
    return subcategories

@router.delete(
    "/{subcategory_id}", response_model=schemas.Subcategory, response_model_exclude_none=True
)
async def subcategory_delete(
    request: Request,
    subcategory_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete existing Subcategory
    """
    subcategory = crud.subcategory.get(db, id=subcategory_id)
    if not subcategory:
        raise HTTPException(
            status_code=404,
            detail=f"No existe la subcategoría especificada con el ID {subcategory_id}",
        )
    subcategory = crud.subcategory.remove(db=db, id=subcategory_id)
    return subcategory


@router.get(
    "/{subcategory_id}", response_model=schemas.Category, response_model_exclude_none=True
)
async def subcategory_by_id(
    subcategory_id: int,
    # current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific subcategory by id.
    """
    subcategory = crud.subcategory.get(db, id=subcategory_id)
    if subcategory:
        return subcategory
    else:
        raise HTTPException(status_code=400, detail="The subcategory doesn't exists")