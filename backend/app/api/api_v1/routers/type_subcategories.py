from typing import Any, List
from datetime import datetime
import pytz

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
# from app.core import verify_exists_stations_by_ref, get_next_station

router = APIRouter()


@router.post("", response_model=schemas.TypeSubcategory, response_model_exclude_none=True)
async def type_subcategory_create(
    request: Request,
    type_subcategory_in: schemas.TypeSubcategoryCreate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Create a new User Type Subcategory
    """

    type = crud.type.get(
        db, 
        id=type_subcategory_in.type_id
    )
    if not type:
        raise HTTPException(
            status_code=404, detail="The user with the specified ID does not exists",
        )
    
    subcategory = crud.subcategory.get(
        db, 
        id=type_subcategory_in.subcategory_id
    )
    if not subcategory:
        raise HTTPException(
            status_code=404, detail="The Order with the specified ID does not exists",
        )

    type_subcategory = crud.type_subcategory.create(
        db, 
        obj_in=type_subcategory_in
    )
    return type_subcategory


@router.put(
    "/{type_id}-{subcategory_id}", response_model=schemas.TypeSubcategory, response_model_exclude_none=True
)
async def type_subcategory_edit(
    request: Request,
    type_id: int,
    subcategory_id: int,
    type_subcategory_in: schemas.TypeSubcategoryUpdate,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """ Update an existing TypeSubcategory """
    type_subcategory = crud.type_subcategory.get_by_ids(
        db, 
        type_id=type_id,
        subcategory_id=subcategory_id
    )

    print(type_subcategory)

    if not type_subcategory:
        raise HTTPException(
            status_code=404,
            detail=f"No existe ninguna relación entre la subcategoría {subcategory_id} y el tipo {type_id}",
        )

    type_subcategory = crud.type_subcategory.update(
        db, db_obj=type_subcategory, obj_in=type_subcategory_in
    )
    return type_subcategory


# @router.put(
#     "/start_order/{id}",
#     response_model=schemas.OrderDetail,
#     response_model_exclude_none=True,
# )
# async def order_detail_start(
#     request: Request,
#     id: int,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ):
#     """ Start an order"""
#     order_detail = crud.order_detail.get_by_id(db, id=id)


#     if not order_detail:
#         raise HTTPException(
#             status_code=404,
#             detail="The Order specified does not exists in the Data Base",
#         )

#     if order_detail.state == "In pause":
#         delta = datetime.now() - order_detail.delta_timestamp
#         total = order_detail.total_time + (delta.seconds)
#         order_detail_in = {
#             "state": "In process",
#             "delta_timestamp": datetime.now(),
#             "total_time": total,
#             "start_timestamp": order_detail.start_timestamp,
#             "priority": order_detail.priority,
#             "id_station": order_detail.id_station,
#         }
#     elif order_detail.state == 'To Start' and order_detail.id_station == 1:
#         order_detail_in = {
#             "state": "In process",
#             "delta_timestamp": datetime.now(),
#             "total_time": 0,
#             "start_timestamp": datetime.utcnow(),
#             "priority": order_detail.priority,
#             "id_station": order_detail.id_station,
#         }

#     else:
#         delta = datetime.now() - order_detail.delta_timestamp
#         total = order_detail.total_time + (delta.seconds)
#         order_detail_in = {
#             'state': 'In process',
#             'delta_timestamp': datetime.now(),
#             'total_time': total,
#             'start_timestamp': order_detail.start_timestamp,
#             'priority': order_detail.priority,
#             'id_station': order_detail.id_station
#         }
        
#     order_detail = crud.order_detail.update(db, 
#                                             db_obj=order_detail, 
#                                             obj_in=order_detail_in
#                                         )
    
#     user_order = schemas.UserOrderCreate(
#         id_user=current_user.id,
#         id_order_detail=order_detail.id
#     )

#     crud.user_order.create(
#         db,
#         obj_in=user_order
#     )

#     return order_detail


# @router.put(
#     "/finish_station/{id}",
#     response_model=schemas.OrderDetail,
#     response_model_exclude_none=True,
# )
# async def order_detail_finish_station(
#     request: Request,
#     id: int,
#     units_done: int = None,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ):
#     """ Start an order"""
#     order_detail = crud.order_detail.get_by_id(db, id=id)
#     if not order_detail:
#         raise HTTPException(
#             status_code=404,
#             detail="The Order specified does not exists in the Data Base",
#         )
#     if verify_exists_stations_by_ref(order_detail.product_reference, db):
#         next_station = get_next_station(
#             order_detail.product_reference, db, order_detail.id_station
#         )
#     delta = datetime.now() - order_detail.delta_timestamp
#     total = order_detail.total_time + (delta.seconds)

#     if isinstance(next_station, type(None)):
#         order_detail_in = {
#             "state": "Finished",
#             "delta_timestamp": datetime.utcnow(),
#             "total_time": total,
#             "start_timestamp": order_detail.start_timestamp,
#             "priority": order_detail.priority,
#             "id_station": order_detail.id_station,
#             "total_units": units_done,
#         }
#     else:
#         order_detail_in = {

#             'state': 'To Start',
#             'delta_timestamp': datetime.utcnow(),
#             'total_time': total,
#             'start_timestamp': order_detail.start_timestamp,
#             'priority': order_detail.priority,
#             'id_station': next_station.estacion,
#             'total_units': units_done
#         }

#     order_detail = crud.order_detail.update(
#         db, db_obj=order_detail, obj_in=order_detail_in
#     )

#     crud.user_order.remove_user_order(
#         db,
#         id_user=current_user.id,
#         id_order_detail=order_detail.id
#     )

#     return order_detail


# @router.put(
#     "/add_priority/{id}",
#     response_model=schemas.OrderDetail,
#     response_model_exclude_none=True,
# )
# async def add_priority(
#     request: Request,
#     id: int,
#     priority: int = None,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_superuser),
# ):
#     """ Start an order"""
#     order_detail = crud.order_detail.get_by_id(db, id=id)
#     if not order_detail:
#         raise HTTPException(
#             status_code=404,
#             detail="The Order specified does not exists in the Data Base",
#         )

#     order_detail_in = {"priority": priority}

#     order_detail = crud.order_detail.update(
#         db, db_obj=order_detail, obj_in=order_detail_in
#     )
#     return order_detail


# @router.get(

#     "/all", 
#     response_model=List[schemas.OrderDetail], 
#     response_model_exclude_none=True,
# )
# async def orders_list(
#     response: Response,
#     db: Session = Depends(deps.get_db),
#     skip: int = 0,
#     limit: int = 100,
#     current_user: models.User = Depends(deps.get_current_active_superuser),
# ):
#     """
#     Get all stations
#     """
#     orders = crud.order_detail.get_multi(
#         db, 
#         skip=skip, 
#         limit=limit
#     )
#     # print(devices)
#     response.headers["Content-Range"] = f"0-9/{len(orders)}"
#     return orders


# @router.get(
#     "/list_by_station", 
#     response_model=List[schemas.OrderDetail], 
#     response_model_exclude_none=True,
# )
# async def orders_list_by_station(
#     response: Response,
#     id_station: int,
#     db: Session = Depends(deps.get_db),
#     skip: int = 0,
#     limit: int = 100,
#     current_user: models.User = Depends(deps.get_current_active_user),
# ):
#     """
#     Get all stations
#     """
#     orders = crud.order_detail.get_multi_by_station(
#         db, id_station=id_station, skip=skip, limit=limit
#     )
#     # print(devices)
#     response.headers["Content-Range"] = f"0-9/{len(orders)}"
#     return orders


# @router.get(
#     "/ordered",
#     response_model=List[schemas.OrderDetail],
#     response_model_exclude_none=True,
# )
# async def orders_list_by_station_ordered(
#     response: Response,
#     id_station: int,
#     db: Session = Depends(deps.get_db),
#     skip: int = 0,
#     limit: int = 100,
#     current_user: models.User = Depends(deps.get_current_active_user),
# ):
#     """
#     Get all stations from an specific station and ordered by priority
#     """
#     orders = crud.order_detail.get_multi_by_station_ordered(
#         db, id_station=id_station, skip=skip, limit=limit
#     )
#     # print(devices)
#     response.headers["Content-Range"] = f"0-9/{len(orders)}"
#     return orders


# @router.delete(
#     "/{reference}", response_model=schemas.OrderDetail, response_model_exclude_none=True
# )
# async def user_order_delete(
#     request: Request,
#     id_user: int,
#     id_order_detail: int,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_superuser),
# ):
#     """
#     Delete existing Order
#     """
#     order_detail = crud.user_order.get_by_ids(db, id_user=id_user, id_order_detail=id_order_detail)
#     if not order_detail:
#         raise HTTPException(
#             status_code=404,
#             detail="The Order with the reference especified does not exists in the system",
#         )
#     order_detail = crud.user_order.remove_user_order(db=db, id_user=id_user, id_order_detail=id_order_detail)
#     return order_detail

