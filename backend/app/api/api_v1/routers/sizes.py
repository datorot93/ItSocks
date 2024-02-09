from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("/size_create", response_model=schemas.Size, response_model_exclude_none=True)
async def size_create(
    request: Request,
    size_in: schemas.SizeCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Size
    """
    size = crud.size.get_size_by_name(db, size=size_in.size)

    if size:
        raise HTTPException(
            status_code=400, detail=f"Ya existe la talla que intentas crear {size_in.size}",
        )
    
    size = crud.size.create(
        db,
        obj_in=size_in
    )
    
    return size


@router.post("/product_size_create", response_model=schemas.ProductSize, response_model_exclude_none=True)
async def product_size_create(
    request: Request,
    product_size_in: schemas.ProductSizeCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Product Size
    """
    size = crud.size.get_size_by_id(db, id=product_size_in.size_id)
    product = crud.product.get_product_by_id(db, id=product_size_in.product_id)

    if not size:
        raise HTTPException(
            status_code=400, detail=f"No existe la talla con el id {product_size_in.size_id}",
        )
    
    # if not product:
    #     raise HTTPException(
    #         status_code=400, detail=f"No existe el producto con el id {product_size_in.product_id}",
    #     )
    
    product_size = crud.product_size.create(
        db,
        obj_in=product_size_in
    )
    
    return product_size


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