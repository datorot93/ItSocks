from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("", response_model=schemas.Design, response_model_exclude_none=True)
async def design_create(
    request: Request,
    design_in: schemas.DesignCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new Subcategory
    """
    design = crud.design.get_design_by_name(db, name=design_in.name)

    if design:
        raise HTTPException(
            status_code=400, detail=f"Ya existe un diseño con el nombre {design_in.name}",
        )
    
    design = crud.design.create(
        db,
        obj_in=design_in
    )
    
    return design

@router.put(
    "/{id}", response_model=schemas.Design, response_model_exclude_none=True
)
async def desing_edit(
    request: Request,
    id: int,
    design_in: schemas.DesignUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """ Update an existing Type """
    design = crud.design.get(db, id=id)
    if not design:
        raise HTTPException(
            status_code=404,
            detail=f"No existe diseño con el ID {id}",
        )

    design = crud.design.update(
        db, db_obj=design, obj_in=design_in
    )
    return design

@router.get(
    "", 
    response_model=List[schemas.Design], 
    response_model_exclude_none=True,
)
async def design_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all Designs
    """
    designs = crud.design.get_multi(
        db, 
        skip=skip, 
        limit=limit
    )
    # print(devices)
    response.headers["Content-Range"] = f"0-9/{len(designs)}"
    return designs

@router.get(
    "/{id}", response_model=schemas.Design, response_model_exclude_none=True
)
async def design_by_id(
    id: int,
    # current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific Design by id.
    """
    design = crud.design.get(db, id=id)
    if not design:
        raise HTTPException(
            status_code=404,
            detail=f"No existe el diseño con el ID {id}",
        )
    return design

@router.delete(
    "/{id}", response_model=schemas.Design, response_model_exclude_none=True
)
async def design_delete(
    request: Request,
    id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete existing Design
    """
    design = crud.design.get(db, id=id)
    if not design:
        raise HTTPException(
            status_code=404,
            detail=f"No existe el tipo especificado con el código {id}",
        )
    design = crud.design.remove(db=db, id=id)
    return design