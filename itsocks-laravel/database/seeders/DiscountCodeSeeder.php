<?php

namespace Database\Seeders;

use App\Models\DiscountCode;
use Illuminate\Database\Seeder;

class DiscountCodeSeeder extends Seeder
{
    public function run(): void
    {
        DiscountCode::updateOrCreate(
            ['code' => 'TEST10'],
            [
                'discount_type' => 'percentage',
                'discount' => 10,
                'state' => true,
                'expiration_date' => null,
            ]
        );

        DiscountCode::updateOrCreate(
            ['code' => 'LAUNCH20'],
            [
                'discount_type' => 'percentage',
                'discount' => 20,
                'state' => true,
                'expiration_date' => null,
            ]
        );
    }
}
