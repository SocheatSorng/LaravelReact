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
        Schema::table('tbOrder', function (Blueprint $table) {
            $table->unsignedBigInteger('AccountID')->nullable()->after('UserID');
            $table->foreign('AccountID')->references('AccountID')->on('tbCustomerAccount')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tbOrder', function (Blueprint $table) {
            $table->dropForeign(['AccountID']);
            $table->dropColumn('AccountID');
        });
    }
}; 