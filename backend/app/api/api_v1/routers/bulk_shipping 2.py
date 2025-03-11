from typing import List
from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.put(
    "/{department}", 
    response_model_exclude_none=True
)
def update_shipping_prices(
    department: str,
    price: float,
    db: Session = Depends(deps.get_db),
):
    """
    Update shipping prices based on department
    """
    if department == "rest":
        # Actualizar todos los departamentos excepto Cundinamarca
        result = crud.shipping.update_prices_except(
            db=db,
            excluded_department="Cundinamarca",
            price=price
        )
    else:
        # Actualizar un departamento específico
        result = crud.shipping.update_prices_by_department(
            db=db,
            department=department,
            price=price
        )

    return {"updated_count": result}
