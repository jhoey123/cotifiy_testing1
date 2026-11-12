<?php

use App\Models\User;
use App\Notifications\AccountPasswordReset;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('a client can open their account pages with their real account name', function () {
    $user = User::factory()->create([
        'name' => 'Real Account Name',
    ]);

    $this->actingAs($user)
        ->get(route('client.clientpage'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/clientpage')
            ->where('userName', 'Real Account Name')
            ->where('user.name', 'Real Account Name'));

    $this->get(route('client.profile'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/clientprofile')
            ->where('user.name', 'Real Account Name'));

    $this->get(route('client.settings'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/clientsetting')
            ->where('user.name', 'Real Account Name'));

    $this->get(route('client.notifications'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/clientnotif')
            ->where('notifications', []));
});

test('the client sidebar receives the signed-in student profile photo url', function () {
    $user = User::factory()->create([
        'profile_photo_path' => 'profile-photos/student.jpg',
    ]);

    $this->actingAs($user)
        ->get(route('client.clientpage'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.profile_photo_url', '/storage/profile-photos/student.jpg'));
});

test('a client can update their profile details', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('client.profile.update'), [
            'name' => 'Updated Account Name',
            'email' => $user->email,
            'student_id' => 'STU-2026',
            'course' => 'BSCS',
            'year_level' => '4th Year',
        ])
        ->assertRedirect();

    expect($user->fresh())
        ->name->toBe('Updated Account Name')
        ->studentId->toBe('STU-2026')
        ->course->toBe('BSCS')
        ->year_level->toBe('4th Year');
});

test('a client can upload and replace their profile photo', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('client.profile.photo.update'), [
            'photo' => UploadedFile::fake()->image('profile.jpg'),
        ])
        ->assertRedirect();

    $firstPhotoPath = $user->fresh()->profile_photo_path;

    expect($firstPhotoPath)->toStartWith('profile-photos/');
    Storage::disk('public')->assertExists($firstPhotoPath);

    $this->post(route('client.profile.photo.update'), [
        'photo' => UploadedFile::fake()->image('new-profile.jpg'),
    ])->assertRedirect();

    $newPhotoPath = $user->fresh()->profile_photo_path;

    expect($newPhotoPath)->not->toBe($firstPhotoPath);
    Storage::disk('public')->assertMissing($firstPhotoPath);
    Storage::disk('public')->assertExists($newPhotoPath);

    $this->get(route('client.profile'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('user.profile_photo_url', Storage::disk('public')->url($newPhotoPath)));
});

test('a client can request a password reset link to their account email', function () {
    Notification::fake();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('client.profile.password.reset-link'))
        ->assertRedirect()
        ->assertSessionHas('status', 'A password reset link has been sent to your email address.');

    Notification::assertSentTo($user, AccountPasswordReset::class);
});

test('a client can open their password reset link while signed in', function () {
    Notification::fake();
    $user = User::factory()->create();
    $token = null;
    $url = null;

    $this->actingAs($user)
        ->post(route('client.profile.password.reset-link'))
        ->assertRedirect();

    Notification::assertSentTo(
        $user,
        AccountPasswordReset::class,
        function (AccountPasswordReset $notification) use ($user, &$token, &$url): bool {
            $token = $notification->token;
            $url = $notification->toMail($user)->actionUrl;

            return true;
        },
    );

    expect($url)->toContain(route('client.password.reset.form', [
        'token' => $token,
        'email' => $user->email,
    ]));

    $this->get($url)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/resetpass')
            ->where('email', $user->email)
            ->where('token', $token));
});

test('resetting a password logs out the current session and other database sessions', function () {
    Notification::fake();
    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email])->assertRedirect();

    $token = null;
    Notification::assertSentTo(
        $user,
        AccountPasswordReset::class,
        function (AccountPasswordReset $notification) use (&$token): bool {
            $token = $notification->token;

            return true;
        },
    );

    DB::table('sessions')->insert([
        'id' => 'other-device-session',
        'user_id' => $user->id,
        'ip_address' => '127.0.0.1',
        'user_agent' => 'test',
        'payload' => '',
        'last_activity' => now()->timestamp,
    ]);

    $this->actingAs($user)
        ->post(route('client.password.reset'), [
            'token' => $token,
            'email' => $user->email,
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ])
        ->assertRedirect(route('login'))
        ->assertSessionHas('status', 'Your password has been changed. Please log in again.');

    $this->assertGuest('web');
    $this->assertDatabaseMissing('sessions', ['user_id' => $user->id]);
});

test('a client cannot request a password reset link for another email', function () {
    Notification::fake();
    $user = User::factory()->create();
    $anotherUser = User::factory()->create();

    $this->actingAs($user)
        ->post(route('client.profile.password.reset-link'), ['email' => $anotherUser->email])
        ->assertRedirect();

    Notification::assertSentTo($user, AccountPasswordReset::class);
    Notification::assertNotSentTo($anotherUser, AccountPasswordReset::class);
});
