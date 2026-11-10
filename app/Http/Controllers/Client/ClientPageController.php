<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ClientPageController extends Controller
{
    public function welcome(): Response
    {
        $publicAnnouncements = Announcement::query()
            ->select(['id', 'title', 'category', 'date', 'body'])
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->limit(3)
            ->get()
            ->map(fn (Announcement $announcement) => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'category' => $announcement->category,
                'date' => $announcement->date->toDateString(),
                'summary' => Str::limit(strip_tags($announcement->body), 180),
            ]);

        return Inertia::render('welcome', [
            'publicAnnouncements' => $publicAnnouncements,
        ]);
    }

    public function __invoke(Request $request): Response
    {
        $announcements = Announcement::query()
            ->select([
                'id',
                'title',
                'category',
                'posted_by',
                'date',
                'body',
                'image',
                'event_date',
                'event_end_date',
                'start_time',
                'end_time',
                'location',
            ])
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->limit(10)
            ->get()
            ->map(fn (Announcement $announcement) => $this->announcementSummaryData($announcement));

        $upcomingEvents = Announcement::query()
            ->select([
                'id',
                'title',
                'category',
                'posted_by',
                'date',
                'body',
                'image',
                'event_date',
                'event_end_date',
                'start_time',
                'end_time',
                'location',
            ])
            ->where('category', 'Event')
            ->where(function ($query) {
                $query->whereDate('event_end_date', '>=', now()->toDateString())
                    ->orWhere(function ($query) {
                        $query->whereNull('event_end_date')
                            ->whereDate('event_date', '>=', now()->toDateString());
                    });
            })
            ->orderBy('event_date')
            ->orderBy('id')
            ->limit(2)
            ->get()
            ->map(fn (Announcement $announcement) => $this->announcementSummaryData($announcement));

        return Inertia::render('client/clientpage', [
            'announcements' => $announcements,
            'upcomingEvents' => $upcomingEvents,
            'userName' => $request->user()->name,
            'user' => [
                'name' => $request->user()->name,
                'course' => $request->user()->course ?? '',
                'year_level' => $request->user()->year_level ?? '',
            ],
        ]);
    }

    public function announcements(): Response
    {
        $announcements = Announcement::query()
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Announcement $announcement) => $this->announcementData($announcement));

        return Inertia::render('client/clientannounce', [
            'announcements' => $announcements,
        ]);
    }

    public function events(): Response
    {
        $events = Announcement::query()
            ->where('category', 'Event')
            ->whereNotNull('event_date')
            ->orderBy('event_date')
            ->orderBy('id')
            ->get()
            ->map(fn (Announcement $announcement) => $this->announcementData($announcement));

        return Inertia::render('client/clientevent', [
            'events' => $events,
        ]);
    }

    public function saved(): Response
    {
        return Inertia::render('client/clientSaved', [
            'savedItems' => [],
        ]);
    }

    public function show(Request $request, Announcement $announcement): Response
    {
        $conversation = Conversation::query()
            ->where('announcement_id', $announcement->id)
            ->where('client_id', $request->user()->id)
            ->with([
                'messages' => fn ($query) => $query
                    ->with(['sender', 'adminSender', 'staffSender'])
                    ->orderBy('created_at')
                    ->orderBy('id'),
            ])
            ->first();

        $announcementComments = Conversation::query()
            ->where('announcement_id', $announcement->id)
            ->whereNull('client_id')
            ->with([
                'messages' => fn ($query) => $query
                    ->with(['sender', 'adminSender', 'staffSender'])
                    ->orderBy('created_at')
                    ->orderBy('id'),
            ])
            ->first()
            ?->messages
            ->map(fn (Message $message) => [
                'id' => $message->id,
                'parent_message_id' => $message->parent_message_id,
                'author' => $message->sender_staff_id !== null
                    ? $message->staffSender->name
                    : ($message->sender_admin_id !== null
                        ? $message->adminSender->name
                        : $message->sender->name),
                'role' => $message->sender_staff_id !== null
                    ? 'Staff'
                    : ($message->sender_admin_id === null ? 'Client' : 'Admin'),
                'content' => $message->content,
                'sent_at' => $message->created_at?->toIso8601String(),
                'is_mine' => $message->sender_id === $request->user()->id,
                'is_announcement_wide' => true,
            ]) ?? collect();

        $clientMessages = $conversation?->messages
            ->map(fn (Message $message) => [
                'id' => $message->id,
                'parent_message_id' => $message->parent_message_id,
                'author' => $message->sender_staff_id !== null
                    ? $message->staffSender->name
                    : ($message->sender_admin_id !== null
                        ? $message->adminSender->name
                        : $message->sender->name),
                'role' => $message->sender_staff_id !== null
                    ? 'Staff'
                    : ($message->sender_admin_id === null ? 'Client' : 'Admin'),
                'content' => $message->content,
                'sent_at' => $message->created_at?->toIso8601String(),
                'is_mine' => $message->sender_id === $request->user()->id,
                'is_announcement_wide' => false,
            ])
            ->values() ?? collect();

        return Inertia::render('client/clientReadmore', [
            'announcement' => $this->announcementData($announcement),
            'messages' => $announcementComments
                ->concat($clientMessages)
                ->sortBy('sent_at')
                ->values() ?? [],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function announcementData(Announcement $announcement): array
    {
        return [
            'id' => $announcement->id,
            'title' => $announcement->title,
            'category' => $announcement->category,
            'posted_by' => $announcement->posted_by,
            'posted_by_office' => $announcement->posted_by,
            'date' => $announcement->date->toDateString(),
            'content' => $announcement->body,
            'content_html' => $announcement->bodyAsHtml(),
            'image' => $announcement->image
                ? Storage::disk('public')->url($announcement->image)
                : null,
            'attachments' => array_map(function (array $attachment): array {
                $path = $attachment['path'];
                $size = Storage::disk('public')->size($path);

                return [
                    'name' => $attachment['name'],
                    'url' => Storage::disk('public')->url($path),
                    'size' => $size >= 1048576
                        ? number_format($size / 1048576, 1).' MB'
                        : number_format($size / 1024, 0).' KB',
                ];
            }, $announcement->attachments ?? []),
            'event_date' => $announcement->event_date?->toDateString(),
            'event_end_date' => $announcement->event_end_date?->toDateString(),
            'start_time' => $announcement->start_time,
            'end_time' => $announcement->end_time,
            'location' => $announcement->location,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function announcementSummaryData(Announcement $announcement): array
    {
        return [
            'id' => $announcement->id,
            'title' => $announcement->title,
            'category' => $announcement->category,
            'posted_by_office' => $announcement->posted_by,
            'date' => $announcement->date->toDateString(),
            'content' => Str::limit(strip_tags($announcement->body), 180),
            'content_html' => $announcement->bodyAsHtml(),
            'image' => $announcement->image
                ? Storage::disk('public')->url($announcement->image)
                : null,
            'event_date' => $announcement->event_date?->toDateString(),
            'event_end_date' => $announcement->event_end_date?->toDateString(),
            'start_time' => $announcement->start_time,
            'end_time' => $announcement->end_time,
            'location' => $announcement->location,
        ];
    }
}
