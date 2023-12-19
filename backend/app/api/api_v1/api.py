from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
# from app.api.api_v1.routers import login, users
from app.api.api_v1.routers import categories, subcategories, types, designs, products, images, packs, shippings, discount_codes, files

origins = [
    "http://itsocks-static-files.s3-website.us-east-2.amazonaws.com",
    "https://itsocks-static-files.s3-website.us-east-2.amazonaws.com",
    "http://localhost",
    "http://localhost:8080",
]

api_router = APIRouter()

api_router.include_router(products.router, prefix="/products", tags=["product"])
api_router.include_router(categories.router, prefix="/categories", tags=["category"])
api_router.include_router(subcategories.router, prefix="/subcategories", tags=["subcategory"])
api_router.include_router(types.router, prefix="/types", tags=["type"])
api_router.include_router(designs.router, prefix="/designs", tags=["design"])
api_router.include_router(images.router, prefix="/images", tags=["image"])
api_router.include_router(packs.router, prefix="/packs", tags=["packs"])
api_router.include_router(shippings.router, prefix="/shippings", tags=["shippings"])
api_router.include_router(discount_codes.router, prefix="/discounts", tags=["discounts_codes"])
api_router.include_router(files.router, prefix="/files", tags=["files"])
