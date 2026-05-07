<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Design extends Model
{
    use HasFactory;
    protected $table = 'design';

    protected $fillable = [
        'name',
        'slug',
        'code',
        'discount',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $design): void {
            if (empty($design->slug) && !empty($design->name)) {
                $base = Str::slug($design->name);
                $slug = $base;
                $i = 2;
                while (
                    self::where('slug', $slug)
                        ->when($design->id, fn ($q) => $q->where('id', '!=', $design->id))
                        ->exists()
                ) {
                    $slug = "{$base}-{$i}";
                    $i++;
                }
                $design->slug = $slug;
            }
        });
    }

    protected $casts = [
        'discount' => 'integer',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'id_design');
    }
}
