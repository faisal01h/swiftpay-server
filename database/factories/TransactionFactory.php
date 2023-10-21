<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Ramsey\Uuid\Rfc4122\UuidV6;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = fake()->numberBetween(5000, 350000);
        $payload = [
            "user_identifier" => fake('id')->phoneNumber(),
            "destination" => random_int(12321, 82132),
            "commodity" => fake()->text(6),
            "created_by" => 1,
            "invoice" => strtoupper("SWFX"."_".preg_replace('/[^A-Za-z0-9]/', '', UuidV6::uuid6())),
            "ref_id" => strtoupper(preg_replace('/[^A-Za-z0-9]/', '', UuidV6::uuid4())),
            "payment_method" => "xendit.qris",
            "source" => "digiflazz",
            "base_price" => $price,
            "payment_method_fee" => 250,
            "sold_price" => $price+2000,
            "status" => fake()->randomElement(['UNPAID', 'PENDING', 'SUCCESS', 'FAILED', 'PEND_REFUND', 'SUCC_REFUND', 'CANC_REFUND']),
            "remarks" => "-",

        ];
        $payload["raw_json"] = json_encode([
            "initial_trx" => $payload,
        ]);
        return $payload;
    }
}
