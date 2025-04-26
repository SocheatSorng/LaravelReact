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
        Schema::create('tbCustomerAccount', function (Blueprint $table) {
            $table->id('AccountID');
            $table->string('Username')->unique();
            $table->string('Email')->unique();
            $table->string('Password');
            $table->string('FirstName');
            $table->string('LastName');
            $table->string('Phone')->nullable();
            $table->text('Address')->nullable();
            $table->boolean('IsActive')->default(true);
            $table->timestamp('LastLogin')->nullable();
            $table->string('ProfileImage')->nullable();
            $table->string('RememberToken')->nullable();
            $table->timestamp('CreatedAt')->useCurrent();
            $table->timestamp('UpdatedAt')->nullable()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbCustomerAccount');
    }
}; 