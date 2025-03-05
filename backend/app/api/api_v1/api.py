from fastapi import APIRouter
# from app.api.api_v1.routers import login, users
from app.api.api_v1.routers import categories, subcategories, types, designs, products, images, packs, shippings, discount_codes, files, payments, sliders, sizes, colors, wish_lists, customers, users, tags, tag_products, product_sizes, orders, product_orders, size_guides, type_images, sells_reports, bulk_prices, bulk_shipping


api_router = APIRouter()

api_router.include_router(products.router, prefix="/products", tags=["product"])
api_router.include_router(wish_lists.router, prefix="/wish_list", tags=["WishList"])
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
api_router.include_router(customers.router, prefix="/customer", tags=["customers"])
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(payments.router, prefix="/payments_preference", tags=["payments"])
api_router.include_router(sliders.router, prefix="/sliders", tags=["sliders"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tags.router, prefix="/tags", tags=["tags"])
api_router.include_router(tag_products.router, prefix="/tag_products", tags=["tag_products"])
api_router.include_router(product_sizes.router, prefix="/product_sizes", tags=["product_sizes"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(product_orders.router, prefix="/product_orders", tags=["product_orders"])
api_router.include_router(size_guides.router, prefix="/size_guides", tags=["size_guides"])
api_router.include_router(type_images.router, prefix="/type_images", tags=["type_images"])
api_router.include_router(sells_reports.router, prefix="/sells-reports", tags=["sells_reports"])
api_router.include_router(bulk_prices.router, prefix="/bulk_prices", tags=["bulk_prices"])
api_router.include_router(bulk_shipping.router, prefix="/bulk_shipping", tags=["bulk_shipping"])