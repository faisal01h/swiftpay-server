<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    public function up(): void
    {
        Schema::create('transactionarchives', function (Blueprint $table) {
            $table->id();
            $table->string('invoice')->unique();
            $table->uuid('ref_id')->unique();
            $table->foreignId('product_id')->constrained('products');
            $table->string('user_identifier'); // no hp customer
            $table->string('destination'); // no hp/username game/id game
            $table->unsignedBigInteger('created_by');
            $table->string('payment_method');
            $table->string('source');
            $table->unsignedBigInteger('base_price');
            $table->unsignedBigInteger('payment_method_fee');
            $table->unsignedBigInteger('selling_price');
            $table->string('status');
            $table->unsignedBigInteger('coupon_id')->nullable();
            $table->string('remarks');
            $table->json('raw_json');
            $table->dateTime('transaction_created_at');
            $table->dateTime('transaction_updated_at');
            $table->dateTime('transaction_deleted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactionarchives');
    }
};
