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
        Schema::disableForeignKeyConstraints();

        Schema::create('ebooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ebook_serie_id')->constrained('ebook_series')->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('cover_image');
            $table->integer('chapters');
            $table->string('file');
            $table->date('year');
            $table->boolean('is_free')->default(false); // New column to indicate sample books
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ebooks');
    }
};
