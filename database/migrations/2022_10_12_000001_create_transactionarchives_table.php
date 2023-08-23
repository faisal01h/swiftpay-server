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
            $table->string('name');
            $table->string('user_identifier'); // no hp/username game/id game
            $table->string('commodity'); // nama game
            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')->references('id')->on('users');
            $table->string('invoice');
            $table->string('ref_id');
            $table->string('payment_method');
            $table->string('source');
            $table->bigInteger('base_price');
            $table->bigInteger('sold_price');
            $table->string('status');
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
