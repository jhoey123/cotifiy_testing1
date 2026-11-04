<?php

use App\Models\User;
use App\Notifications\VerifyPendingRegistration;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;

test('registration sends a verification email without creating a user', function () {
    Notification::fake();

    $response = $this->post(route('register.store'), [
        'name' => 'Taylor Student',
        'studentId' => 'STU-1001',
        'course' => 'BSIT',
        'year_level' => '3rd Year',
        'email' => 'taylor@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertStatus(302);

    parse_str((string) parse_url($response->headers->get('Location'), PHP_URL_QUERY), $query);
    expect($query['email'])->toBe('taylor@example.com')
        ->and($query['registration'])->toBeString();

    $this->assertDatabaseMissing('users', ['email' => 'taylor@example.com']);
    Notification::assertSentOnDemand(VerifyPendingRegistration::class);
});

test('registration requires a valid course and year level', function () {
    Notification::fake();

    $this->from(route('register'))
        ->post(route('register.store'), [
            'name' => 'Taylor Student',
            'studentId' => 'STU-1001',
            'course' => 'INVALID',
            'year_level' => '5th Year',
            'email' => 'taylor@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])
        ->assertRedirect(route('register'))
        ->assertSessionHasErrors(['course', 'year_level']);

    $this->assertDatabaseMissing('users', ['email' => 'taylor@example.com']);
    Notification::assertNothingSent();
});

test('a guest can resend a pending registration verification email', function () {
    Notification::fake();

    $response = $this->post(route('register.store'), [
        'name' => 'Taylor Student',
        'studentId' => 'STU-1001',
        'course' => 'BSIT',
        'year_level' => '3rd Year',
        'email' => 'taylor@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    parse_str((string) parse_url($response->headers->get('Location'), PHP_URL_QUERY), $query);

    $response = $this->post(route('registration.resend'), [
        'registration' => $query['registration'],
    ]);

    $response->assertRedirect(route('registration.notice', [
        'email' => 'taylor@example.com',
        'registration' => $query['registration'],
    ]));
    $response->assertSessionHas('status', 'verification-link-sent');

    $this->get(route('registration.notice', [
        'email' => 'taylor@example.com',
        'registration' => $query['registration'],
    ]))->assertInertia(fn ($page) => $page
        ->component('auth/verify-email')
        ->where('email', 'taylor@example.com')
        ->where('registration', $query['registration'])
        ->where('status', 'verification-link-sent'));

    $verificationUrls = [];
    Notification::assertSentOnDemand(
        VerifyPendingRegistration::class,
        function (VerifyPendingRegistration $notification) use (&$verificationUrls): bool {
            $verificationUrls[] = $notification->verificationUrl;

            return true;
        },
    );

    expect($verificationUrls)->toHaveCount(2);
    $this->assertDatabaseMissing('users', ['email' => 'taylor@example.com']);
});

test('an authenticated user can request another verification email', function () {
    Notification::fake();

    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)
        ->from(route('verification.notice'))
        ->post(route('verification.send'));

    $response->assertRedirect(route('verification.notice'));
    Notification::assertSentTo($user, VerifyEmail::class);

    $this->get(route('verification.notice'))
        ->assertInertia(fn ($page) => $page
            ->component('auth/verify-email')
            ->where('email', $user->email)
            ->where('verified', false)
            ->where('status', 'verification-link-sent'));
});

test('a valid registration verification link creates a verified user', function () {
    Notification::fake();

    $this->post(route('register.store'), [
        'name' => 'Taylor Student',
        'studentId' => 'STU-1001',
        'course' => 'BSIT',
        'year_level' => '3rd Year',
        'email' => 'taylor@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $verificationUrl = null;
    Notification::assertSentOnDemand(
        VerifyPendingRegistration::class,
        function (VerifyPendingRegistration $notification) use (&$verificationUrl): bool {
            $verificationUrl = $notification->verificationUrl;

            return true;
        },
    );

    $this->assertDatabaseMissing('users', ['email' => 'taylor@example.com']);

    $this->get($verificationUrl)
        ->assertInertia(fn ($page) => $page
            ->component('auth/verify-email')
            ->where('verified', true));

    expect(User::where('email', 'taylor@example.com')->firstOrFail()->hasVerifiedEmail())
        ->toBeTrue()
        ->and(User::where('email', 'taylor@example.com')->value('course'))->toBe('BSIT')
        ->and(User::where('email', 'taylor@example.com')->value('year_level'))->toBe('3rd Year');
});

test('an invalid registration verification link does not create a user', function () {
    Notification::fake();

    $this->post(route('register.store'), [
        'name' => 'Taylor Student',
        'studentId' => 'STU-1001',
        'course' => 'BSIT',
        'year_level' => '3rd Year',
        'email' => 'taylor@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $verificationUrl = null;
    Notification::assertSentOnDemand(
        VerifyPendingRegistration::class,
        function (VerifyPendingRegistration $notification) use (&$verificationUrl): bool {
            $verificationUrl = $notification->verificationUrl;

            return true;
        },
    );

    $this->get(str_replace('signature=', 'signature=invalid', $verificationUrl))
        ->assertForbidden();

    $this->assertDatabaseMissing('users', ['email' => 'taylor@example.com']);
});

test('a valid signed verification link marks an existing user email as verified', function () {
    $user = User::factory()->unverified()->create();
    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(30),
        [
            'id' => $user->getKey(),
            'hash' => sha1($user->getEmailForVerification()),
        ],
    );

    $response = $this->actingAs($user)->get($url);

    $response->assertInertia(fn ($page) => $page
        ->component('auth/verify-email')
        ->where('verified', true));
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});
