<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

test('a guest can open the password reset request page', function () {
    $this->get(route('password.request'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('auth/forgotpass'));
});

test('a regular user can request a password reset link', function () {
    Notification::fake();
    $user = User::factory()->create();

    $this->from(route('password.request'))
        ->post(route('password.email'), ['email' => $user->email])
        ->assertRedirect(route('password.request'))
        ->assertSessionHas('status', 'We have emailed your password reset link.')
        ->assertSessionHasNoErrors();

    Notification::assertSentTo($user, ResetPassword::class);
});

test('password reset requests do not reveal whether an email is registered', function () {
    Notification::fake();

    $this->from(route('password.request'))
        ->post(route('password.email'), ['email' => 'unknown@example.com'])
        ->assertRedirect(route('password.request'))
        ->assertSessionHas(
            'status',
            'If an account exists for this email, a password reset link has been sent. Check your inbox.',
        )
        ->assertSessionHasNoErrors();

    Notification::assertNothingSent();
});

test('a regular user can reset their password with a valid token', function () {
    Notification::fake();
    $user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);

    $this->post(route('password.email'), ['email' => $user->email])
        ->assertSessionHas('status', 'We have emailed your password reset link.');

    $token = null;
    Notification::assertSentTo(
        $user,
        ResetPassword::class,
        function (ResetPassword $notification) use (&$token): bool {
            $token = $notification->token;

            return true;
        },
    );

    $this->get(route('password.reset', [
        'token' => $token,
        'email' => $user->email,
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('auth/resetpass')
            ->where('email', $user->email)
            ->where('token', $token));

    $this->post(route('password.update'), [
        'token' => $token,
        'email' => $user->email,
        'password' => 'new-secure-password',
        'password_confirmation' => 'new-secure-password',
    ])->assertRedirect(route('login'))
        ->assertSessionHas('status', 'Your password has been reset.');

    expect(Hash::check('new-secure-password', $user->fresh()->password))->toBeTrue();

    $this->get(route('login'))
        ->assertInertia(fn ($page) => $page
            ->component('auth/login')
            ->where('flash.status', 'Your password has been reset.'));
});
