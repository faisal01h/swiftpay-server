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
            $table->string('ref_id')->unique();
            $table->string('user_identifier'); // no hp/email customer
            $table->string('destination'); // no hp/username game/id game
            $table->string('commodity'); // nama game
            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')->references('id')->on('users');
            $table->string('payment_method');
            $table->string('source');
            $table->unsignedBigInteger('base_price');
            $table->unsignedBigInteger('payment_method_fee');
            $table->unsignedBigInteger('sold_price');
            $table->string('status');
            $table->unsignedBigInteger('coupon_id')->nullable();
            $table->string('remarks');
            $table->json('raw_json');
            $table->dateTime('transaction_created_at');
            $table->dateTime('transaction_updated_at');
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
