<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Conversation;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AnnouncementDiscussionController extends Controller
{
    public function storeAnnouncementComment(Request $request, Announcement $announcement): RedirectResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
            'parent_message_id' => ['nullable', 'integer'],
        ]);

        $conversation = Conversation::query()->firstOrCreate(
            [
                'announcement_id' => $announcement->id,
                'client_id' => null,
            ],
            [
                'type' => 'announcement',
                'name' => $announcement->title,
            ],
        );

        if (isset($validated['parent_message_id'])) {
            validator(
                ['parent_message_id' => $validated['parent_message_id']],
                [
                    'parent_message_id' => [
                        Rule::exists('messages', 'id')->where(
                            fn (Builder $query) => $query
                                ->where('conversation_id', $conversation->id),
                        ),
                    ],
                ],
            )->validate();
        }

        $conversation->messages()->create([
            'parent_message_id' => $validated['parent_message_id'] ?? null,
            'sender_admin_id' => $request->user('admin')->id,
            'content' => trim($validated['content']),
        ]);

        $conversation->touch();

        return back();
    }

    public function store(Request $request, Conversation $conversation): RedirectResponse
    {
        abort_unless($conversation->announcement_id !== null && $conversation->client_id !== null, 404);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
            'parent_message_id' => [
                'nullable',
                'integer',
                Rule::exists('messages', 'id')->where(
                    fn (Builder $query) => $query
                        ->where('conversation_id', $conversation->id),
                ),
            ],
        ]);

        $conversation->messages()->create([
            'parent_message_id' => $validated['parent_message_id'] ?? null,
            'sender_admin_id' => $request->user('admin')->id,
            'content' => trim($validated['content']),
        ]);

        $conversation->touch();

        return back();
    }

    public function storeStaffAnnouncementComment(Request $request, Announcement $announcement): RedirectResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
            'parent_message_id' => ['nullable', 'integer'],
        ]);

        $conversation = Conversation::query()->firstOrCreate(
            [
                'announcement_id' => $announcement->id,
                'client_id' => null,
            ],
            [
                'type' => 'announcement',
                'name' => $announcement->title,
            ],
        );

        if (isset($validated['parent_message_id'])) {
            validator(
                ['parent_message_id' => $validated['parent_message_id']],
                [
                    'parent_message_id' => [
                        Rule::exists('messages', 'id')->where(
                            fn (Builder $query) => $query
                                ->where('conversation_id', $conversation->id),
                        ),
                    ],
                ],
            )->validate();
        }

        $conversation->messages()->create([
            'parent_message_id' => $validated['parent_message_id'] ?? null,
            'sender_staff_id' => $request->user('staff')->id,
            'content' => trim($validated['content']),
        ]);

        $conversation->touch();

        return back();
    }

    public function storeStaffMessage(Request $request, Conversation $conversation): RedirectResponse
    {
        abort_unless($conversation->announcement_id !== null && $conversation->client_id !== null, 404);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
            'parent_message_id' => [
                'nullable',
                'integer',
                Rule::exists('messages', 'id')->where(
                    fn (Builder $query) => $query
                        ->where('conversation_id', $conversation->id),
                ),
            ],
        ]);

        $conversation->messages()->create([
            'parent_message_id' => $validated['parent_message_id'] ?? null,
            'sender_staff_id' => $request->user('staff')->id,
            'content' => trim($validated['content']),
        ]);

        $conversation->touch();

        return back();
    }
}
