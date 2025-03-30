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
        // Only update if table already exists
        if (Schema::hasTable('tbPage_Contents')) {
            Schema::table('tbPage_Contents', function (Blueprint $table) {
                if (!Schema::hasColumn('tbPage_Contents', 'page_slug')) {
                    $table->string('page_slug')->unique();
                }
                if (!Schema::hasColumn('tbPage_Contents', 'title')) {
                    $table->string('title');
                }
                if (!Schema::hasColumn('tbPage_Contents', 'content')) {
                    $table->longText('content')->nullable();
                }
                if (!Schema::hasColumn('tbPage_Contents', 'status')) {
                    $table->enum('status', ['draft', 'published'])->default('draft');
                }
                if (!Schema::hasColumn('tbPage_Contents', 'created_by')) {
                    $table->unsignedBigInteger('created_by')->nullable();
                }
            });
        } else {
            Schema::create('tbPage_Contents', function (Blueprint $table) {
                $table->id();
                $table->string('page_slug')->unique();
                $table->string('title');
                $table->longText('content')->nullable();
                $table->enum('status', ['draft', 'published'])->default('draft');
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't drop the table - there may be existing data
        // We'll just remove our added columns if needed
    }
};