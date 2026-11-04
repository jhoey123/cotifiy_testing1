<?php

use App\Models\AdminUser;
use App\Models\StaffUser;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('an admin can log in and is redirected to the admin page across requests', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => Hash::make('secret-password'),
    ]);

    $this->post('/auth/login', [
        'email' => $admin->email,
        'password' => 'secret-password',
    ])->assertRedirect(route('admin'));

    $this->get(route('admin'))
        ->assertOk()
        ->assertHeaderContains('Cache-Control', 'no-store')
        ->assertInertia(fn ($page) => $page->component('admin/admin'));
});

test('a regular user is redirected to the client page after login', function () {
    $user = User::factory()->create([
        'email' => 'student@example.com',
        'password' => Hash::make('secret-password'),
    ]);

    $this->withSession(['url.intended' => route('home')])
        ->post('/auth/login', [
            'email' => $user->email,
            'password' => 'secret-password',
        ])->assertRedirect(route('client.clientpage'));

    $this->get(route('admin'))->assertRedirect(route('login'));
});

test('a staff user is redirected to the staff dashboard after login', function () {
    $staff = StaffUser::create([
        'name' => 'Campus Staff',
        'email' => 'staff@example.com',
        'password' => 'secret-password',
    ]);

    $this->post('/auth/login', [
        'email' => $staff->email,
        'password' => 'secret-password',
    ])->assertRedirect(route('staff'));

    $this->get(route('staff'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('staff/staff')
            ->where('userName', 'Campus Staff'));

    $this->get(route('admin'))->assertRedirect(route('login'));
    $this->get(route('admin.users'))->assertRedirect(route('login'));
});

test('successful client logins do not count toward the failed login limit', function () {
    $user = User::factory()->create([
        'email' => 'student@example.com',
        'password' => Hash::make('secret-password'),
    ]);

    foreach (range(1, 6) as $_) {
        $this->post('/auth/login', [
            'email' => $user->email,
            'password' => 'secret-password',
        ])->assertRedirect(route('client.clientpage'));
    }
});

test('repeated failed logins are rate limited', function () {
    $user = User::factory()->create([
        'email' => 'student@example.com',
        'password' => Hash::make('secret-password'),
    ]);

    foreach (range(1, 5) as $_) {
        $this->from('/auth/login')->post('/auth/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertRedirect('/auth/login')
            ->assertSessionHasErrors('email');
    }

    $this->post('/auth/login', [
        'email' => $user->email,
        'password' => 'secret-password',
    ])->assertTooManyRequests()
        ->assertHeader('Retry-After');
});

test('a regular user can access the client page', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web')
        ->get(route('client.clientpage'))
        ->assertOk()
        ->assertHeaderContains('Cache-Control', 'no-store')
        ->assertInertia(fn ($page) => $page->component('client/clientpage'));
});

test('a regular user can log out from the client page', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web')
        ->post('/logout')
        ->assertRedirect(route('login'))
        ->assertHeaderContains('Cache-Control', 'no-store');

    $this->get(route('client.clientpage'))
        ->assertRedirect(route('login'));
});

test('a staff user can log out from the staff dashboard', function () {
    $staff = StaffUser::create([
        'name' => 'Campus Staff',
        'email' => 'staff@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($staff, 'staff')
        ->post('/staff/logout')
        ->assertRedirect(route('login'))
        ->assertHeaderContains('Cache-Control', 'no-store');

    $this->get(route('staff'))->assertRedirect(route('login'));
});

test('an admin can still log out from the admin page', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => Hash::make('secret-password'),
    ]);

    $this->actingAs($admin, 'admin')
        ->post('/admin/logout')
        ->assertRedirect(route('login'))
        ->assertHeaderContains('Cache-Control', 'no-store');

    $this->get(route('admin'))
        ->assertRedirect(route('login'));
});

test('an admin cannot access the client page', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => Hash::make('secret-password'),
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('client.clientpage'))
        ->assertRedirect(route('login'));
});

test('login rejects an incorrect password for an existing email', function () {
    AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => Hash::make('secret-password'),
    ]);

    $this->from('/auth/login')->post('/auth/login', [
        'email' => 'admin@example.com',
        'password' => 'wrong-password',
    ])->assertRedirect('/auth/login')
        ->assertSessionHasErrors('email');
});
