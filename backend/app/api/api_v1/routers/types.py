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
    "/{id}", response_model=schemas.Type, response_model_exclude_none=True
)
async def type_edit(
    request: Request,
    id: int,
    type_in: schemas.TypeUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """ Update an existing Type """
    type = crud.type.get(db, id=id)
    if not type:
        raise HTTPException(
            status_code=404,
            detail=f"No existe tipo con el ID {id}",
        )

    type = crud.type.update(
        db, db_obj=type, obj_in=type_in
    )
    return type

@router.get(
    "", 
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
    print(types)
    response.headers["Content-Range"] = f"0-9/{len(types)}"
    return types

@router.get(
    "/{id}", 
    response_model=schemas.Type, 
    response_model_exclude_none=True,
)
async def type_by_id(
    id: int,
    # current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific Type by id.
    """
    type = crud.type.get(db=db, id=id)
    if not type:
        raise HTTPException(
            status_code=404,
            detail=f"No existe el tipo con el ID {id}",
        )
    
    return type

@router.delete(
    "/{id}", response_model=schemas.Type, response_model_exclude_none=True
)
async def type_delete(
    request: Request,
    id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete existing Type
    """
    type = crud.type.get(db, id=id)
    if not type:
        raise HTTPException(
            status_code=404,
            detail=f"No existe el tipo especificado con el ID {id}",
        )
    type = crud.type.remove(db=db, id=id)

    return type