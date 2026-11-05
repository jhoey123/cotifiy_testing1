<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('announcement', function (Blueprint $table) {
            $table->foreignId('author_staff_id')
                ->nullable()
                ->constrained('staff_users')
                ->nullOnDelete();
            $table->foreignId('author_admin_id')
                ->nullable()
                ->constrained('admin_users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('announcement', function (Blueprint $table) {
            $table->dropConstrainedForeignId('author_staff_id');
            $table->dropConstrainedForeignId('author_admin_id');
        });
    }
};
