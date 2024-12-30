from typing import Any, List

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get(
    "", response_model=List[schemas.User], response_model_exclude_none=True,
)
async def users_list(
    response: Response,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Get all users
    """
    users = crud.user.get_multi(db, skip=skip, limit=limit)
    response.headers["Content-Range"] = f"0-9/{len(users)}"
    return users


# @router.get("/me", response_model=schemas.User, response_model_exclude_none=True)
# async def user_me(
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ):
#     """
#     Get own user
#     """
#     return current_user


@router.get(
    "/{user_id}", response_model=schemas.User, response_model_exclude_none=True,
)
async def user_details(
    user_id: int,
    # current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    """
    Get a specific user by id.
    """
    user = crud.user.get(db, id=user_id)
    # if user == current_user:
    #     return user
    # if not crud.user.is_admin(current_user):
    #     raise HTTPException(
    #         status_code=400, detail="The user doesn't have enough privileges"
    #     )
    return user


@router.post("", response_model=schemas.User, response_model_exclude_none=True)
async def user_create(
    request: Request,
    user_in: schemas.UserCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Create a new user
    """
    user = crud.user.get_by_username(db, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    return user


@router.put("/{user_id}", response_model=schemas.User, response_model_exclude_none=True)
async def user_edit(
    request: Request,
    user_id: int,
    user_in: schemas.UserUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Update existing user
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system",
        )
    user = crud.user.update(db, db_obj=user, obj_in=user_in)
    return user


@router.delete(
    "/{user_id}", response_model=schemas.User, response_model_exclude_none=True
)
async def user_delete(
    request: Request,
    user_id: int,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser),
):
    """
    Delete existing user
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system",
        )
    user = crud.user.remove(db=db, id=user_id)
    return user
