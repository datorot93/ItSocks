from typing import Any, List

from fastapi import APIRouter, UploadFile, File, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("discounts", response_model=List[schemas.DiscountCode], response_model_exclude_none=True)
async def get_codes_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all shippings
    """
    codes = crud.discount_code.get_codes(db, skip=skip, limit=limit)
    response.headers["Content-Range"] = f"0-9/{len(codes)}"
    return codes

@router.get("active_discounts", response_model=List[schemas.DiscountCode], response_model_exclude_none=True)
async def get_active_codes(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all shippings
    """
    codes = crud.discount_code.get_active_codes(db, skip=skip, limit=limit)

    return codes


@router.get("specific_code", response_model_exclude_none=True)
async def get_specific_code(
    response: Response,
    code: str,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get specific code
    """
    code = crud.discount_code.get_discount_by_code(db, code=code)

    if code:
        return code
    
    return None


# CREATE DISCOUNT CODE
@router.post("discount_code_create", response_model=schemas.DiscountCode, response_model_exclude_none=True)
async def discount_code_create(
    request: Request,
    discount_code_in: schemas.DiscountCodeCreate,

    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Discount Code
    """

    discount = crud.discount_code.get_discount_by_code(db, code=discount_code_in.code)
    if discount:
        raise HTTPException(
            status_code=400, detail="El código de descuento que está intentando crear ya existe",
        )
    discount = crud.discount_code.create(db, obj_in=discount_code_in)
    
    return discount