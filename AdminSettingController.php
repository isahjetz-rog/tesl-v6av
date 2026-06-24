<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('brand')->default('Tesla');
            $table->string('model');
            $table->integer('year');
            $table->decimal('price', 12, 2);
            $table->text('description')->nullable();
            $table->json('specifications')->nullable(); // holds range, zeroToSixty, topSpeed, drivetrain, battery
            $table->boolean('featured')->default(false);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
