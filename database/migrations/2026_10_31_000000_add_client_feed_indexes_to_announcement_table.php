<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('announcement', function (Blueprint $table) {
            $table->index(['date', 'id'], 'announcement_date_id_index');
            $table->index(['event_date', 'id'], 'announcement_event_date_id_index');
        });
    }

    public function down(): void
    {
        Schema::table('announcement', function (Blueprint $table) {
            $table->dropIndex('announcement_date_id_index');
            $table->dropIndex('announcement_event_date_id_index');
        });
    }
};
