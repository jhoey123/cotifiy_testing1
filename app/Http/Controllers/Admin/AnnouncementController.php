<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Notifications\AnnouncementPublished;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        $announcements = Announcement::query()
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('admin/admin', [
            'announcements' => $announcements->map(fn (Announcement $announcement) => $this->announcementData($announcement)),
            'recentAnnouncements' => $announcements->take(5)->map(fn (Announcement $announcement) => $this->announcementData($announcement)),
            'upcomingEvents' => Announcement::query()
                ->where('category', 'Event')
                ->whereDate('event_date', '>=', now()->toDateString())
                ->orderBy('event_date')
                ->orderBy('start_time')
                ->orderBy('id')
                ->limit(5)
                ->get()
                ->map(fn (Announcement $announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'event_date' => $announcement->event_date->toDateString(),
                    'start_time' => $announcement->start_time,
                    'end_time' => $announcement->end_time,
                    'location' => $announcement->location,
                ]),
            'announcementCount' => $announcements->count(),
            'eventCount' => Announcement::query()->where('category', 'Event')->count(),
            'userCount' => User::query()->count(),
            'discussions' => $this->discussionData(),
            'announcementComments' => $this->announcementCommentData(),
        ]);
    }

    public function announcements(): Response
    {
        $announcements = Announcement::query()
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('admin/adminAnnouncemnt', [
            'announcements' => $announcements->map(fn (Announcement $announcement) => $this->announcementData($announcement)),
            'discussions' => $this->discussionData(),
            'announcementComments' => $this->announcementCommentData(),
        ]);
    }

    public function events(): Response
    {
        $events = Announcement::query()
            ->where('category', 'Event')
            ->orderByDesc('event_date')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Announcement $announcement) => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'date' => $announcement->event_date?->toDateString() ?? $announcement->date->toDateString(),
                'time' => $announcement->start_time ?? '',
                'venue' => $announcement->location ?? '',
                'rsvp_count' => 0,
                'capacity' => null,
                'audience' => 'All',
                'status' => ($announcement->event_date?->toDateString() ?? $announcement->date->toDateString()) >= now()->toDateString()
                    ? 'Upcoming'
                    : 'Past',
                'start_time' => $announcement->start_time ?? '',
                'end_time' => $announcement->end_time ?? '',
            ]);

        return Inertia::render('admin/adminEvent', [
            'events' => $events,
        ]);
    }

    private function discussionData(): Collection
    {
        return Conversation::query()
            ->whereNotNull('announcement_id')
            ->whereNotNull('client_id')
            ->with([
                'announcement:id,title',
                'client:id,name',
                'messages' => fn ($query) => $query
                    ->with(['sender', 'adminSender'])
                    ->orderBy('created_at')
                    ->orderBy('id'),
            ])
            ->whereHas('messages')
            ->orderByDesc('updated_at')
            ->limit(50)
            ->get()
            ->map(fn (Conversation $conversation) => [
                'id' => $conversation->id,
                'announcement_id' => $conversation->announcement_id,
                'announcement_title' => $conversation->announcement->title,
                'client_name' => $conversation->client->name,
                'messages' => $conversation->messages
                    ->map(fn (Message $message) => [
                        'id' => $message->id,
                        'parent_message_id' => $message->parent_message_id,
                        'author' => $message->sender_admin_id === null
                            ? $message->sender->name
                            : $message->adminSender->name,
                        'role' => $message->sender_admin_id === null ? 'Client' : 'Admin',
                        'content' => $message->content,
                        'sent_at' => $message->created_at?->toIso8601String(),
                    ])
                    ->values(),
            ])
            ->values();
    }

    private function announcementCommentData(): Collection
    {
        return Conversation::query()
            ->whereNotNull('announcement_id')
            ->whereNull('client_id')
            ->with([
                'messages' => fn ($query) => $query
                    ->with(['sender', 'adminSender'])
                    ->orderBy('created_at')
                    ->orderBy('id'),
            ])
            ->whereHas('messages')
            ->get()
            ->map(fn (Conversation $conversation) => [
                'announcement_id' => $conversation->announcement_id,
                'messages' => $conversation->messages
                    ->map(fn (Message $message) => [
                        'id' => $message->id,
                        'parent_message_id' => $message->parent_message_id,
                        'author' => $message->sender_admin_id === null
                            ? $message->sender->name
                            : $message->adminSender->name,
                        'role' => $message->sender_admin_id === null ? 'Client' : 'Admin',
                        'content' => $message->content,
                        'sent_at' => $message->created_at?->toIso8601String(),
                    ])
                    ->values(),
            ])
            ->values();
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['General', 'Academic', 'Event', 'Service'])],
            'posted_by' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif,webp', 'max:5120'],
            'attachments' => ['sometimes', 'array', 'max:10'],
            'attachments.*' => ['file', 'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,csv,odt,ods,odp', 'max:10240'],
            'event_date' => ['nullable', 'required_if:category,Event', 'date'],
            'start_time' => ['nullable', 'required_with:end_time', 'date_format:H:i'],
            'end_time' => ['nullable', 'required_with:start_time', 'date_format:H:i', 'after:start_time'],
            'location' => ['nullable', 'required_if:category,Event', 'string', 'max:255'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('announcements', 'public');

            if ($imagePath === false) {
                throw new RuntimeException('Failed to store the announcement image.');
            }
        }

        $attachments = $this->storeAttachments($validated['attachments'] ?? []);

        $announcement = Announcement::create([
            ...$validated,
            'date' => now()->toDateString(),
            'image' => $imagePath,
            'attachments' => $attachments,
            ...$this->eventFields($validated),
        ]);

        User::query()->chunkById(100, function ($users) use ($announcement): void {
            Notification::send($users, new AnnouncementPublished($announcement));
        });

        return back();
    }

    public function update(Request $request, Announcement $announcement): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['General', 'Academic', 'Event', 'Service'])],
            'posted_by' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif,webp', 'max:5120'],
            'attachments' => ['sometimes', 'array', 'max:10'],
            'attachments.*' => ['file', 'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,csv,odt,ods,odp', 'max:10240'],
            'remove_attachments' => ['sometimes', 'array'],
            'remove_attachments.*' => ['string', Rule::in(array_column($announcement->attachments ?? [], 'path'))],
            'event_date' => ['nullable', 'required_if:category,Event', 'date'],
            'start_time' => ['nullable', 'required_with:end_time', 'date_format:H:i'],
            'end_time' => ['nullable', 'required_with:start_time', 'date_format:H:i', 'after:start_time'],
            'location' => ['nullable', 'required_if:category,Event', 'string', 'max:255'],
        ]);

        $oldImage = $announcement->image;
        $imagePath = $oldImage;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('announcements', 'public');

            if ($imagePath === false) {
                throw new RuntimeException('Failed to store the announcement image.');
            }
        }

        $removedAttachmentPaths = $validated['remove_attachments'] ?? [];
        $attachments = array_values(array_filter(
            $announcement->attachments ?? [],
            fn (array $attachment) => ! in_array($attachment['path'], $removedAttachmentPaths, true),
        ));
        $attachments = [
            ...$attachments,
            ...$this->storeAttachments($validated['attachments'] ?? []),
        ];

        $announcement->update([
            ...$validated,
            'image' => $imagePath,
            'attachments' => $attachments,
            ...$this->eventFields($validated),
        ]);

        foreach ($removedAttachmentPaths as $path) {
            if (! Storage::disk('public')->delete($path)) {
                throw new RuntimeException('Failed to remove a deleted announcement attachment.');
            }
        }

        if ($imagePath !== $oldImage && $oldImage !== null && ! Storage::disk('public')->delete($oldImage)) {
            throw new RuntimeException('Failed to remove the replaced announcement image.');
        }

        return back();
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $image = $announcement->image;
        $attachments = array_column($announcement->attachments ?? [], 'path');
        $announcement->delete();

        if ($image !== null && ! Storage::disk('public')->delete($image)) {
            throw new RuntimeException('Failed to remove the deleted announcement image.');
        }

        foreach ($attachments as $path) {
            if (! Storage::disk('public')->delete($path)) {
                throw new RuntimeException('Failed to remove a deleted announcement attachment.');
            }
        }

        return back();
    }

    private function announcementData(Announcement $announcement): array
    {
        return [
            'id' => $announcement->id,
            'title' => $announcement->title,
            'category' => $announcement->category,
            'posted_by' => $announcement->posted_by,
            'date' => $announcement->date->toDateString(),
            'body' => $announcement->body,
            'body_html' => $announcement->bodyAsHtml(),
            'image_url' => $announcement->image
                ? Storage::disk('public')->url($announcement->image)
                : null,
            'attachments' => $this->attachmentData($announcement),
            'event_date' => $announcement->event_date?->toDateString(),
            'start_time' => $announcement->start_time,
            'end_time' => $announcement->end_time,
            'location' => $announcement->location,
        ];
    }

    private function storeAttachments(array $files): array
    {
        return array_map(function ($file): array {
            $path = $file->store('announcements/attachments', 'public');

            if ($path === false) {
                throw new RuntimeException('Failed to store an announcement attachment.');
            }

            return [
                'path' => $path,
                'name' => $file->getClientOriginalName(),
            ];
        }, $files);
    }

    private function attachmentData(Announcement $announcement): array
    {
        return array_map(function (array $attachment): array {
            $path = $attachment['path'];
            $size = Storage::disk('public')->size($path);

            return [
                ...$attachment,
                'url' => Storage::disk('public')->url($path),
                'size' => $size >= 1048576
                    ? number_format($size / 1048576, 1).' MB'
                    : number_format($size / 1024, 0).' KB',
            ];
        }, $announcement->attachments ?? []);
    }

    private function eventFields(array $validated): array
    {
        if ($validated['category'] === 'Event') {
            return [
                'event_date' => $validated['event_date'],
                'start_time' => $validated['start_time'] ?? null,
                'end_time' => $validated['end_time'] ?? null,
                'location' => $validated['location'],
            ];
        }

        return [
            'event_date' => null,
            'start_time' => null,
            'end_time' => null,
            'location' => null,
        ];
    }
}
