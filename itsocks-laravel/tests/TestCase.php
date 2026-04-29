<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Storage;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Usar disco local en todos los tests — nunca S3 real
        config(['filesystems.default' => 'local']);
        Storage::fake('local');
        Storage::fake('s3'); // intercepta llamadas a S3 sin hacer requests reales
    }
}
