from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("color_create", response_model=schemas.Color, response_model_exclude_none=True)
async def color_create(
    request: Request,
    color_in: schemas.ColorCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Color
    """
    color = crud.color.get_color_by_name(db, name=color_in.name)

    if color:
        raise HTTPException(
            status_code=400, detail=f"Ya existe la talla que intentas crear {color_in.name}",
        )
    
    color = crud.color.create(
        db,
        obj_in=color_in
    )
    
    return color


@router.post("product_color_create", response_model=schemas.ProductColor, response_model_exclude_none=True)
async def color_create(
    request: Request,
    product_color_in: schemas.ProductColorCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new ProductColor
    """
    # color = crud.color.get_color_by_name(db, name=product_color_in.name)

    # if color:
    #     raise HTTPException(
    #         status_code=400, detail=f"Ya existe la talla con el ID {product_color_in.color_id}",
    #     )
    
    product_color = crud.product_color.create(
        db,
        obj_in=product_color_in
    )
    
    return product_color


@router.put(
    "/{code}", response_model=schemas.Type, response_model_exclude_none=True
)
async def type_edit(
    request: Request,
    code: str,
    type_in: schemas.TypeUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """ Update an existing Type """
    type = crud.type.get_by_code(db, code=code)
    if not type:
        raise HTTPException(
            status_code=404,
            detail=f"No existe tipo con el código {code}",
        )

    type = crud.type.update(
        db, db_obj=type, obj_in=type_in
    )
    return type

@router.get(
    "/all_types", 
    response_model=List[schemas.Type], 
    response_model_exclude_none=True,
)
async def type_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all Subcategories
    """
    types = crud.type.get_multi(
        db, 
        skip=skip, 
        limit=limit
    )
    # print(devices)
    response.headers["Content-Range"] = f"0-9/{len(types)}"
    return types

@router.delete(
    "/{code}", response_model=schemas.Type, response_model_exclude_none=True
)
async def type_delete(
    request: Request,
    code: str,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete existing Type
    """
    type = crud.type.get_by_code(db, code=code)
    if not type:
        raise HTTPException(
            status_code=404,
            detail=f"No existe el tipo especificado con el código {code}",
        )
    type = crud.type.remove_type(db=db, code=code)
    return type