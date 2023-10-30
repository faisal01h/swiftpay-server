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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku');
            $table->string('name');
            $table->foreignId('category_id')->constrained('categories');
            $table->string('description');
            $table->string('source');
            $table->unsignedBigInteger('max_price')->nullable();
            $table->unsignedBigInteger('base_price');
            $table->unsignedBigInteger('discounted_price');
            $table->unsignedBigInteger('selling_price');
            $table->boolean('enabled');
            $table->time('cutoff_start')->nullable();
            $table->time('cutoff_end')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
