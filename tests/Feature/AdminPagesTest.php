<?php

use App\Models\AdminUser;
use App\Models\Announcement;

test('an admin can open the announcements page from the dashboard navigation', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);
    $announcement = Announcement::create([
        'title' => 'Campus closure',
        'category' => 'General',
        'posted_by' => 'Office of the Registrar',
        'date' => now()->toDateString(),
        'body' => 'The campus will be closed tomorrow.',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.announcements.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/adminAnnouncemnt')
            ->where('announcements.0.id', $announcement->id)
            ->where('announcements.0.title', 'Campus closure')
            ->has('discussions'));
});

test('an admin can open the events page from the dashboard navigation', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);
    $event = Announcement::create([
        'title' => 'Campus orientation',
        'category' => 'Event',
        'posted_by' => 'Office of the Registrar',
        'date' => now()->toDateString(),
        'body' => 'Welcome to campus.',
        'event_date' => now()->addWeek()->toDateString(),
        'start_time' => '09:00',
        'end_time' => '12:00',
        'location' => 'Main Hall',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.events'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/adminEvent')
            ->where('events.0.id', $event->id)
            ->where('events.0.title', 'Campus orientation')
            ->where('events.0.date', now()->addWeek()->toDateString())
            ->where('events.0.venue', 'Main Hall')
            ->where('events.0.status', 'Upcoming'));
});

test('admin announcement and event pages require admin authentication', function () {
    $this->get(route('admin.announcements.index'))
        ->assertRedirect(route('login'));

    $this->get(route('admin.events'))
        ->assertRedirect(route('login'));
});
