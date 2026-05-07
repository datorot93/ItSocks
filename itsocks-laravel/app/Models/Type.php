<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Type extends Model
{
    use HasFactory;
    protected $table = 'type';

    protected $fillable = [
        'name',
        'slug',
        'code',
        'discount',
        'image_url',
        'priority',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $type): void {
            if (empty($type->slug) && !empty($type->name)) {
                $base = Str::slug($type->name);
                $slug = $base;
                $i = 2;
                while (
                    self::where('slug', $slug)
                        ->when($type->id, fn ($q) => $q->where('id', '!=', $type->id))
                        ->exists()
                ) {
                    $slug = "{$base}-{$i}";
                    $i++;
                }
                $type->slug = $slug;
            }
        });
    }

    protected $casts = [
        'discount' => 'integer',
        'priority' => 'integer',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'id_type');
    }

    public function typeImages(): HasMany
    {
        return $this->hasMany(TypeImage::class);
    }
}
