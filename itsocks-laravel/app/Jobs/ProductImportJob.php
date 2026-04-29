<?php

namespace App\Jobs;

use App\Imports\ProductsImport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ProductImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;
    public int $tries = 3;

    public function __construct(
        public string $filePath,
        public string $jobId
    ) {}

    public function handle(): void
    {
        Cache::put("import_job_{$this->jobId}_status", 'processing', 3600);

        try {
            Excel::import(new ProductsImport(), $this->filePath);
            Cache::put("import_job_{$this->jobId}_status", 'completed', 3600);
            Cache::put("import_job_{$this->jobId}_completed_at", now()->toISOString(), 3600);
        } catch (\Exception $e) {
            Log::error('ProductImportJob falló', [
                'job_id' => $this->jobId,
                'error' => $e->getMessage(),
            ]);
            Cache::put("import_job_{$this->jobId}_status", 'failed', 3600);
            Cache::put("import_job_{$this->jobId}_error", $e->getMessage(), 3600);
            throw $e;
        }
    }
}
