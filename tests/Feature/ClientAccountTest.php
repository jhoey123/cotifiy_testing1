<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
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
