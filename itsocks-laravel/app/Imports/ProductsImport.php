<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\Design;
use App\Models\Product;
use App\Models\Subcategory;
use App\Models\Type;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ProductsImport implements ToCollection, WithHeadingRow
{
    public int $imported = 0;
    public int $skipped = 0;
    public array $errors = [];

    public function collection(Collection $rows): void
    {
        foreach ($rows as $index => $row) {
            try {
                $this->processRow($row->toArray(), $index + 2);
            } catch (\Exception $e) {
                $this->errors[] = "Fila " . ($index + 2) . ": " . $e->getMessage();
                $this->skipped++;
            }
        }
    }

    private function processRow(array $row, int $rowNumber): void
    {
        $name = $row['name'] ?? $row['nombre'] ?? null;
        $price = $row['price'] ?? $row['precio'] ?? null;

        if (empty($name) || empty($price)) {
            throw new \InvalidArgumentException("Columnas 'name' y 'price' son requeridas.");
        }

        // Buscar o crear relaciones
        $design = null;
        if (! empty($row['design'] ?? $row['diseno'] ?? null)) {
            $design = Design::firstOrCreate(['name' => $row['design'] ?? $row['diseno']]);
        }

        $subcategory = null;
        if (! empty($row['subcategory'] ?? $row['subcategoria'] ?? null)) {
            $subcategoryName = $row['subcategory'] ?? $row['subcategoria'];
            $category = Category::firstOrCreate(['name' => $row['category'] ?? $row['categoria'] ?? 'General']);
            $subcategory = Subcategory::firstOrCreate(
                ['name' => $subcategoryName],
                ['id_category' => $category->id]
            );
        }

        $type = null;
        if (! empty($row['type'] ?? $row['tipo'] ?? null)) {
            $type = Type::firstOrCreate(['name' => $row['type'] ?? $row['tipo']]);
        }

        Product::updateOrCreate(
            ['code' => $row['code'] ?? $row['codigo'] ?? Str::slug($name)],
            [
                'name' => $name,
                'price' => (float) str_replace([',', '$'], '', (string) $price),
                'compresion' => filter_var($row['compresion'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'state' => filter_var($row['state'] ?? $row['estado'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'discount' => (int) ($row['discount'] ?? $row['descuento'] ?? 0),
                'description' => $row['description'] ?? $row['descripcion'] ?? null,
                'talla' => $row['talla'] ?? 'Única',
                'id_design' => $design?->id,
                'id_type' => $type?->id,
                'id_subcategory' => $subcategory?->id,
            ]
        );

        $this->imported++;
    }
}
