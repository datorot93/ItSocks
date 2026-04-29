<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;
    // Nombre singular — esquema PostgreSQL actual no usa plurales
    protected $table = 'product';

    protected $fillable = [
        'id_design',
        'id_type',
        'id_subcategory',
        'code',
        'name',
        'talla',
        'price',
        'state',
        'color',
        'discount',
        'compresion',
        'quantity',
        'description',
        'season',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'state' => 'boolean',
        'compresion' => 'boolean',
        'season' => 'boolean',
        'discount' => 'integer',
        'quantity' => 'integer',
    ];

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('state', true);
    }

    public function scopeCompression(Builder $query): Builder
    {
        return $query->where('compresion', true);
    }

    public function scopeSeason(Builder $query): Builder
    {
        return $query->where('season', true);
    }

    // Scopes para QueryBuilder (spatie/laravel-query-builder)
    private static function likeOp(): string
    {
        return config('database.default') === 'pgsql' ? 'ilike' : 'like';
    }

    public function scopeCategory(Builder $query, string $category): Builder
    {
        $op = self::likeOp();
        return $query->whereHas('subcategory.category', fn ($q) => $q->where('name', $op, "%{$category}%"));
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        $op = self::likeOp();
        return $query->whereHas('subcategory.category', fn ($q) => $q->where('name', $op, "%{$category}%"));
    }

    public function scopeSubcategory(Builder $query, string $subcategory): Builder
    {
        $op = self::likeOp();
        return $query->whereHas('subcategory', fn ($q) => $q->where('name', $op, "%{$subcategory}%"));
    }

    public function scopeBySubcategory(Builder $query, string $subcategory): Builder
    {
        $op = self::likeOp();
        return $query->whereHas('subcategory', fn ($q) => $q->where('name', $op, "%{$subcategory}%"));
    }

    public function scopeTag(Builder $query, string $tag): Builder
    {
        $op = self::likeOp();
        return $query->whereHas('tags', fn ($q) => $q->where('name', $op, "%{$tag}%"));
    }

    public function scopeByTag(Builder $query, string $tag): Builder
    {
        $op = self::likeOp();
        return $query->whereHas('tags', fn ($q) => $q->where('name', $op, "%{$tag}%"));
    }

    // Relaciones
    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class, 'id_subcategory');
    }

    public function design(): BelongsTo
    {
        return $this->belongsTo(Design::class, 'id_design');
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(Type::class, 'id_type');
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class, 'id_product');
    }

    public function sizes(): BelongsToMany
    {
        return $this->belongsToMany(Size::class, 'product_size', 'product_id', 'size_id');
    }

    public function colors(): BelongsToMany
    {
        return $this->belongsToMany(Color::class, 'product_color', 'product_id', 'color_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'tag_product', 'product_id', 'tag_id');
    }

    public function productOrders(): HasMany
    {
        return $this->hasMany(ProductOrder::class, 'product_id');
    }

    public function wishLists(): BelongsToMany
    {
        return $this->belongsToMany(WishList::class, 'wish_list_product', 'product_id', 'wish_list_id');
    }
}
