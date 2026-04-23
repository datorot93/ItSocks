from typing import Any, List, Optional

import json

from fastapi import APIRouter, Request, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.ProductSize], response_model_exclude_none=True)
async def product_size_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    sort: Optional[str] = Query(None),
    range: Optional[str] = Query(None),
    filter: Optional[str] = Query(None),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all ProductSizes
    """

    # Parse the sort parameter
    sort_list = json.loads(sort) if sort else None

    # Parse the range parameter
    range_list = json.loads(range) if range else None

    # Parse the filter parameter
    filter_dict = json.loads(filter) if filter else None
    
    
    product_sizes = crud.product_size.get_product_sizes(
        db,
        sort=sort_list,
        range=range_list,
        filters = filter_dict
    )

    # print(devices)
    response.headers["Content-Range"] = f"0-19/{len(product_sizes)}"
    return product_sizes


@router.get("/{product_size_id}", response_model=schemas.ProductSize, response_model_exclude_none=True)
async def product_size_detail(
    product_size_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get a specific ProductSize by id
    """
    product_size = crud.product_size.get(db, id=product_size_id)

    if product_size is None:
        raise HTTPException(
            status_code=404, detail="The product_size with this id does not exist in the system",
        )

    return product_size


@router.post("", response_model=schemas.ProductSize, response_model_exclude_none=True)
async def product_size_create(
    request: Request,
    product_size_in: schemas.ProductSizeCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new ProductSize
    """
    print('*'*100)
    print(product_size_in)
    # product_size = crud.product_size.get_product_size_by_name(db, name=product_size_in.name)

    # if product_size:
    #     raise HTTPException(
    #         status_code=400, detail=f"Ya existe la talla que intentas crear {product_size_in.name}",
    #     )
    
    product_size = crud.product_size.create(
        db,
        obj_in=product_size_in
    )
    
    return product_size


@router.put("/{product_size_id}", response_model=schemas.ProductSize, response_model_exclude_none=True)
async def product_size_update(
    request: Request,
    product_size_id: int,
    product_size_in: schemas.ProductSizeUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update an ProductSize
    """
    product_size = crud.product_size.get(db, id=product_size_id)

    if product_size is None:
        raise HTTPException(
            status_code=404, detail="The product_size with this id does not exist in the system",
        )

    product_size = crud.product_size.update(
        db,
        db_obj=product_size,
        obj_in=product_size_in
    )
    
    return product_size


@router.delete("/{product_size_id}", response_model=schemas.ProductSize, response_model_exclude_none=True)
async def product_size_delete(
    product_size_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete an ProductSize
    """
    product_size = crud.product_size.get(db, id=product_size_id)

    if product_size is None:
        raise HTTPException(
            status_code=404, detail="The product_size with this id does not exist in the system",
        )

    product_size = crud.product_size.remove(db, id=product_size_id)
    
    return product_size