from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("", response_model=schemas.Subcategory, response_model_exclude_none=True)
async def subcategory_create(
    request: Request,
    subcategory_in: schemas.SubcategoryCreate,
    id_category: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Subcategory
    """
    category = crud.category.get_category_by_id(db, id=id_category)
    if not category:
        raise HTTPException(
            status_code=400,
            detail="No existe la categoría especificada"
        )

    
    subcategory = crud.subcategory.get_subcategory_by_name(db, name=subcategory_in.name)
    if subcategory:
        raise HTTPException(
            status_code=400, detail="The Subcategory type already exists",
        )
    
    subcategory = crud.subcategory.create(
        db, 
        obj_in=subcategory_in,
        id_category=id_category
    )
    
    return subcategory

@router.put(
    "/{code}", response_model=schemas.Subcategory, response_model_exclude_none=True
)
async def subcategory_edit(
    request: Request,
    code: str,
    subcategory_in: schemas.SubcategoryCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """ Update an existing Subcategory """
    subcategory = crud.subcategory.get_by_code(db, code=code)
    if not subcategory:
        raise HTTPException(
            status_code=404,
            detail=f"No existe subcategoría con el código {code}",
        )

    subcategory = crud.subcategory.update(
        db, db_obj=subcategory, obj_in=subcategory_in
    )
    return subcategory

@router.get(
    "/all_categories", 
    response_model=List[schemas.Subcategory], 
    response_model_exclude_none=True,
)
async def subcategories_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all Subcategories
    """
    subcategories = crud.subcategory.get_multi(
        db, 
        skip=skip, 
        limit=limit
    )
    # print(devices)
    response.headers["Content-Range"] = f"0-9/{len(subcategories)}"
    return subcategories

@router.delete(
    "/{code}", response_model=schemas.Subcategory, response_model_exclude_none=True
)
async def subcategory_delete(
    request: Request,
    code: str,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete existing Subcategory
    """
    subcategory = crud.subcategory.get_by_code(db, code=code)
    if not subcategory:
        raise HTTPException(
            status_code=404,
            detail=f"No existe la subcategoría especificada con el código {code}",
        )
    subcategory = crud.subcategory.remove_subcategory(db=db, code=code)
    return subcategory