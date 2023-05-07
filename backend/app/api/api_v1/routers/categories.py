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
    category = crud.category.get_by_name(db, nombre=category_in.nombre)
    if category:
        raise HTTPException(
            status_code=400, detail="The Category type already exists",
        )
    category = crud.category.create(db, obj_in=category_in)
    return category


# @router.put(
#     "/{station_id}", response_model=schemas.Station, response_model_exclude_none=True
# )
# async def station_edit(
#     request: Request,
#     station_id: int,
#     station_in: schemas.StationUpdate,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_superuser),
# ):
#     """ Update an existing Station """
#     station = crud.station.get(db, id=station_id)

#     if not station:
#         raise HTTPException(
#             status_code=404, detail="The Station Type does not exist in the system",
#         )
#     station = crud.station.update(db, db_obj=station, obj_in=station_in)
#     return station


# @router.get("", response_model=List[schemas.Station], response_model_exclude_none=True)
# async def stations_list(
#     response: Response,
#     db: Session = Depends(deps.get_db),
#     skip: int = 0,
#     limit: int = 100,
#     current_user: models.User = Depends(deps.get_current_active_user),
# ):
#     """
#     Get all stations
#     """
#     stations = crud.station.get_multi(db, skip=skip, limit=limit)
#     response.headers["Content-Range"] = f"0-9/{len(stations)}"
#     return stations


# @router.delete(
#     "/{station_id}", response_model=schemas.Station, response_model_exclude_none=True
# )
# async def station_delete(
#     request: Request,
#     station_id: int,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_superuser),
# ):
#     """
#     Delete existing Station
#     """
#     station = crud.station.get(db, id=station_id)
#     if not station:
#         raise HTTPException(
#             status_code=404,
#             detail="The Station with this Type Station does not exist in the system",
#         )
#     station = crud.station.remove(db=db, id=station_id)
#     return station


# @router.get(
#     "/{station_id}", response_model=schemas.Station, response_model_exclude_none=True
# )
# async def station_by_id(
#     station_id: int,
#     current_user: models.User = Depends(deps.get_current_active_user),
#     db: Session = Depends(deps.get_db),
# ):
#     """
#     Get a specific user by id.
#     """
#     station = crud.station.get(db, id=station_id)
#     if station:
#         return station
#     else:
#         raise HTTPException(status_code=400, detail="The station doesn't exists")

