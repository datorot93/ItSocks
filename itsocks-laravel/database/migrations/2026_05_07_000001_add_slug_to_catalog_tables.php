<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['subcategory', 'type', 'design', 'product'] as $tableName) {
            if (! Schema::hasColumn($tableName, 'slug')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->string('slug')->nullable()->after('name');
                });
            }
        }

        $this->backfillSlugs('subcategory');
        $this->backfillSlugs('type');
        $this->backfillSlugs('design');
        $this->backfillSlugs('product');

        foreach (['subcategory', 'type', 'design', 'product'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                $table->unique('slug', "{$tableName}_slug_unique");
            });
        }
    }

    public function down(): void
    {
        foreach (['subcategory', 'type', 'design', 'product'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                $table->dropUnique("{$tableName}_slug_unique");
                $table->dropColumn('slug');
            });
        }
    }

    private function backfillSlugs(string $tableName): void
    {
        $rows = DB::table($tableName)->select('id', 'name')->get();
        $taken = [];

        foreach ($rows as $row) {
            $base = Str::slug($row->name);
            $slug = $base;
            $i = 2;
            while (isset($taken[$slug])) {
                $slug = "{$base}-{$i}";
                $i++;
            }
            $taken[$slug] = true;
            DB::table($tableName)->where('id', $row->id)->update(['slug' => $slug]);
        }
    }
};
