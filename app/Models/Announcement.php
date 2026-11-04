<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Spatie\LaravelMarkdown\MarkdownRenderer;

/**
 * @property \Illuminate\Support\Carbon $date
 * @property \Illuminate\Support\Carbon|null $event_date
 * @property \Illuminate\Support\Carbon|null $event_end_date
 */
#[Fillable(['image', 'title', 'category', 'posted_by', 'date', 'body', 'event_date', 'event_end_date', 'start_time', 'end_time', 'location', 'attachments'])]
class Announcement extends Model
{
    protected $table = 'announcement';

    public $timestamps = false;

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
