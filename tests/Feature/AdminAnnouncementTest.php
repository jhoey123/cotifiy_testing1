<?php

use App\Models\AdminUser;
use App\Models\Announcement;
use App\Models\Conversation;
use App\Models\StaffUser;
use App\Models\User;
use App\Notifications\AnnouncementPublished;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

test('announcement bodies render markdown without allowing raw html', function () {
    $announcement = Announcement::create([
        'title' => 'Markdown announcement',
        'category' => 'General',
        'posted_by' => 'Office of the Registrar',
        'date' => now()->toDateString(),
        'body' => '**Important** details. <script>alert(1)</script>',
    ]);

    $html = $announcement->bodyAsHtml();

    expect($html)->toContain('<strong>Important</strong>')
        ->and($html)->not->toContain('<script>');
});

test('an admin can publish an announcement', function () {
    Storage::fake('public');
    Notification::fake();

    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);
    $users = User::factory()->count(2)->create();

    $this->actingAs($admin, 'admin')
        ->post(route('admin.announcements.store'), [
            'title' => 'Campus closure',
            'category' => 'General',
            'posted_by' => 'Office of the Registrar',
            'body' => 'The campus will be closed tomorrow.',
            'image' => UploadedFile::fake()->image('campus.png'),
        ])
        ->assertRedirect();

    $announcement = Announcement::query()->firstOrFail();
    expect($announcement->author_admin_id)->toBe($admin->id)
        ->and($announcement->adminAuthor->is($admin))->toBeTrue();

    $this->assertDatabaseHas('announcement', [
        'title' => 'Campus closure',
        'category' => 'General',
        'posted_by' => 'Office of the Registrar',
        'body' => 'The campus will be closed tomorrow.',
    ]);
    expect($announcement->image)->not->toBeNull();
    Storage::disk('public')->assertExists($announcement->image);

    expect($announcement->date->toDateString())->toBe(now()->toDateString());
    foreach ($users as $user) {
        Notification::assertSentTo($user, AnnouncementPublished::class, function (AnnouncementPublished $notification) use ($announcement, $user): bool {
            $mail = $notification->toMail($user);

            return $notification->announcement->is($announcement)
                && $mail->subject === 'New announcement: Campus closure'
                && $mail->actionText === 'Read announcement';
        });
    }

    $this->get(route('admin'))
        ->assertInertia(fn ($page) => $page
            ->component('admin/admin')
            ->where('announcements.0.title', 'Campus closure')
            ->where('announcements.0.image_url', '/storage/'.$announcement->image)
            ->where('announcements.0.date', now()->toDateString()));
});

test('admin announcement pages include all announcements and expose ownership for My Posts filtering', function () {
    Notification::fake();
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);
    $otherAdmin = AdminUser::create([
        'name' => 'Other Admin',
        'email' => 'other-admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->post(route('admin.announcements.store'), [
            'title' => 'My announcement',
            'category' => 'General',
            'posted_by' => 'Student Services',
            'body' => 'Created by the signed-in admin.',
        ])->assertRedirect();
    $myAnnouncement = Announcement::query()->where('title', 'My announcement')->firstOrFail();

    $this->actingAs($otherAdmin, 'admin')
        ->post(route('admin.announcements.store'), [
            'title' => 'Other admin announcement',
            'category' => 'General',
            'posted_by' => 'Registrar',
            'body' => 'Created by another admin.',
        ])->assertRedirect();
    $otherAnnouncement = Announcement::query()->where('title', 'Other admin announcement')->firstOrFail();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.announcements.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('adminId', $admin->id)
            ->has('announcements', 2)
            ->where('announcements.0.author_admin_id', $otherAdmin->id)
            ->where('announcements.1.author_admin_id', $admin->id));

    $this->get(route('admin'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('adminId', $admin->id)
            ->has('recentAnnouncements', 2)
            ->where('recentAnnouncements.0.author_admin_id', $otherAdmin->id)
            ->where('recentAnnouncements.1.author_admin_id', $admin->id));

    expect($myAnnouncement->adminAuthor->is($admin))->toBeTrue()
        ->and($otherAnnouncement->adminAuthor->is($otherAdmin))->toBeTrue();
});

test('staff can manage announcements and events through the staff panel', function () {
    Notification::fake();
    $staff = StaffUser::create([
        'name' => 'Campus Staff',
        'email' => 'staff@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($staff, 'staff')
        ->post(route('staff.announcements.store'), [
            'title' => 'Staff announcement',
            'category' => 'General',
            'posted_by' => 'Student Services',
            'body' => 'Staff created this announcement.',
        ])
        ->assertRedirect();

    $announcement = Announcement::query()->where('title', 'Staff announcement')->firstOrFail();
    expect($announcement->author_staff_id)->toBe($staff->id)
        ->and($announcement->staffAuthor->is($staff))->toBeTrue();

    $this->put(route('staff.announcements.update', $announcement), [
        'title' => 'Updated staff announcement',
        'category' => 'General',
        'posted_by' => 'Student Services',
        'body' => 'Staff updated this announcement.',
    ])->assertRedirect();

    $eventResponse = $this->post(route('staff.announcements.store'), [
        'title' => 'Staff event',
        'category' => 'Event',
        'posted_by' => 'Student Services',
        'body' => 'Staff created this event.',
        'event_date' => now()->addDays(3)->toDateString(),
        'event_end_date' => now()->addDays(4)->toDateString(),
        'start_time' => '09:00',
        'end_time' => '10:00',
        'location' => 'Main Hall',
    ]);
    $eventResponse->assertRedirect();

    $event = Announcement::query()->where('title', 'Staff event')->firstOrFail();

    $this->get(route('staff.announcements.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/adminAnnouncemnt')
            ->where('staffMode', true)
            ->where('staffName', 'Campus Staff')
            ->where('announcements.0.title', 'Staff event'));

    $this->get(route('staff.events'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/adminEvent')
            ->where('staffMode', true)
            ->where('staffName', 'Campus Staff')
            ->where('events.0.title', 'Staff event'));

    $this->delete(route('staff.announcements.destroy', $announcement))
        ->assertRedirect();

    $this->assertDatabaseMissing('announcement', ['id' => $announcement->id]);
    $this->assertDatabaseHas('announcement', ['id' => $event->id, 'category' => 'Event']);
});

test('staff announcement pages show all announcements and provide the signed-in author id for My Posts filtering', function () {
    Notification::fake();
    $staff = StaffUser::create([
        'name' => 'Test One',
        'email' => 'test1@example.com',
        'password' => 'secret-password',
    ]);
    $otherStaff = StaffUser::create([
        'name' => 'Test Two',
        'email' => 'test2@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($staff, 'staff')
        ->post(route('staff.announcements.store'), [
            'title' => 'My announcement',
            'category' => 'General',
            'posted_by' => 'Student Services',
            'body' => 'Created by Test One.',
        ])->assertRedirect();
    $this->post(route('staff.announcements.store'), [
        'title' => 'My event',
        'category' => 'Event',
        'posted_by' => 'Student Services',
        'body' => 'Created by Test One.',
        'event_date' => now()->addDays(3)->toDateString(),
        'location' => 'Main Hall',
    ])->assertRedirect();

    $this->actingAs($otherStaff, 'staff')
        ->post(route('staff.announcements.store'), [
            'title' => 'Other staff event',
            'category' => 'Event',
            'posted_by' => 'Student Services',
            'body' => 'Created by Test Two.',
            'event_date' => now()->addDays(4)->toDateString(),
            'location' => 'Auditorium',
        ])->assertRedirect();

    $otherEvent = Announcement::query()->where('title', 'Other staff event')->firstOrFail();

    $this->actingAs($staff, 'staff')
        ->get(route('staff.announcements.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('staffName', 'Test One')
            ->where('staffId', $staff->id)
            ->has('announcements', 3)
            ->where('announcements.0.title', 'Other staff event')
            ->where('announcements.0.author_staff_id', $otherStaff->id)
            ->where('announcements.1.title', 'My event')
            ->where('announcements.1.author_staff_id', $staff->id)
            ->where('announcements.2.title', 'My announcement')
            ->where('announcements.2.author_staff_id', $staff->id));

    $this->get(route('staff'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('recentAnnouncements', 3)
            ->where('recentAnnouncements.0.title', 'Other staff event')
            ->where('announcementCount', 3)
            ->where('eventCount', 2)
            ->has('upcomingEvents', 2)
            ->where('upcomingEvents.0.title', 'My event')
            ->where('upcomingEvents.1.title', 'Other staff event'));

    $this->get(route('staff.events'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('events', 2)
            ->where('events.0.title', 'Other staff event')
            ->where('events.1.title', 'My event'));

    $this->put(route('staff.announcements.update', $otherEvent), [
        'title' => 'Changed by Test One',
        'category' => 'Event',
        'posted_by' => 'Student Services',
        'body' => 'Attempted unauthorized update.',
        'event_date' => now()->addDays(4)->toDateString(),
        'location' => 'Auditorium',
    ])->assertForbidden();

    $this->delete(route('staff.announcements.destroy', $otherEvent))
        ->assertForbidden();
    $this->assertDatabaseHas('announcement', ['id' => $otherEvent->id]);
});

test('staff can reply to announcement discussions using the staff identity', function () {
    $client = User::factory()->create();
    $staff = StaffUser::create([
        'name' => 'Campus Staff',
        'email' => 'staff@example.com',
        'password' => 'secret-password',
    ]);
    $announcement = Announcement::create([
        'title' => 'Discussion announcement',
        'category' => 'General',
        'posted_by' => 'Student Services',
        'date' => now()->toDateString(),
        'body' => 'Discuss this update.',
    ]);
    $conversation = Conversation::create([
        'type' => 'announcement',
        'name' => $announcement->title,
        'announcement_id' => $announcement->id,
        'client_id' => null,
    ]);

    $this->actingAs($staff, 'staff')
        ->post(route('staff.announcements.comments.store', $announcement), [
            'content' => 'Staff reply',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('messages', [
        'conversation_id' => $conversation->id,
        'sender_staff_id' => $staff->id,
        'sender_admin_id' => null,
        'content' => 'Staff reply',
    ]);

    $this->actingAs($client, 'web')
        ->get(route('client.announcements.show', $announcement))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('messages.0.author', 'Campus Staff')
            ->where('messages.0.role', 'Staff'));
});

test('admins can upload downloadable documents and manage them when editing announcements', function () {
    Storage::fake('public');
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->post(route('admin.announcements.store'), [
            'title' => 'Document announcement',
            'category' => 'General',
            'posted_by' => 'Office of the Registrar',
            'body' => 'Review the attached documents.',
            'attachments' => [
                UploadedFile::fake()->create('schedule.pdf', 20, 'application/pdf'),
                UploadedFile::fake()->create('guide.docx', 30, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
            ],
        ])
        ->assertRedirect();

    $announcement = Announcement::query()->firstOrFail();
    $originalAttachments = $announcement->attachments;
    expect($originalAttachments)->toHaveCount(2);
    foreach ($originalAttachments as $attachment) {
        Storage::disk('public')->assertExists($attachment['path']);
    }

    $this->actingAs(User::factory()->create(), 'web')
        ->get(route('client.announcements.show', $announcement))
        ->assertInertia(fn ($page) => $page
            ->where('announcement.attachments.0.name', 'schedule.pdf')
            ->where('announcement.attachments.0.url', '/storage/'.$originalAttachments[0]['path']));

    $this->actingAs($admin, 'admin')
        ->post(route('admin.announcements.update', $announcement), [
            '_method' => 'put',
            'title' => 'Document announcement',
            'category' => 'General',
            'posted_by' => 'Office of the Registrar',
            'body' => 'Review the attached documents.',
            'remove_attachments' => [$originalAttachments[0]['path']],
            'attachments' => [
                UploadedFile::fake()->create('updated-notes.txt', 5, 'text/plain'),
            ],
        ])
        ->assertRedirect();

    $announcement->refresh();
    expect(array_column($announcement->attachments, 'name'))
        ->toBe(['guide.docx', 'updated-notes.txt']);
    Storage::disk('public')->assertMissing($originalAttachments[0]['path']);
    Storage::disk('public')->assertExists($originalAttachments[1]['path']);
    Storage::disk('public')->assertExists($announcement->attachments[1]['path']);
});

test('an admin cannot publish an announcement with a non-image upload', function () {
    Storage::fake('public');

    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->from(route('admin'))
        ->post(route('admin.announcements.store'), [
            'title' => 'Campus closure',
            'category' => 'General',
            'posted_by' => 'Office of the Registrar',
            'body' => 'The campus will be closed tomorrow.',
            'image' => UploadedFile::fake()->create('document.pdf', 10, 'application/pdf'),
        ])
        ->assertRedirect(route('admin'))
        ->assertSessionHasErrors('image');

    expect(Announcement::query()->count())->toBe(0);
});

test('an admin can edit an announcement and replace its image', function () {
    Storage::fake('public');
    $oldImage = UploadedFile::fake()->image('old.png')->store('announcements', 'public');
    $announcement = Announcement::create([
        'title' => 'Old title',
        'category' => 'General',
        'posted_by' => 'Old office',
        'date' => now()->subDay()->toDateString(),
        'body' => 'Old details',
        'image' => $oldImage,
    ]);

    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->post(route('admin.announcements.update', $announcement), [
            '_method' => 'put',
            'title' => 'Updated title',
            'category' => 'Academic',
            'posted_by' => 'Registrar',
            'body' => 'Updated details',
            'image' => UploadedFile::fake()->image('new.png'),
        ])
        ->assertRedirect();

    $announcement->refresh();
    expect($announcement->title)->toBe('Updated title')
        ->and($announcement->category)->toBe('Academic')
        ->and($announcement->posted_by)->toBe('Registrar')
        ->and($announcement->body)->toBe('Updated details')
        ->and($announcement->date->toDateString())->toBe(now()->subDay()->toDateString())
        ->and($announcement->image)->not->toBe($oldImage);
    Storage::disk('public')->assertMissing($oldImage);
    Storage::disk('public')->assertExists($announcement->image);
});

test('an admin can delete an announcement and its image', function () {
    Storage::fake('public');
    $image = UploadedFile::fake()->image('campus.png')->store('announcements', 'public');
    $announcement = Announcement::create([
        'title' => 'Campus closure',
        'category' => 'General',
        'posted_by' => 'Office of the Registrar',
        'date' => now()->toDateString(),
        'body' => 'The campus will be closed tomorrow.',
        'image' => $image,
    ]);

    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->post('/auth/login', [
        'email' => $admin->email,
        'password' => 'secret-password',
    ])->assertRedirect(route('admin'));

    $this->withHeaders([
        'X-Inertia' => 'true',
        'Referer' => route('admin'),
    ])->post(route('admin.announcements.destroy', $announcement), [
        '_method' => 'delete',
    ])
        ->assertRedirect();

    $this->assertDatabaseMissing('announcement', ['id' => $announcement->id]);
    Storage::disk('public')->assertMissing($image);

    $this->flushHeaders()->get(route('admin'))->assertOk();
});

test('an admin cannot publish an announcement with an invalid category', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->from(route('admin'))
        ->post(route('admin.announcements.store'), [
            'title' => 'Campus closure',
            'category' => 'Invalid',
            'posted_by' => 'Office of the Registrar',
            'body' => 'The campus will be closed tomorrow.',
        ])
        ->assertRedirect(route('admin'))
        ->assertSessionHasErrors('category');

    expect(Announcement::query()->count())->toBe(0);
});

test('the admin dashboard shows recent announcements and upcoming events from the database', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);
    User::create([
        'name' => 'Avery Student',
        'email' => 'avery@example.com',
        'studentId' => 'STU-123',
        'password' => 'secret-password',
    ]);
    User::create([
        'name' => 'Jordan Student',
        'email' => 'jordan@example.com',
        'studentId' => 'STU-456',
        'password' => 'secret-password',
    ]);

    $announcement = Announcement::create([
        'title' => 'Latest update',
        'category' => 'Academic',
        'posted_by' => 'Registrar',
        'date' => now()->toDateString(),
        'body' => 'A current announcement.',
    ]);
    $upcomingEvent = Announcement::create([
        'title' => 'Campus fair',
        'category' => 'Event',
        'posted_by' => 'Student Affairs',
        'date' => now()->toDateString(),
        'body' => 'Join us at the campus fair.',
        'event_date' => now()->addDays(3)->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '12:00:00',
        'location' => 'Main courtyard',
    ]);
    Announcement::create([
        'title' => 'Past event',
        'category' => 'Event',
        'posted_by' => 'Student Affairs',
        'date' => now()->subDays(10)->toDateString(),
        'body' => 'An event that has already happened.',
        'event_date' => now()->subDay()->toDateString(),
        'location' => 'Auditorium',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin'))
        ->assertInertia(fn ($page) => $page
            ->component('admin/admin')
            ->where('announcements.0.id', $upcomingEvent->id)
            ->where('recentAnnouncements.0.id', $upcomingEvent->id)
            ->where('recentAnnouncements.1.id', $announcement->id)
            ->where('upcomingEvents.0.id', $upcomingEvent->id)
            ->where('upcomingEvents.0.event_date', now()->addDays(3)->toDateString())
            ->where('announcementCount', 3)
            ->where('eventCount', 2)
            ->where('userCount', 2)
            ->missing('upcomingEvents.1'));
});

test('an admin can publish an event announcement with a future schedule', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->post(route('admin.announcements.store'), [
            'title' => 'Campus fair',
            'category' => 'Event',
            'posted_by' => 'Student Affairs',
            'body' => 'Join us at the campus fair.',
            'event_date' => now()->addDays(3)->toDateString(),
            'start_time' => '09:00',
            'end_time' => '12:00',
            'location' => 'Main courtyard',
        ])
        ->assertRedirect();

    $event = Announcement::query()->firstOrFail();
    expect($event->event_date->toDateString())->toBe(now()->addDays(3)->toDateString())
        ->and($event->start_time)->toStartWith('09:00')
        ->and($event->end_time)->toStartWith('12:00')
        ->and($event->location)->toBe('Main courtyard');
});

test('an admin can publish a multi-day event with an inclusive end date', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);
    $startDate = now()->addDays(3)->toDateString();
    $endDate = now()->addDays(5)->toDateString();

    $this->actingAs($admin, 'admin')
        ->post(route('admin.announcements.store'), [
            'title' => 'Campus festival',
            'category' => 'Event',
            'posted_by' => 'Student Affairs',
            'body' => 'A three-day campus festival.',
            'event_date' => $startDate,
            'event_end_date' => $endDate,
            'start_time' => '09:00',
            'end_time' => '17:00',
            'location' => 'Main courtyard',
        ])
        ->assertRedirect();

    $event = Announcement::query()->firstOrFail();
    expect($event->event_date->toDateString())->toBe($startDate)
        ->and($event->event_end_date->toDateString())->toBe($endDate);

    $this->get(route('admin.events'))
        ->assertInertia(fn ($page) => $page
            ->component('admin/adminEvent')
            ->where('events.0.date', $startDate)
            ->where('events.0.end_date', $endDate));
});

test('an event end date cannot be earlier than its start date', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->from(route('admin.events'))
        ->post(route('admin.announcements.store'), [
            'title' => 'Invalid event range',
            'category' => 'Event',
            'posted_by' => 'Student Affairs',
            'body' => 'This date range is invalid.',
            'event_date' => now()->addDays(5)->toDateString(),
            'event_end_date' => now()->addDays(3)->toDateString(),
            'location' => 'Main courtyard',
        ])
        ->assertSessionHasErrors('event_end_date');

    expect(Announcement::query()->count())->toBe(0);
});
