<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Subcategory extends Model
{
    use HasFactory;
    protected $table = 'subcategory';

    protected $fillable = [
        'id_category',
        'code',
        'name',
        'slug',
        'discount',
        'image_url',
        'priority',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $sub): void {
            if (empty($sub->slug) && !empty($sub->name)) {
                $base = Str::slug($sub->name);
                $slug = $base;
                $i = 2;
                while (
                    self::where('slug', $slug)
                        ->when($sub->id, fn ($q) => $q->where('id', '!=', $sub->id))
                        ->exists()
                ) {
                    $slug = "{$base}-{$i}";
                    $i++;
                }
                $sub->slug = $slug;
            }
        });
    }

    protected $casts = [
        'discount' => 'integer',
        'priority' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'id_category');
    }

    public function types(): HasMany
    {
        return $this->hasMany(Type::class, 'id_subcategory');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'id_subcategory');
    }
}
