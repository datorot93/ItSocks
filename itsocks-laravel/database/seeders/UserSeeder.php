<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@itsocks.co'],
            [
                'name' => 'Admin ItSocks',
                'email' => 'admin@itsocks.co',
                'password' => bcrypt('password_test_2026'),
                'email_verified_at' => now(),
            ]
        );
    }
}
