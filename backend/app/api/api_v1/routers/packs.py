from typing import Any, List

from fastapi import APIRouter, UploadFile, File, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

import boto3

from app import crud, models, schemas
from app.api import deps

from app.core.config import aws_access_key, aws_secret_key, aws_region_name, aws_bucket_name

router = APIRouter()


@router.post("pack_create", response_model=schemas.Pack, response_model_exclude_none=True)
async def pack_create(
    request: Request,
    # pack_in: schemas.PackCreate,
    name: str,
    product_quantity: int,
    price: float,
    description: str,
    image: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Pack
    """
    s3 = boto3.resource(
        's3', 
        aws_access_key_id=aws_access_key, 
        aws_secret_access_key=aws_secret_key,
        region_name=aws_region_name
    )

    file_name = image.filename
    url = ""
    with open(file_name, "wb") as buffer:
        buffer.write(await image.read())
        bucket = s3.Bucket('itsocks-images')
        obj = bucket.Object(image.filename)
        obj.upload_file(buffer.name)
        url = f"https://{bucket.name}.s3.amazonaws.com/{obj.key}"

    pack_in = schemas.PackCreate(
        name = name,
        image_url = url,
        product_quantity = product_quantity,
        price = price,
        description = description
    )


    pack = crud.pack.get_pack_by_name(db, name=pack_in.name)
    if pack:
        raise HTTPException(
            status_code=400, detail="El pack que está intentando crear ya existe",
        )
    pack = crud.pack.create(db, obj_in=pack_in)
    
    return pack


# @router.put(
#     "/{category_id}", 
#     response_model=schemas.Category, 
#     response_model_exclude_none=True
# )
# async def category_edit(
#     request: Request,
#     category_id: int,
#     category_in: schemas.CategoryUpdate,
#     db: Session = Depends(deps.get_db)
#     # current_user: models.User = Depends(deps.get_current_active_superuser),
# ):
#     """ Update an existing Category """
#     category = crud.category.get(db, id=category_id)

#     if not category:
#         raise HTTPException(
#             status_code=404, detail="The Category Name does not exist in the system",
#         )
#     category = crud.category.update(db, db_obj=category, obj_in=category_in)
#     return category


@router.get("", response_model=List[schemas.Pack], response_model_exclude_none=True)
async def packs_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all packs
    """
    packs = crud.pack.get_packs(db, skip=skip, limit=limit)
    response.headers["Content-Range"] = f"0-9/{len(packs)}"
    return packs

@router.get(
    "/{pack_id}", response_model=schemas.Pack, response_model_exclude_none=True
)
async def pack_by_id(
    pack_id: int,
    # current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific Pack by id.
    """
    pack = crud.pack.get(db, id=pack_id)
    if not pack:
        raise HTTPException(
            status_code=404,
            detail=f"No existe pack con el ID {pack_id}",
        )
    return pack


@router.get("packs_names", response_model=List[schemas.Pack], response_model_exclude_none=True)
async def packs_names(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all packs names
    """
    packs = crud.pack.get_packs_names(db, skip=skip, limit=limit)
    # response.headers["Content-Range"] = f"0-9/{len(packs)}"
    return packs


@router.put(
    "/{pack_id}", 
    response_model=schemas.Pack, 
    response_model_exclude_none=True
)
async def pack_edit(
    request: Request,
    pack_id: int,
    pack_in: schemas.PackUpdate,
    db: Session = Depends(deps.get_db)
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """ Update an existing Pack """
    pack = crud.pack.get(db, id=pack_id)

    if not pack:
        raise HTTPException(
            status_code=404, detail="The Pack Name does not exist in the system",
        )
    pack = crud.pack.update(db, db_obj=pack, obj_in=pack_in)
    return pack


@router.delete(
    "/{pack_id}", response_model=schemas.Pack, response_model_exclude_none=True
)
async def pack_delete(
    request: Request,
    pack_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete a Pack
    """
    pack = crud.pack.get(db, id=pack_id)
    if not pack:
        raise HTTPException(
            status_code=404,
            detail="The Pack with this Name does not exist in the system",
        )
    pack = crud.pack.remove(db=db, id=pack_id)
    return pack


# @router.delete(
#     "/{category_id}", response_model=schemas.Category, response_model_exclude_none=True
# )
# async def category_delete(
#     request: Request,
#     category_id: int,
#     db: Session = Depends(deps.get_db),
#     # current_user: models.User = Depends(deps.get_current_active_superuser),
# ):
#     """
#     Delete existing Station
#     """
#     category = crud.category.get(db, id=category_id)
#     if not category:
#         raise HTTPException(
#             status_code=404,
#             detail="The Station with this Type Station does not exist in the system",
#         )
#     category = crud.category.remove(db=db, id=category_id)
#     return category


# @router.get(
#     "/{category_id}", response_model=schemas.Category, response_model_exclude_none=True
# )
# async def get_packs(
#     category_id: int,
#     # current_user: models.User = Depends(deps.get_current_active_user),
#     db: Session = Depends(deps.get_db),
# ):
#     """
#     Get a specific user by id.
#     """
#     category = crud.category.get(db, id=category_id)
#     if category:
#         return category
#     else:
#         raise HTTPException(status_code=400, detail="The category doesn't exists")

