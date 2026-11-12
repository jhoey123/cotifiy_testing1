<?php

namespace App\Models;

use App\Notifications\AccountPasswordReset;
use App\Notifications\AnnouncementPublished;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification as BaseNotification;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $last_announcement_id
 * @property string $name
 * @property string|null $course
 * @property string|null $year_level
 * @property string|null $profile_photo_path
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'studentId', 'course', 'year_level', 'profile_photo_path'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public function sendPasswordResetNotification(#[\SensitiveParameter] $token): void
    {
        $this->notify(new AccountPasswordReset($token));
    }

    /** @return MorphMany<DatabaseNotification, $this> */
    public function notifications(): MorphMany
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')->latest();
    }

    /** @return BelongsToMany<Announcement, $this> */
    public function savedAnnouncements(): BelongsToMany
    {
        return $this->belongsToMany(Announcement::class)
            ->withTimestamps();
    }

    /** @return MorphMany<DatabaseNotification, $this> */
    public function routeNotificationForDatabase(?BaseNotification $notification = null): MorphMany
    {
        $notifications = $this->notifications();

        if ($notification instanceof AnnouncementPublished) {
            $notifications->getQuery()->withAttributes([
                'announcement_id' => $notification->announcement->getKey(),
            ]);
        }

        return $notifications;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
