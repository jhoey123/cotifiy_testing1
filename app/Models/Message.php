<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read Conversation|null $conversation
 * @property-read Message|null $parent
 * @property-read Collection<int, Message> $replies
 * @property-read User|null $sender
 * @property-read AdminUser|null $adminSender
 * @property-read StaffUser|null $staffSender
 */
#[Fillable(['conversation_id', 'parent_message_id', 'sender_id', 'sender_admin_id', 'sender_staff_id', 'content'])]
class Message extends Model
{
    /** @return BelongsTo<Conversation, $this> */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /** @return BelongsTo<Message, $this> */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'parent_message_id');
    }

    /** @return HasMany<Message, $this> */
    public function replies(): HasMany
    {
        return $this->hasMany(Message::class, 'parent_message_id');
    }

    /** @return BelongsTo<User, $this> */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /** @return BelongsTo<AdminUser, $this> */
    public function adminSender(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'sender_admin_id');
    }

    /** @return BelongsTo<StaffUser, $this> */
    public function staffSender(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'sender_staff_id');
    }
}
