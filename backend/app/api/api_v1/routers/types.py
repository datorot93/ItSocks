from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("", response_model=schemas.Type, response_model_exclude_none=True)
async def type_create(
    request: Request,
    type_in: schemas.TypeCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Subcategory
    """

    type = crud.type.get_type_by_name(db, name=type_in.name)

    if type:
        raise HTTPException(
            status_code=400, detail=f"Ya existe el tipo con el nombre {type_in.name}",
        )
    
    type = crud.type.create(
        db,
        obj_in=type_in
    )
    
    return type

@router.put(
    "/{code}", response_model=schemas.Type, response_model_exclude_none=True
)
async def type_edit(
    request: Request,
    code: str,
    type_in: schemas.TypeUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """ Update an existing Type """
    type = crud.type.get_by_code(db, code=code)
    if not type:
        raise HTTPException(
            status_code=404,
            detail=f"No existe tipo con el código {code}",
        )

    type = crud.type.update(
        db, db_obj=type, obj_in=type_in
    )
    return type

@router.get(
    "/all_types", 
    response_model=List[schemas.Type], 
    response_model_exclude_none=True,
)
async def type_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all Subcategories
    """
    types = crud.type.get_multi(
        db, 
        skip=skip, 
        limit=limit
    )
    # print(devices)
    response.headers["Content-Range"] = f"0-9/{len(types)}"
    return types

@router.delete(
    "/{code}", response_model=schemas.Type, response_model_exclude_none=True
)
async def type_delete(
    request: Request,
    code: str,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete existing Type
    """
    type = crud.type.get_by_code(db, code=code)
    if not type:
        raise HTTPException(
            status_code=404,
            detail=f"No existe el tipo especificado con el código {code}",
        )
    type = crud.type.remove_type(db=db, code=code)
    return type