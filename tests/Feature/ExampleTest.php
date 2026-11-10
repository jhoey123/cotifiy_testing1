<?php

use App\Models\Announcement;

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});

test('the public home displays the latest announcements', function () {
    Announcement::create([
        'title' => 'Latest campus update',
        'category' => 'General',
        'posted_by' => 'Student Affairs',
        'date' => now()->toDateString(),
        'body' => 'Read the **latest** update.',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->where('publicAnnouncements.0.title', 'Latest campus update')
            ->where('publicAnnouncements.0.summary', 'Read the **latest** update.'));
});
