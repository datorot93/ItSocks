from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("", response_model=schemas.WishList, response_model_exclude_none=True)
async def wish_list_create(
    request: Request,
    wish_list_in: schemas.WishListCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new WishList
    """

    wish_list = crud.wish_list.get_wish_list_by_id_list(db, id_list=wish_list_in.id_list)

    if wish_list:
        raise HTTPException(
            status_code=400, detail=f"Ya existe la wish list con el id {wish_list_in.id_list}",
        )
    
    wish_list = crud.wish_list.create(
        db,
        obj_in=wish_list_in
    )
    
    return wish_list


@router.get(
    "/get_wish_list_by_id_list/{id_list}", 
    response_model=List[schemas.WishList], 
    response_model_exclude_none=True,
)
async def get_wish_list_by_id_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    id_list: str = None
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get WishList by id_list
    """
    wish_lists = crud.wish_list.get_wish_list_by_id_list(
        db,
        id_list=id_list
    )
    # print(devices)
    # response.headers["Content-Range"] = f"0-9/{len(wish_lists)}"
    return wish_lists


@router.put(
    "/{code}", response_model=schemas.WishList, response_model_exclude_none=True
)
async def wish_list_edit(
    request: Request,
    code: str,
    wish_list_in: schemas.WishListUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """ Update an existing WishList """
    wish_list = crud.wish_list.get_by_code(db, code=code)
    if not wish_list:
        raise HTTPException(
            status_code=404,
            detail=f"No existe tipo con el código {code}",
        )

    wish_list = crud.wish_list.update(
        db, db_obj=wish_list, obj_in=wish_list_in
    )
    return wish_list



@router.delete(
    "/{code}", response_model=schemas.WishList, response_model_exclude_none=True
)
async def wish_list_delete(
    request: Request,
    code: str,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete existing WishList
    """
    wish_list = crud.wish_list.get_by_code(db, code=code)
    if not wish_list:
        raise HTTPException(
            status_code=404,
            detail=f"No existe el tipo especificado con el código {code}",
        )
    wish_list = crud.wish_list.remove_wish_list(db=db, code=code)
    return wish_list