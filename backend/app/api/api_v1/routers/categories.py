from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("", response_model=schemas.Category, response_model_exclude_none=True)
async def category_create(
    request: Request,
    category_in: schemas.CategoryCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Category
    """
    category = crud.category.get_category_by_name(db, name=category_in.name)
    if category:
        raise HTTPException(
            status_code=400, detail="The Category type already exists",
        )
    category = crud.category.create(db, obj_in=category_in)
    
    

    return category


@router.put(
    "/{category_id}", 
    response_model=schemas.Category, 
    response_model_exclude_none=True
)
async def station_edit(
    request: Request,
    category_id: int,
    category_in: schemas.CategoryUpdate,
    db: Session = Depends(deps.get_db)
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """ Update an existing Category """
    category = crud.category.get(db, id=category_id)

    if not category:
        raise HTTPException(
            status_code=404, detail="The Category Name does not exist in the system",
        )
    category = crud.category.update(db, db_obj=category, obj_in=category_in)
    return category


@router.get("", response_model=List[schemas.Category], response_model_exclude_none=True)
async def category_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get all categories
    """
    categories = crud.category.get_multi(db, skip=skip, limit=limit)
    response.headers["Content-Range"] = f"0-9/{len(categories)}"
    return categories


@router.delete(
    "/{category_id}", response_model=schemas.Category, response_model_exclude_none=True
)
async def category_delete(
    request: Request,
    category_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete existing Station
    """
    category = crud.category.get(db, id=category_id)
    if not category:
        raise HTTPException(
            status_code=404,
            detail="The Station with this Type Station does not exist in the system",
        )
    category = crud.category.remove(db=db, id=category_id)
    return category


@router.get(
    "/{category_id}", response_model=schemas.Category, response_model_exclude_none=True
)
async def category_by_id(
    category_id: int,
    # current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific user by id.
    """
    category = crud.category.get(db, id=category_id)
    if category:
        return category
    else:
        raise HTTPException(status_code=400, detail="The category doesn't exists")

