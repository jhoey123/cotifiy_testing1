<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
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

test('a client can change their password with their current password', function () {
    $user = User::factory()->create([
        'password' => 'old-password',
    ]);

    $this->actingAs($user)
        ->put(route('client.profile.password'), [
            'current_password' => 'old-password',
            'password' => 'new-strong-password',
            'password_confirmation' => 'new-strong-password',
        ])
        ->assertRedirect();

    expect(Hash::check('new-strong-password', $user->fresh()->password))->toBeTrue();
});
