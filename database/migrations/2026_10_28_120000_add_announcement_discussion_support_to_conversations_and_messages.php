<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->foreignId('announcement_id')
                ->nullable()
                ->constrained('announcement')
                ->cascadeOnDelete();
            $table->foreignId('client_id')
                ->nullable()
                ->constrained('users')
                ->cascadeOnDelete();
            $table->unique(['announcement_id', 'client_id'], 'conversations_announcement_client_unique');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->foreignId('sender_id')->nullable()->change();
            $table->foreignId('sender_admin_id')
                ->nullable()
                ->constrained('admin_users')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        DB::table('messages')->whereNull('sender_id')->delete();

        Schema::table('messages', function (Blueprint $table) {
            $table->dropConstrainedForeignId('sender_admin_id');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->foreignId('sender_id')->nullable(false)->change();
        });

        Schema::table('conversations', function (Blueprint $table) {
            $table->dropUnique('conversations_announcement_client_unique');
            $table->dropConstrainedForeignId('client_id');
            $table->dropConstrainedForeignId('announcement_id');
        });
    }
};
