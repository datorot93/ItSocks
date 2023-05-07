# from fastapi import APIRouter

# # from app.api.api_v1.routers import login, users
# from app.api.api_v1.routers import login, users, stations, orders_detail, files, pauses, user_order

# api_router = APIRouter()
# api_router.include_router(login.router, tags=["login"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(stations.router, prefix="/stations", tags=["stations"])
# api_router.include_router(files.router, prefix="/files", tags=["files management"])
# # api_router.include_router(devices.router, prefix="/devices", tags=["devices"])
# api_router.include_router(
#     orders_detail.router, prefix="/orders_detail", tags=["Orders"]
# )
# api_router.include_router(user_order.router, prefix="/user_order", tags=["User Order"])
# api_router.include_router(pauses.router, prefix="/pauses", tags=["Pauses"])