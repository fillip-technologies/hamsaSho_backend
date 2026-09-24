<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('testimonials')) return;
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('position', 150)->nullable();
            $table->string('hospital', 200);
            $table->text('quote');
            $table->string('logo_url', 500)->nullable();
            $table->string('backdrop_color', 50)->default('#FF4D27');
            $table->string('backdrop_rotate', 20)->default('rotate-6');
            $table->string('avatar_bg', 100)->default('bg-white');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
