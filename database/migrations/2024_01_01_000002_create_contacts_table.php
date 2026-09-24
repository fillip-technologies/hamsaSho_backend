<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('contacts')) return;
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('organization', 200)->default('Not specified');
            $table->string('designation', 120)->default('Not specified');
            $table->string('email', 150);
            $table->string('mobile', 50);
            $table->string('city', 100)->default('');
            $table->string('hospital_type', 100);
            $table->string('beds', 50)->default('');
            $table->string('product', 100)->default('e_Kshitiz');
            $table->string('current_his', 150)->default('');
            $table->text('message')->nullable();
            $table->enum('status', ['New', 'Contacted', 'In Progress', 'Closed'])->default('New');
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
