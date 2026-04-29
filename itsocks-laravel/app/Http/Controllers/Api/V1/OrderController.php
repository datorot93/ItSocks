<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddShippingGuideRequest;
use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('limit', 100);
        $skip = $request->integer('skip', 0);

        $query = Order::with('productOrders.product')
            ->orderBy('created_at', 'desc');

        $orders = $query->skip($skip)->take($perPage)->get();
        $total = Order::count();

        return response()->json($orders->map(fn ($order) => new OrderResource($order)))
            ->header('Content-Range', "0-{$perPage}/{$total}");
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['productOrders.product.sizes', 'productOrders.product.type']);

        $resource = new OrderResource($order);
        $data = $resource->toArray(request());

        // Enriquecer products igual que FastAPI
        if ($order->productOrders) {
            $products = [];
            foreach ($order->productOrders->sortBy('num_in_order') as $productOrder) {
                $product = $productOrder->product;
                if (! $product) {
                    continue;
                }

                $productData = $product->toArray();
                $productData['cantidad'] = $productOrder->quantity;
                $productData['num_in_order'] = $productOrder->num_in_order;
                $productData['discount'] = $productOrder->discount;
                $productData['discount_code'] = $productOrder->discount_code;
                $productData['price_paid'] = $productOrder->price_paid;
                $productData['pack'] = ($productOrder->pack && str_contains(strtolower($productOrder->pack), 'pares'))
                    ? $productOrder->pack
                    : '';
                $productData['product_size'] = $product->sizes->first()?->size;
                $productData['type'] = $product->type?->name;
                $products[] = $productData;
            }

            $data['products'] = collect($products)->sortBy('num_in_order')->values()->toArray();
            unset($data['products_default']);
        }

        return response()->json($data);
    }

    public function store(CreateOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->create($request->validated());

        return response()->json(['data' => new OrderResource($order)], 201);
    }

    public function update(UpdateOrderRequest $request, Order $order): JsonResponse
    {
        $data = $request->validated();

        // Lógica de FastAPI: si hay nueva guía de envío, cambiar estado
        $previousGuideUrl = $order->shipping_guide_url;
        $previousGuideNumber = $order->shipping_guide_number;

        $newGuideUrl = $data['shipping_guide_url'] ?? null;
        $newGuideNumber = $data['shipping_guide_number'] ?? null;

        if (
            $newGuideUrl && $newGuideNumber &&
            ($previousGuideUrl !== $newGuideUrl || $previousGuideNumber !== $newGuideNumber)
        ) {
            $data['status'] = $data['status'] ?? 'shipped';
            $data['shipping_guide'] = 'Asignada';
        }

        $order->update($data);

        return response()->json(new OrderResource($order->fresh()));
    }

    public function addShippingGuide(AddShippingGuideRequest $request, Order $order): JsonResponse
    {
        $validated = $request->validated();
        $order = $this->orderService->addShippingGuide(
            $order,
            $validated['tracking_number'],
            $validated['shipping_guide_url'] ?? null
        );

        return response()->json(new OrderResource($order));
    }

    public function destroy(Order $order): JsonResponse
    {
        $order->delete();
        return response()->json(['message' => 'Orden eliminada.']);
    }
}
