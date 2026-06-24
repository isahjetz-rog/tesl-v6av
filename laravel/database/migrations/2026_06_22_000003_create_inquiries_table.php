<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->uuid('car_id')->nullable();
            $table->string('car_name'); // cache car name in case of deletion
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->text('message');
            $table->string('status')->default('pending'); // pending, contacted, completed
            $table->timestamps();

            $table->foreign('car_id')->references('id')->on('cars')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
