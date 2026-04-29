<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Jobs\ProductImportJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    /**
     * Subir Excel y despachar ProductImportJob.
     * Retorna job_id inmediatamente para polling de estado.
     */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:20480',
        ]);

        $jobId = Str::uuid()->toString();
        $path = $request->file('file')->store("imports/{$jobId}", 'local');

        Cache::put("import_job_{$jobId}_status", 'queued', 3600);

        ProductImportJob::dispatch($path, $jobId);

        return response()->json([
            'job_id' => $jobId,
            'status' => 'queued',
            'message' => 'Importación en proceso. Consulta el estado con el job_id.',
        ], 202);
    }

    /**
     * Consultar estado de un job de importación.
     */
    public function importStatus(string $jobId): JsonResponse
    {
        $status = Cache::get("import_job_{$jobId}_status", 'unknown');
        $completedAt = Cache::get("import_job_{$jobId}_completed_at");
        $error = Cache::get("import_job_{$jobId}_error");

        return response()->json(array_filter([
            'job_id' => $jobId,
            'status' => $status,
            'completed_at' => $completedAt,
            'error' => $error,
        ]));
    }
}
