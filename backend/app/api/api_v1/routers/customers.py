from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("/create_customer", response_model=schemas.Customer, response_model_exclude_none=True)
async def customer_create(
    request: Request,
    customer_in: schemas.CustomerCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Customer
    """

    customer = crud.customer.get_by_email(db, email=customer_in.email)

    if customer:
        raise HTTPException(
            status_code=400, detail=f"Ya existe el tipo con el email {customer_in.email}",
        )
    
    customer = crud.customer.create(
        db,
        obj_in=customer_in
    )
    
    return customer

@router.put(
    "/{code}", response_model=schemas.Customer, response_model_exclude_none=True
)
async def customer_edit(
    request: Request,
    code: str,
    customer_in: schemas.CustomerUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """ Update an existing Customer """
    customer = crud.customer.get_by_code(db, code=code)
    if not customer:
        raise HTTPException(
            status_code=404,
            detail=f"No existe tipo con el código {code}",
        )

    customer = crud.customer.update(
        db, db_obj=customer, obj_in=customer_in
    )
    return customer

@router.get(
    "/all_customers", 
    response_model=List[schemas.Customer], 
    response_model_exclude_none=True,
)
async def customer_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all Subcategories
    """
    customers = crud.customer.get_multi(
        db, 
        skip=skip, 
        limit=limit
    )
    # print(devices)
    response.headers["Content-Range"] = f"0-9/{len(customers)}"
    return customers

@router.delete(
    "/{code}", response_model=schemas.Customer, response_model_exclude_none=True
)
async def customer_delete(
    request: Request,
    code: str,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete existing Customer
    """
    customer = crud.customer.get_by_code(db, code=code)
    if not customer:
        raise HTTPException(
            status_code=404,
            detail=f"No existe el tipo especificado con el código {code}",
        )
    customer = crud.customer.remove_customer(db=db, code=code)
    return customer