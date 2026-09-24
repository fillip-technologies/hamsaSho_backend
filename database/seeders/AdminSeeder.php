<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (!Admin::where('email', 'admin@hamsasoham.com')->exists()) {
            Admin::create([
                'name'     => 'Hamsa Soham Admin',
                'email'    => 'admin@hamsasoham.com',
                'password' => 'AdminPassword123',
                'role'     => 'admin',
            ]);
        }
    }
}
