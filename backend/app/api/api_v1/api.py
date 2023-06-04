from fastapi import APIRouter

# from app.api.api_v1.routers import login, users
from app.api.api_v1.routers import categories, subcategories

api_router = APIRouter()

api_router.include_router(categories.router, prefix="/categories", tags=["category"])
api_router.include_router(subcategories.router, prefix="/subcategories", tags=["subcategory"])
