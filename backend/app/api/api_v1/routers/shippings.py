from typing import Any, List

from fastapi import APIRouter, UploadFile, File, Request, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session

from typing import Optional

import json

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.Shipping], response_model_exclude_none=True)
async def shipping_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    sort: Optional[str] = Query(None),
    range: Optional[str] = Query(None),
    filter: Optional[str] = Query(None),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all shippings
    """
    
    # Parse the sort parameter
    sort_list = json.loads(sort) if sort else None

    # Parse the range parameter
    range_list = json.loads(range) if range else None

    # Parse the filter parameter
    filter_dict = json.loads(filter) if filter else None
    
    shippings = crud.shipping.get_shippings(
        db,
        sort=sort_list,
        range=range_list,
        filters=filter_dict
    )
    response.headers["Content-Range"] = f"0-19/{len(shippings)}"
    return shippings


@router.get("/shippings_municipios")
async def shipping_municipios(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all shipping municipios/cudades
    """
    shppings = crud.shipping.get_shipping_municipios(db, skip=skip, limit=limit)

    # response.headers["Content-Range"] = f"0-9/{len(shppings)}"
    return shppings

@router.get("/shippings_departamentos")
async def shipping_departamentos(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all shipping municipios/cudades
    """
    shppings = crud.shipping.get_shipping_departamentos(db, skip=skip, limit=limit)
    # response.headers["Content-Range"] = f"0-9/{len(shppings)}"
    return shppings

@router.get("/municipiios_by_departamento")
async def municipiios_by_departamento(
    response: Response,
    db: Session = Depends(deps.get_db),
    departamento: str = None,
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all muncicipios_by_departamento
    """
    municipios = crud.shipping.get_municipios_by_departamento(db, departamento, skip=skip, limit=limit)
    return municipios

@router.get("/shipping_cost")
async def get_shipping_cost(
    response: Response,
    db: Session = Depends(deps.get_db),
    departamento: str = None,
    municipio: str = None,
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all muncicipios_by_departamento
    """
    shipping_cost = crud.shipping.get_shipping_cost(db, departamento, municipio, skip=skip, limit=limit)
    return shipping_cost

@router.get("/{shipping_id}")
async def get_shipping_by_id(
    shipping_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get a specific shipping by id.
    """
    shipping = crud.shipping.get_shipping_by_id(db=db, id=shipping_id)
    if not shipping:
        raise HTTPException(
            status_code=404,
            detail=f"No existe el envío especificado con el ID {shipping_id}",
        )
    return shipping


@router.put("/{shipping_id}", response_model=schemas.Shipping, response_model_exclude_none=True)
async def update_shipping(
    shipping_id: int,
    shipping_in: schemas.ShippingUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update an existing Shipping
    """
    shipping = crud.shipping.get_shipping_by_id(db=db, id=shipping_id)
    if not shipping:
        raise HTTPException(
            status_code=404, detail="The Shipping does not exist in the system",
        )
    shipping = crud.shipping.update(
        db=db, db_obj=shipping, obj_in=shipping_in
    )
    return shipping


@router.delete("/{shipping_id}", response_model=schemas.Shipping, response_model_exclude_none=True)
async def delete_shipping(
    shipping_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete an existing Shipping
    """
    shipping = crud.shipping.get_shipping_by_id(db=db, id=shipping_id)
    if not shipping:
        raise HTTPException(
            status_code=404, detail="The Shipping does not exist in the system",
        )
    shipping = crud.shipping.remove(db=db, id=shipping_id)
    return shipping

@router.post("", response_model=schemas.Shipping, response_model_exclude_none=True)
async def create_shipping(
    request: Request,
    shipping_in: schemas.ShippingCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Shipping
    """

    print(shipping_in)
    shipping = crud.shipping.get_shipping_by_municipio(db, municipio_ciudad=shipping_in.municipio_ciudad)
    if shipping:
        raise HTTPException(
            status_code=400, detail="The Shipping type already exists",
        )
    shipping = crud.shipping.create(db=db, obj_in=shipping_in)
    return shipping