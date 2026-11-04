<?php

use App\Models\AdminUser;
use App\Models\StaffUser;
use Illuminate\Support\Facades\Hash;

test('an admin can view the settings page', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'old-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.settings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/settings'));
});

test('an admin can change their password using the current password', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'old-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->put(route('admin.settings.password'), [
            'current_password' => 'old-password',
            'password' => 'new-strong-password',
            'password_confirmation' => 'new-strong-password',
        ])
        ->assertRedirect();

    expect(Hash::check('new-strong-password', $admin->fresh()->password))->toBeTrue();
});

test('an admin cannot change their password without the correct current password', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'old-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->from(route('admin.settings'))
        ->put(route('admin.settings.password'), [
            'current_password' => 'incorrect-password',
            'password' => 'new-strong-password',
            'password_confirmation' => 'new-strong-password',
        ])
        ->assertRedirect(route('admin.settings'))
        ->assertSessionHasErrors('current_password');

    expect(Hash::check('old-password', $admin->fresh()->password))->toBeTrue();
});

test('the admin settings page requires admin authentication', function () {
    $this->get(route('admin.settings'))
        ->assertRedirect(route('login'));

    $this->put(route('admin.settings.password'), [
        'current_password' => 'old-password',
        'password' => 'new-strong-password',
        'password_confirmation' => 'new-strong-password',
    ])->assertRedirect(route('login'));
});

test('an admin can log out and lose access to admin pages', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->post(route('admin.logout'))
        ->assertRedirect(route('login'));

    $this->get(route('admin'))
        ->assertRedirect(route('login'));
});

test('staff can view the shared settings page and change their password', function () {
    $staff = StaffUser::create([
        'name' => 'Campus Staff',
        'email' => 'staff@example.com',
        'password' => 'old-password',
    ]);

    $this->actingAs($staff, 'staff')
        ->get(route('staff.settings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/settings')
            ->where('staffMode', true)
            ->where('staffName', 'Campus Staff'));

    $this->put(route('staff.settings.password'), [
        'current_password' => 'old-password',
        'password' => 'new-strong-password',
        'password_confirmation' => 'new-strong-password',
    ])->assertRedirect();

    expect(Hash::check('new-strong-password', $staff->fresh()->password))->toBeTrue();
});
