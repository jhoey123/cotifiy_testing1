<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Spatie\LaravelMarkdown\MarkdownRenderer;

/**
 * @property Carbon $date
 * @property Carbon|null $event_date
 * @property Carbon|null $event_end_date
 */
#[Fillable(['image', 'title', 'category', 'posted_by', 'date', 'body', 'event_date', 'event_end_date', 'start_time', 'end_time', 'location', 'attachments', 'author_staff_id', 'author_admin_id'])]
class Announcement extends Model
{
    protected $table = 'announcement';

    public $timestamps = false;

    /** @return BelongsTo<StaffUser, $this> */
    public function staffAuthor(): BelongsTo
    {
        return $this->belongsTo(StaffUser::class, 'author_staff_id');
    }

    /** @return BelongsTo<AdminUser, $this> */
    public function adminAuthor(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'author_admin_id');
    }

    public function bodyAsHtml(): string
    {
        return app(MarkdownRenderer::class)
            ->commonmarkOptions(array_merge(config('markdown.commonmark_options', []), [
                'html_input' => 'strip',
            ]))
            ->toHtml($this->body);
    }

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'event_date' => 'date',
            'event_end_date' => 'date',
            'attachments' => 'array',
        ];
    }
}
