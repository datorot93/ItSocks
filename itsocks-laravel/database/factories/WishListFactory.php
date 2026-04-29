<?php

namespace Database\Factories;

use App\Models\WishList;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class WishListFactory extends Factory
{
    protected $model = WishList::class;

    public function definition(): array
    {
        $token = Str::uuid()->toString();

        return [
            'id_list' => $token,
            'url_list' => $token,
            'json_list' => '[]',
        ];
    }
}
