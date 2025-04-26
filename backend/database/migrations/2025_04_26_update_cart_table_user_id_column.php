<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if the column exists and rename it
        if (Schema::hasColumn('tbCart', 'UserID')) {
            // Use direct SQL for a simple rename
            DB::statement('ALTER TABLE tbCart CHANGE UserID AccountID BIGINT');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Check if the column exists and rename it back
        if (Schema::hasColumn('tbCart', 'AccountID')) {
            // Use direct SQL for a simple rename
            DB::statement('ALTER TABLE tbCart CHANGE AccountID UserID BIGINT');
        }
    }
}; 