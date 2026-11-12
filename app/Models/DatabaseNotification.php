<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\DatabaseNotification as LaravelDatabaseNotification;

/**
 * @property-read Announcement|null $announcement
 */
class DatabaseNotification extends LaravelDatabaseNotification
{
    /** @return BelongsTo<Announcement, $this> */
    public function announcement(): BelongsTo
    {
        return $this->belongsTo(Announcement::class);
    }
}
