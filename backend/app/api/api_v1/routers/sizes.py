from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.Size], response_model_exclude_none=True)
async def size_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all Sizes
    """

    sizes = crud.size.get_sizes(
        db, 
        skip=skip, 
        limit=limit
    )

    # print(devices)
    response.headers["Content-Range"] = f"0-9/{len(sizes)}"
    return sizes


@router.get("/{size_id}", response_model=schemas.Size, response_model_exclude_none=True)
async def size_detail(
    size_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get a specific Size by id
    """
    size = crud.size.get(db, id=size_id)

    if size is None:
        raise HTTPException(
            status_code=404, detail="The size with this id does not exist in the system",
        )

    return size


@router.post("", response_model=schemas.Size, response_model_exclude_none=True)
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


@router.put("/{size_id}", response_model=schemas.Size, response_model_exclude_none=True)
async def size_update(
    request: Request,
    size_id: int,
    size_in: schemas.SizeUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update an Size
    """
    size = crud.size.get(db, id=size_id)

    if size is None:
        raise HTTPException(
            status_code=404, detail="The size with this id does not exist in the system",
        )

    size = crud.size.update(
        db,
        db_obj=size,
        obj_in=size_in
    )
    
    return size


@router.delete("/{size_id}", response_model=schemas.Size, response_model_exclude_none=True)
async def size_delete(
    size_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete an Size
    """
    size = crud.size.get(db, id=size_id)

    if size is None:
        raise HTTPException(
            status_code=404, detail="The size with this id does not exist in the system",
        )

    size = crud.size.remove(db, id=size_id)
    
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