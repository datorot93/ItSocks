from typing import List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("", response_model_exclude_none=True)
async def product_order_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all Orders
    """

    product_orders = crud.product_order.get_multi(
        db,
        skip=skip, 
        limit=limit
    )

    # print(devices)
    response.headers["Content-Range"] = f"0-9/{len(product_orders)}"
    return product_orders


@router.get("/{product_order_id}", response_model_exclude_none=True)
async def product_order_detail(
    product_order_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get a specific Order by id
    """
    product_order = crud.product_order.get(db, id=product_order_id)

    if product_order is None:
        raise HTTPException(
            status_code=404, detail="The product_order with this id does not exist in the system",
        )

    return product_order


@router.post("", response_model_exclude_none=True)
async def product_order_create(
    request: Request,
    product_order_in: schemas.ProductOrderCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Order
    """

    product_order = crud.product_order.create(
        db,
        obj_in=product_order_in
    )
    
    return product_order


@router.put("/{product_order_id}", response_model_exclude_none=True)
async def product_order_update(
    request: Request,
    product_order_id: int,
    product_order_in: schemas.ProductOrderUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update an Order
    """
    product_order = crud.product_order.get(db, id=product_order_id)

    if product_order is None:
        raise HTTPException(
            status_code=404, detail="The product_order with this id does not exist in the system",
        )

    product_order = crud.product_order.update(
        db,
        db_obj=product_order,
        obj_in=product_order_in
    )
    
    return product_order


@router.delete("/{product_order_id}", response_model_exclude_none=True)
async def product_order_delete(
    product_order_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete an Order
    """
    product_order = crud.product_order.get(db, id=product_order_id)

    if product_order is None:
        raise HTTPException(
            status_code=404, detail="The product_order with this id does not exist in the system",
        )

    product_order = crud.product_order.remove(db, id=product_order_id)
    
    return product_order