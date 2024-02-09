from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
# from app.api.api_v1.routers import login, users
from app.api.api_v1.routers import categories, subcategories, types, designs, products, images, packs, shippings, discount_codes, files, payments, sliders, sizes, colors


api_router = APIRouter()

api_router.include_router(products.router, prefix="/products", tags=["product"])
api_router.include_router(sizes.router, prefix="/sizes", tags=["sizes"])
api_router.include_router(colors.router, prefix="/colors", tags=["colors"])
api_router.include_router(categories.router, prefix="/categories", tags=["category"])
api_router.include_router(subcategories.router, prefix="/subcategories", tags=["subcategory"])
api_router.include_router(types.router, prefix="/types", tags=["type"])
api_router.include_router(designs.router, prefix="/designs", tags=["design"])
api_router.include_router(images.router, prefix="/images", tags=["image"])
api_router.include_router(packs.router, prefix="/packs", tags=["packs"])
api_router.include_router(shippings.router, prefix="/shippings", tags=["shippings"])
api_router.include_router(discount_codes.router, prefix="/discounts", tags=["discounts_codes"])
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(payments.router, prefix="/payments_preference", tags=["payments"])
api_router.include_router(sliders.router, prefix="/sliders", tags=["sliders"])
