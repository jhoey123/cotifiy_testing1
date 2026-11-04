<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AnnouncementDiscussionController extends Controller
{
    public function store(Request $request, Announcement $announcement): RedirectResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
            'parent_message_id' => [
                'nullable',
                'integer',
                Rule::exists('messages', 'id')->where(
                    fn (Builder $query) => $query->whereIn(
                        'conversation_id',
                        Conversation::query()
                            ->select('id')
                            ->where('announcement_id', $announcement->id)
                            ->where(function ($query) use ($request): void {
                                $query->whereNull('client_id')
                                    ->orWhere('client_id', $request->user()->id);
                            }),
                    ),
                ),
            ],
        ]);

        if (isset($validated['parent_message_id'])) {
            $conversation = Message::query()
                ->findOrFail($validated['parent_message_id'])
                ->conversation;
        } else {
            $conversation = Conversation::query()->firstOrCreate(
                [
                    'announcement_id' => $announcement->id,
                    'client_id' => $request->user()->id,
                ],
                [
                    'type' => 'announcement',
                    'name' => $announcement->title,
                ],
            );
        }

        $conversation->messages()->create([
            'parent_message_id' => $validated['parent_message_id'] ?? null,
            'sender_id' => $request->user()->id,
            'content' => trim($validated['content']),
        ]);

        $conversation->touch();

        return back();
    }
}
