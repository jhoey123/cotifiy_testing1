<?php

use App\Models\Announcement;
use App\Models\User;
use App\Notifications\AnnouncementPublished;
use Illuminate\Support\Facades\Notification;

test('clients can view and manage persisted announcement notifications', function () {
    $user = User::factory()->create();
    $anotherUser = User::factory()->create();
    $announcement = Announcement::create([
        'title' => 'Campus closure',
        'category' => 'General',
        'posted_by' => 'Registrar',
        'date' => now()->toDateString(),
        'body' => 'The campus will be closed tomorrow.',
    ]);

    Notification::sendNow($user, new AnnouncementPublished($announcement), ['database']);
    Notification::sendNow($user, new AnnouncementPublished($announcement), ['database']);
    Notification::sendNow($anotherUser, new AnnouncementPublished($announcement), ['database']);

    $notifications = $user->notifications()->latest()->get();
    $notification = $notifications->firstOrFail();
    $anotherUsersNotification = $anotherUser->notifications()->firstOrFail();

    $this->actingAs($user, 'web')
        ->get(route('client.notifications'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('client/clientnotif')
            ->where('unreadCount', 2)
            ->has('notifications', 2)
            ->where('notifications.0.title', 'Campus closure')
            ->where('notifications.0.office', 'Registrar')
            ->where('notifications.0.link', route('client.announcements.show', $announcement))
            ->where('notifications.0.is_read', false));

    $this->get(route('client.events'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('recentNotifications.0.title', 'Campus closure')
            ->where('unreadCount', 2));

    $this->get(route('client.saved'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('recentNotifications.0.title', 'Campus closure')
            ->where('unreadCount', 2));

    $this->post(route('client.notifications.read', $anotherUsersNotification->id))
        ->assertNotFound();

    $this->post(route('client.notifications.read', $notification->id))
        ->assertRedirect();
    expect($user->fresh()->unreadNotifications()->count())->toBe(1);

    $this->post(route('client.notifications.mark-all-read'))
        ->assertRedirect();
    expect($user->fresh()->unreadNotifications()->count())->toBe(0);
});
