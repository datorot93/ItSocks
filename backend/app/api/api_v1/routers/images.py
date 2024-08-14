from typing import Any, List
from fastapi import UploadFile, APIRouter, Request, Depends, File, HTTPException, Response

# UTILITIES
from PIL import Image
import os
from datetime import datetime
from time import sleep

import boto3

from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

from app.core.config import aws_access_key, aws_secret_key, aws_region_name, aws_bucket_name

import uuid

router = APIRouter()

ruta_script = os.path.abspath(__file__)
IMAGES_FOLDER = os.path.dirname(ruta_script)

def compress_image(file, calidad=85, compress_level=1, new_width=800):
    """
    Comprime una imagen en el camino de entrada y guarda la imagen comprimida en el camino de salida.
    
    :param input_path: Ruta de la imagen de entrada.
    :param output_path: Ruta donde se guardará la imagen comprimida.
    :param calidad: Nivel de calidad de compresión (0-100), donde 100 es la mejor calidad.
    """
    try:

        imagen = Image.open(file.file)

        aspect_ratio = imagen.width / imagen.height

        new_height = int(new_width / aspect_ratio)

        resized_image = imagen.resize((new_width, new_height))
        resized_image.save(f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/temporal_{file.filename}', 'PNG', optimize=True, quality=calidad)
        # Convertir la imagen a RGB si es necesario
        if resized_image.mode in ("RGBA", "P"):
            resized_image.save(f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/{file.filename}', 'PNG', optimize=True, quality=calidad)
            sleep(1)

        else:
            resized_image.save(f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/{file.filename}', 'JPEG', optimize=True, quality=calidad)
            sleep(1)
        print(f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/{file.filename}')
        print(f'Imagen comprimida y guardada en: ./DATOS_ItSocks/temp_images/{file.filename}')

    except Exception as e:
        raise Exception(f'Ocurrió un error: {e}')


[
    '__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'close', 'content_type', 'file', 'filename', 'read', 'seek', 'spool_max_size', 'write'
]

@router.post(
    "",
    response_model=schemas.Image,
    response_model_exclude_none=True
)
async def image_create(
    id_product: int,
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Image
    """
    files = [file]
    s3 = boto3.resource(
        's3', 
        aws_access_key_id=aws_access_key, 
        aws_secret_access_key=aws_secret_key,
        region_name=aws_region_name
    )


    # for file in files:
    #     file_name = file.filename
    #     url = ""
    #     compress_image(file)

    #     ruta = ''
    #     if file_name.endswith('.png'):
    #         ruta = f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/{file.filename}'
    #     elif file_name.endswith('.jpeg'):
    #         ruta = f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/{file.filename}'
    #     elif file_name.endswith('.jpg'):
    #         ruta = f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/{file.filename}'

    #     with open(ruta, "wb") as buffer:
    #         buffer.write(await file.read())
    #         bucket = s3.Bucket('itsocks-images')
    #         obj = bucket.Object(f'{datetime.now().strftime("%Y%m%d%H%M%S")}-{file.filename}')
    #         obj.upload_file(buffer.name)
    #         url = f"https://{bucket.name}.s3.amazonaws.com/{obj.key}"

    #     image_in = schemas.ImageCreate(
    #         id_product=id_product,
    #         url = url
    #     )
    #     image = crud.image.create(
    #         db,
    #         obj_in=image_in
    #     )

    file_name = file.filename
    url = ""

    # Lee el archivo y súbelo directamente a S3
    file_content = await file.read()
    bucket = s3.Bucket('itsocks-images')
    obj = bucket.Object(f'{datetime.now().strftime("%Y%m%d%H%M%S")}-{file_name}')
    obj.put(Body=file_content)
    url = f"https://{bucket.name}.s3.amazonaws.com/{obj.key}"

    image_in = schemas.ImageCreate(
        id_product=id_product,
        url=url
    )
    image = crud.image.create(
        db,
        obj_in=image_in
    )

        # os.remove(f'{IMAGES_FOLDER}/Datos_ItSocks/temp_images/{file.filename}')
    
    return image

@router.get(
    "", 
    response_model=List[schemas.Image], 
    response_model_exclude_none=True,
)
async def image_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 1000,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all Images
    """
    images = crud.image.get_multi(
        db, 
        skip=skip, 
        limit=limit
    )
    response.headers["Content-Range"] = f"0-9/{len(images)}"
    return images

@router.get(
    "/{id_image}",  
    response_model=schemas.Image, 
    response_model_exclude_none=True,
)
async def image_by_id(
    id_image: int,
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific Image by id.
    """
    image = crud.image.get(db=db, id=id_image)
    if not image:
        raise HTTPException(
            status_code=404,
            detail=f"No existe la imagen con el ID {id_image}",
        )
    
    return image

@router.delete(
    "/{id_image}", 
    response_model=schemas.Image, 
    response_model_exclude_none=True
)
async def image_delete(
    request: Request,
    id_image: int,
    db: Session = Depends(deps.get_db),
):
    """
    Delete a Image
    """
    image = crud.image.get(db, id=id_image)
    if not image:
        raise HTTPException(
            status_code=404,
            detail=f"No existe imagen con el ID {id_image}",
        )
    image = crud.image.remove(db, id=id_image)
    return image

@router.put(
    "/{id_image}", 
    response_model=schemas.Image, 
    response_model_exclude_none=True
)
async def image_edit(
    request: Request,
    id_image: int,
    image_in: schemas.ImageUpdate,
    db: Session = Depends(deps.get_db),
):
    """ Update an existing Image """
    image = crud.image.get(db, id=id_image)
    if not image:
        raise HTTPException(
            status_code=404,
            detail=f"No existe la imagen con el ID {id_image}",
        )
    
    image = crud.image.update(
        db, db_obj=image, obj_in=image_in
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