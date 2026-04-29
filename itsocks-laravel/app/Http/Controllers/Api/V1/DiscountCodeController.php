<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ValidateDiscountRequest;
use App\Http\Resources\DiscountCodeResource;
use App\Models\Customer;
use App\Models\DiscountCode;
use App\Services\DiscountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DiscountCodeController extends Controller
{
    public function __construct(private DiscountService $discountService) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('limit', 100);
        $skip = $request->integer('skip', 0);

        $codes = DiscountCode::skip($skip)->take($perPage)->get();
        $total = DiscountCode::count();

        return response()->json(DiscountCodeResource::collection($codes))
            ->header('Content-Range', "0-9/{$total}");
    }

    public function show(DiscountCode $discountCode): JsonResponse
    {
        return response()->json(new DiscountCodeResource($discountCode));
    }

    /**
     * Validar un código de descuento (endpoint público).
     * Equivalente a GET /specific_code en FastAPI.
     */
    public function validate(ValidateDiscountRequest $request): JsonResponse
    {
        $result = $this->discountService->validate(
            $request->input('code'),
            (float) $request->input('subtotal', 0)
        );

        return response()->json($result);
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'code' => 'required|string|max:100|unique:discount_code,code',
            'discount' => 'required|integer|min:0|max:100',
            'discount_type' => 'nullable|string|in:percentage,fixed',
            'state' => 'nullable|boolean',
            'expiration_date' => 'nullable|date',
        ]);

        $discountCode = DiscountCode::create($data);

        return (new DiscountCodeResource($discountCode))->response()->setStatusCode(201);
    }

    public function update(Request $request, DiscountCode $discountCode): DiscountCodeResource
    {
        $data = $request->validate([
            'code' => 'nullable|string|max:100',
            'discount' => 'nullable|integer|min:0|max:100',
            'discount_type' => 'nullable|string|in:percentage,fixed',
            'state' => 'nullable|boolean',
            'expiration_date' => 'nullable|date',
        ]);

        $discountCode->update($data);

        return new DiscountCodeResource($discountCode->fresh());
    }

    public function destroy(DiscountCode $discountCode): DiscountCodeResource
    {
        $discountCode->delete();
        return new DiscountCodeResource($discountCode);
    }

    /**
     * Crear código único de descuento para nuevo cliente (bienvenida).
     * Equivalente a POST /unique_discount_code_create en FastAPI.
     */
    public function createUnique(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email',
            'name' => 'required|string|max:255',
            'promo' => 'nullable|string',
        ]);

        if (Customer::where('email', $data['email'])->exists()) {
            return response()->json([
                'message' => 'El email proporcionado ya tiene un código de descuento asociado',
            ], 400);
        }

        $customer = Customer::create([
            'email' => $data['email'],
            'full_name' => $data['name'],
        ]);

        $code = strtoupper(Str::random(8));
        $discountCode = DiscountCode::create([
            'code' => $code,
            'discount' => 10,
            'discount_type' => 'percentage',
            'state' => true,
        ]);

        return response()->json(new DiscountCodeResource($discountCode), 201);
    }
}
