<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('announcement', function (Blueprint $table) {
            $table->date('event_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('location')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('announcement', function (Blueprint $table) {
            $table->dropColumn(['event_date', 'start_time', 'end_time', 'location']);
        });
    }
};
