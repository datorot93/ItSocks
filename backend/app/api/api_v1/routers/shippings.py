from typing import Any, List

from fastapi import APIRouter, UploadFile, File, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/shippings", response_model=List[schemas.Shipping], response_model_exclude_none=True)
async def shipping_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all shippings
    """
    shippings = crud.shipping.get_shippings(db, skip=skip, limit=limit)
    # response.headers["Content-Range"] = f"0-9/{len(shippings)}"
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
    print('ESTOS SON LOS MUNICIPIOS')
    print(shppings)
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