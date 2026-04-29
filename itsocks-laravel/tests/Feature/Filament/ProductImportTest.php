<?php

namespace Tests\Feature\Filament;

use App\Jobs\ProductImportJob;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ProductImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_importar_productos_despacha_job_via_api(): void
    {
        Queue::fake();

        $admin = User::factory()->create(['email' => 'admin@itsocks.co']);
        $this->actingAs($admin);

        $file = UploadedFile::fake()->createWithContent(
            'productos.xlsx',
            file_get_contents(base_path('tests/fixtures/product_import_valid.xlsx'))
        );

        $response = $this->postJson('/api/v1/files/import', ['file' => $file]);

        $response->assertStatus(202);
        Queue::assertPushed(ProductImportJob::class);
    }

    public function test_job_importacion_crea_productos_en_bd(): void
    {
        $excelPath = base_path('tests/fixtures/product_import_valid.xlsx');

        $this->assertFileExists($excelPath, 'El fixture product_import_valid.xlsx debe existir');

        $job = new ProductImportJob($excelPath, 'test-job-id');
        $job->handle();

        $this->assertDatabaseCount('product', 10);
    }

    public function test_excel_invalido_no_crea_productos(): void
    {
        $excelPath = base_path('tests/fixtures/product_import_invalid.xlsx');

        $this->assertFileExists($excelPath, 'El fixture product_import_invalid.xlsx debe existir');

        $job = new ProductImportJob($excelPath, 'test-invalid-job-id');
        $job->handle();

        // Con columnas incorrectas (sin nombre/precio), ningún producto debe crearse
        $this->assertDatabaseCount('product', 0);
    }

    public function test_fixtures_existen(): void
    {
        $this->assertFileExists(
            base_path('tests/fixtures/product_import_valid.xlsx'),
            'Fixture product_import_valid.xlsx debe existir'
        );
        $this->assertFileExists(
            base_path('tests/fixtures/product_import_invalid.xlsx'),
            'Fixture product_import_invalid.xlsx debe existir'
        );
    }
}
