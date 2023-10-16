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

@router.post("/upload_image", response_model=schemas.Image, response_model_exclude_none=True)
async def image_create(
    request: Request,
    # image_in: schemas.ImageCreate,
    # file: str,
    id_product: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    
    """
    Create a new Image
    """

    s3 = boto3.resource(
        's3', 
        aws_access_key_id=aws_access_key, 
        aws_secret_access_key=aws_secret_key,
        region_name=aws_region_name
    )
    for file in files:
        file_name = file.filename
        url = ""
        with open(file_name, "wb") as buffer:
            buffer.write(await file.read())
            bucket = s3.Bucket('itsocks-images')
            obj = bucket.Object(file.filename)
            obj.upload_file(buffer.name)
            url = f"https://{bucket.name}.s3.amazonaws.com/{obj.key}"

        image_in = schemas.ImageCreate(
            id_product=id_product,
            url = url
        )
        image = crud.image.create(
            db,
            obj_in=image_in
        )
    
    return image

# @router.put(
#     "/{id_product}", response_model=schemas.Type, response_model_exclude_none=True
# )
# async def image_edit(
#     request: Request,
#     url: int,
#     image_in: schemas.ImageUpdate,
#     db: Session = Depends(deps.get_db),
#     file: UploadFile = File(...)
#     # current_user: models.User = Depends(deps.get_current_active_user),
# ):
#     """ Update an existing Type """
#     image = crud.image.get_image_by_id_url(db, url=url)
#     if not image:
#         raise HTTPException(
#             status_code=404,
#             detail=f"No existe la imagen con la {url}",
#         )
    

#     image = crud.image.update(
#         db, db_obj=image, obj_in=image_in
#     )
#     return image

# @router.get(
#     "/all_types", 
#     response_model=List[schemas.Type], 
#     response_model_exclude_none=True,
# )
# async def type_list(
#     response: Response,
#     db: Session = Depends(deps.get_db),
#     skip: int = 0,
#     limit: int = 100,
#     # current_user: models.User = Depends(deps.get_current_active_superuser),
# ):
#     """
#     Get all Subcategories
#     """
#     types = crud.type.get_multi(
#         db, 
#         skip=skip, 
#         limit=limit
#     )
#     # print(devices)
#     response.headers["Content-Range"] = f"0-9/{len(types)}"
#     return types

# @router.delete(
#     "/{code}", response_model=schemas.Type, response_model_exclude_none=True
# )
# async def type_delete(
#     request: Request,
#     code: str,
#     db: Session = Depends(deps.get_db),
#     # current_user: models.User = Depends(deps.get_current_active_superuser),
# ):
#     """
#     Delete existing Type
#     """
#     type = crud.type.get_by_code(db, code=code)
#     if not type:
#         raise HTTPException(
#             status_code=404,
#             detail=f"No existe el tipo especificado con el código {code}",
#         )
#     type = crud.type.remove_type(db=db, code=code)
#     return type