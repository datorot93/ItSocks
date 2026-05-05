<?php

/**
 * Script para generar los fixtures de Excel para los tests de F6.
 * Ejecutar con: php tests/fixtures/generate_fixtures.php
 */

require_once __DIR__ . '/../../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

// --- product_import_valid.xlsx (10 productos válidos) ---
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

// Headers
$headers = ['nombre', 'precio', 'categoria', 'subcategoria', 'tipo', 'disenio', 'compresion', 'activo', 'codigo'];
foreach ($headers as $col => $header) {
    $sheet->setCellValueByColumnAndRow($col + 1, 1, $header);
}

// 10 productos válidos
$products = [
    ['Media deportiva básica', 25000, 'Deporte', 'Running', 'Corta', 'Rayas', 0, 1, 'DEP-001'],
    ['Media compresión premium', 45000, 'Salud', 'Compresión', 'Alta', 'Lisa', 1, 1, 'SAL-001'],
    ['Media casual algodón', 15000, 'Casual', 'Diaria', 'Media', 'Colores', 0, 1, 'CAS-001'],
    ['Media niños animales', 12000, 'Niños', 'Infantil', 'Corta', 'Animales', 0, 1, 'NIÑ-001'],
    ['Media formal ejecutiva', 35000, 'Formal', 'Ejecutivo', 'Larga', 'Líneas', 0, 1, 'FOR-001'],
    ['Media térmica invierno', 40000, 'Especialidad', 'Térmica', 'Alta', 'Sólido', 0, 1, 'TER-001'],
    ['Media antideslizante yoga', 30000, 'Deporte', 'Yoga', 'Corta', 'Puntos', 0, 1, 'YOG-001'],
    ['Media tobillera sport', 20000, 'Deporte', 'Running', 'Tobillera', 'Geométrico', 0, 1, 'TOB-001'],
    ['Media compresión travesía', 55000, 'Salud', 'Compresión', 'Larga', 'Gris', 1, 1, 'SAL-002'],
    ['Media divertida fruta', 18000, 'Casual', 'Divertida', 'Media', 'Frutas', 0, 1, 'CAS-002'],
];

foreach ($products as $rowIdx => $product) {
    foreach ($product as $colIdx => $value) {
        $sheet->setCellValueByColumnAndRow($colIdx + 1, $rowIdx + 2, $value);
    }
}

$writer = new Xlsx($spreadsheet);
$writer->save(__DIR__ . '/product_import_valid.xlsx');
echo "Creado: product_import_valid.xlsx (10 productos)\n";

// --- product_import_invalid.xlsx (Excel con columnas faltantes) ---
$spreadsheet2 = new Spreadsheet();
$sheet2 = $spreadsheet2->getActiveSheet();

// Headers incorrectos (sin 'nombre' ni 'precio')
$invalidHeaders = ['product_name', 'cost', 'category'];
foreach ($invalidHeaders as $col => $header) {
    $sheet2->setCellValueByColumnAndRow($col + 1, 1, $header);
}

$sheet2->setCellValueByColumnAndRow(1, 2, 'Media sin nombre correcto');
$sheet2->setCellValueByColumnAndRow(2, 2, 10000);
$sheet2->setCellValueByColumnAndRow(3, 2, 'Deporte');

$writer2 = new Xlsx($spreadsheet2);
$writer2->save(__DIR__ . '/product_import_invalid.xlsx');
echo "Creado: product_import_invalid.xlsx (columnas incorrectas)\n";

echo "Fixtures generados exitosamente.\n";
