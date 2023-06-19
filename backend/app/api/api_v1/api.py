from fastapi import APIRouter

# from app.api.api_v1.routers import login, users
from app.api.api_v1.routers import categories, subcategories, types, type_subcategories, designs

api_router = APIRouter()

api_router.include_router(categories.router, prefix="/categories", tags=["category"])
api_router.include_router(subcategories.router, prefix="/subcategories", tags=["subcategory"])
api_router.include_router(types.router, prefix="/types", tags=["type"])
# api_router.include_router(type_subcategories.router, prefix="/type_subcategory", tags=["type_subcategory"])
api_router.include_router(designs.router, prefix="/designs", tags=["design"])
