<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShippingResource;
use App\Models\Shipping;
use App\Services\ShippingCalculatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShippingController extends Controller
{
    public function __construct(private ShippingCalculatorService $shippingService) {}

    public function index(Request $request): JsonResponse
    {
        $sort = $request->input('sort');
        $range = $request->input('range');
        $filter = $request->input('filter');

        $query = Shipping::query();

        // Compatibilidad con React Admin (sort/range/filter como JSON strings)
        $likeOp = config('database.default') === 'pgsql' ? 'ilike' : 'like';

        if ($filter) {
            $filterData = is_string($filter) ? json_decode($filter, true) : $filter;
            if (is_array($filterData)) {
                foreach ($filterData as $key => $value) {
                    $query->where($key, $likeOp, "%{$value}%");
                }
            }
        }

        if ($sort) {
            $sortData = is_string($sort) ? json_decode($sort, true) : $sort;
            if (is_array($sortData) && count($sortData) === 2) {
                $direction = strtolower($sortData[1]) === 'desc' ? 'desc' : 'asc';
                $query->orderBy($sortData[0], $direction);
            }
        }

        if ($range) {
            $rangeData = is_string($range) ? json_decode($range, true) : $range;
            if (is_array($rangeData) && count($rangeData) === 2) {
                $query->skip($rangeData[0])->take($rangeData[1] - $rangeData[0] + 1);
            }
        }

        $shippings = $query->get();
        $total = Shipping::count();

        return response()->json(ShippingResource::collection($shippings))
            ->header('Content-Range', "0-19/{$total}");
    }

    public function show(Shipping $shipping): ShippingResource
    {
        return new ShippingResource($shipping);
    }

    public function municipios(): JsonResponse
    {
        $municipios = $this->shippingService->getAllMunicipios();
        return response()->json($municipios);
    }

    public function departamentos(): JsonResponse
    {
        $departamentos = $this->shippingService->getAllDepartamentos();
        return response()->json($departamentos);
    }

    public function cost(Request $request): JsonResponse
    {
        $departamento = $request->input('departamento');
        $municipio = $request->input('municipio');

        if (! $departamento || ! $municipio) {
            return response()->json(['message' => 'Se requieren departamento y municipio.'], 422);
        }

        $cost = $this->shippingService->getShippingCost($departamento, $municipio);

        if ($cost === null) {
            return response()->json(['message' => 'No se encontró tarifa para esa ciudad.'], 404);
        }

        return response()->json(['tarifa' => $cost, 'municipio' => $municipio, 'departamento' => $departamento]);
    }

    public function store(Request $request): JsonResponse|ShippingResource
    {
        $data = $request->validate([
            'municipio_ciudad' => 'required|string|max:255',
            'departamento' => 'required|string|max:255',
            'tarifa' => 'required|integer|min:0',
        ]);

        if (Shipping::where('municipio_ciudad', $data['municipio_ciudad'])->exists()) {
            return response()->json(['message' => 'The Shipping type already exists'], 400);
        }

        $shipping = Shipping::create($data);

        return (new ShippingResource($shipping))->response()->setStatusCode(201);
    }

    public function update(Request $request, Shipping $shipping): ShippingResource
    {
        $data = $request->validate([
            'municipio_ciudad' => 'nullable|string|max:255',
            'departamento' => 'nullable|string|max:255',
            'tarifa' => 'nullable|integer|min:0',
        ]);

        $shipping->update($data);

        return new ShippingResource($shipping->fresh());
    }

    public function destroy(Shipping $shipping): ShippingResource
    {
        $shipping->delete();
        return new ShippingResource($shipping);
    }
}
