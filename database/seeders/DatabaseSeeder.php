<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        \App\Models\User::create([
            'name' => 'SWIFT SYSTEM',
            'phone' => 'SYSTEM',
            'email' => 'SYSTEM',
            'password' => "^_^SYSTEM^_^",
        ]);
        \App\Models\User::create([
            'name' => 'Faisal Hanif',
            'phone' => '+6285733710858',
            'email' => 'faisal01h@gmail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now("Asia/Jakarta")
        ]);
        // \App\Models\User::create([
        //     'name' => 'Ernia Dwi Anjani',
        //     'phone' => '+6285648597632',
        //     'email' => 'erniadwianjani@gmail.com',
        //     'password' => Hash::make('password'),
        //     'email_verified_at' => now("Asia/Jakarta")
        // ]);

        // \App\Models\Transaction::factory(3123)->create();

        \App\Models\Role::create([
            'name' => 'CEO',
            'importance' => 20,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'CFO',
            'importance' => 19,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'CTO',
            'importance' => 19,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'BOT',
            'importance' => 18,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'COO',
            'importance' => 19,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Legal',
            'importance' => 15,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Accounting',
            'importance' => 15,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Senior Software Engineer',
            'importance' => 15,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Junior Software Engineer',
            'importance' => 10,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Devops & QA',
            'importance' => 15,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Operations',
            'importance' => 10,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Marketing',
            'importance' => 5,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Customer Relations',
            'importance' => 5,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Engineer Intern (SWE1)',
            'importance' => 2,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'CS Intern (GNR1)',
            'importance' => 2,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Operations Intern (GNR2)',
            'importance' => 2,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Accounting Intern (FIN1)',
            'importance' => 2,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Legal Intern (GNR3)',
            'importance' => 2,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Co-Founders',
            'importance' => -1,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => '3-Years of Service',
            'importance' => -10,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => '5-Years of Service',
            'importance' => -9,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => '10-Years of Service',
            'importance' => -8,
            'created_by' => 1,
        ]);
        \App\Models\Role::create([
            'name' => 'Boards of Director',
            'importance' => 20,
            'created_by' => 1,
        ]);

        \App\Models\Userrole::create([
            'user_id' => 1,
            'role_id' => 4,
            'created_by' => 1
        ]);
        \App\Models\Userrole::create([
            'user_id' => 2,
            'role_id' => 1,
            'created_by' => 1
        ]);
        // \App\Models\Userrole::create([
        //     'user_id' => 3,
        //     'role_id' => 2,
        //     'created_by' => 1
        // ]);
        \App\Models\Category::create([
            'name' => 'Uncategorized',
            'slug' => 'uncategorized',
            'image' => null,
            'prompt' => 'Masukkan nomor tujuan'
        ]);

        \App\Models\Category::create([
            'name' => 'PLN',
            'slug' => 'pln',
            'image' => null,
            'prompt' => "Masukkan nomor meteran"
        ]);

        \App\Models\Coupon::create([
            'name' => 'Diskon 75%',
            'description' => 'Kupon diskon 75% (maks. Rp1000).',
            'code' => 'CFNDRSERIES0A',
            'amount' => 75,
            'is_percent' => true,
            'max_amount' => 1000,
            'valid_until' => Carbon::create(2023, 11, 30, 23, 59, 59, "Asia/Jakarta")->toIso8601String()
        ]);
    }
}
