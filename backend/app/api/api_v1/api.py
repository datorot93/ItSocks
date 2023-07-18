from fastapi import APIRouter

# from app.api.api_v1.routers import login, users
from app.api.api_v1.routers import categories, subcategories, types, designs, products, images

api_router = APIRouter()

api_router.include_router(categories.router, prefix="/categories", tags=["category"])
api_router.include_router(subcategories.router, prefix="/subcategories", tags=["subcategory"])
api_router.include_router(types.router, prefix="/types", tags=["type"])
api_router.include_router(designs.router, prefix="/designs", tags=["design"])
api_router.include_router(products.router, prefix="/products", tags=["product"])
api_router.include_router(images.router, prefix="/images", tags=["image"])
