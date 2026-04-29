<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\SubcategoryController;
use App\Http\Controllers\Api\V1\TypeController;
use App\Http\Controllers\Api\V1\DesignController;
use App\Http\Controllers\Api\V1\TagController;
use App\Http\Controllers\Api\V1\ColorController;
use App\Http\Controllers\Api\V1\SizeController;
use App\Http\Controllers\Api\V1\ImageController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\PackController;
use App\Http\Controllers\Api\V1\DiscountCodeController;
use App\Http\Controllers\Api\V1\WishListController;
use App\Http\Controllers\Api\V1\ShippingController;
use App\Http\Controllers\Api\V1\FileController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\BulkController;
use App\Http\Controllers\Api\V1\PixelController;
use App\Http\Controllers\Api\V1\SliderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — ItSocks Laravel v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Autenticación ─────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    // ── Catálogo — público ────────────────────────────────────────────────
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/subcategories', [SubcategoryController::class, 'index']);
    Route::get('/types', [TypeController::class, 'index']);
    Route::get('/designs', [DesignController::class, 'index']);
    Route::get('/tags', [TagController::class, 'index']);
    Route::get('/colors', [ColorController::class, 'index']);
    Route::get('/sizes', [SizeController::class, 'index']);

    // ── Packs — público lectura ────────────────────────────────────────────
    Route::get('/packs', [PackController::class, 'index']);
    Route::get('/packs/{pack}', [PackController::class, 'show']);

    // ── Envíos — público — rutas estáticas ANTES de rutas dinámicas ──────────
    Route::get('/shippings/municipios', [ShippingController::class, 'municipios']);
    Route::get('/shippings/departamentos', [ShippingController::class, 'departamentos']);
    Route::get('/shippings/cost', [ShippingController::class, 'cost']);
    Route::get('/shippings', [ShippingController::class, 'index']);
    Route::get('/shippings/{shipping}', [ShippingController::class, 'show']);

    // ── Descuentos — público (validación) ─────────────────────────────────
    Route::post('/discount-codes/validate', [DiscountCodeController::class, 'validate']);
    Route::get('/discount-codes', [DiscountCodeController::class, 'index']);
    Route::get('/discount-codes/{discountCode}', [DiscountCodeController::class, 'show']);
    Route::post('/discount-codes/unique', [DiscountCodeController::class, 'createUnique']);

    // ── WishList — público por token ──────────────────────────────────────
    Route::get('/wishlists/{token}', [WishListController::class, 'show']);
    Route::post('/wishlists', [WishListController::class, 'store']);
    Route::post('/wishlists/{wishList}/products', [WishListController::class, 'addProduct']);
    Route::delete('/wishlists/{wishList}/products/{product}', [WishListController::class, 'removeProduct']);

    // ── Órdenes — POST público, resto admin ────────────────────────────────
    Route::post('/orders', [OrderController::class, 'store']);

    // ── Pagos MercadoPago ─────────────────────────────────────────────────
    Route::post('/payments/preference', [PaymentController::class, 'createPreference']);
    Route::post('/payments/webhook', [PaymentController::class, 'webhook']);

    // ── Facebook Pixel — público ──────────────────────────────────────────
    Route::post('/pixels/purchase', [PixelController::class, 'purchase']);

    // ── Sliders — público ─────────────────────────────────────────────────
    Route::get('/sliders', [SliderController::class, 'index']);

    // ── Rutas protegidas (admin) ───────────────────────────────────────────
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {

        // Catálogo admin
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::post('/subcategories', [SubcategoryController::class, 'store']);
        Route::put('/subcategories/{subcategory}', [SubcategoryController::class, 'update']);
        Route::delete('/subcategories/{subcategory}', [SubcategoryController::class, 'destroy']);

        Route::post('/types', [TypeController::class, 'store']);
        Route::put('/types/{type}', [TypeController::class, 'update']);
        Route::delete('/types/{type}', [TypeController::class, 'destroy']);

        // Imágenes
        Route::post('/images', [ImageController::class, 'store']);
        Route::delete('/images/{image}', [ImageController::class, 'destroy']);

        // Órdenes
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::put('/orders/{order}', [OrderController::class, 'update']);
        Route::patch('/orders/{order}', [OrderController::class, 'update']);
        Route::post('/orders/{order}/shipping-guide', [OrderController::class, 'addShippingGuide']);
        Route::delete('/orders/{order}', [OrderController::class, 'destroy']);

        // Packs admin
        Route::post('/packs', [PackController::class, 'store']);
        Route::put('/packs/{pack}', [PackController::class, 'update']);
        Route::delete('/packs/{pack}', [PackController::class, 'destroy']);

        // Descuentos admin
        Route::post('/discount-codes', [DiscountCodeController::class, 'store']);
        Route::put('/discount-codes/{discountCode}', [DiscountCodeController::class, 'update']);
        Route::delete('/discount-codes/{discountCode}', [DiscountCodeController::class, 'destroy']);

        // Envíos admin
        Route::post('/shippings', [ShippingController::class, 'store']);
        Route::put('/shippings/{shipping}', [ShippingController::class, 'update']);
        Route::delete('/shippings/{shipping}', [ShippingController::class, 'destroy']);

        // Sliders admin
        Route::post('/sliders', [SliderController::class, 'store']);
        Route::put('/sliders/{slider}', [SliderController::class, 'update']);
        Route::delete('/sliders/{slider}', [SliderController::class, 'destroy']);

        // Importación Excel
        Route::post('/files/import', [FileController::class, 'import']);

        // Reportes
        Route::get('/reports/sells', [ReportController::class, 'sells']);
        Route::get('/reports/sells/export', [ReportController::class, 'exportSells']);

        // Bulk operations
        Route::post('/bulk/prices', [BulkController::class, 'updatePrices']);
        Route::post('/bulk/shipping-rates', [BulkController::class, 'updateShippingRates']);
    });
});
