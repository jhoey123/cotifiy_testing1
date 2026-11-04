<?php

use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('an admin can view registered users and admin users separately', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);
    $user = User::create([
        'name' => 'Avery Student',
        'email' => 'avery@example.com',
        'studentId' => 'STU-123',
        'password' => 'secret-password',
    ]);
    $secondAdmin = AdminUser::create([
        'name' => 'Another Admin',
        'email' => 'another-admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.users'))
        ->assertInertia(fn ($page) => $page
            ->component('admin/users')
            ->has('users', 1)
            ->where('users.0.id', $user->id)
            ->where('users.0.name', 'Avery Student')
            ->where('users.0.email', 'avery@example.com')
            ->where('users.0.studentId', 'STU-123')
            ->missing('users.0.password')
            ->has('adminUsers', 2)
            ->where('adminUsers.0.id', $secondAdmin->id)
            ->where('adminUsers.0.name', 'Another Admin')
            ->where('adminUsers.1.id', $admin->id)
            ->missing('adminUsers.0.password'));
});

test('the users page requires admin authentication', function () {
    $this->get(route('admin.users'))
        ->assertRedirect(route('login'));
});

test('an admin can view staff accounts from the staff page', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.staff'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/adminstaff')
            ->has('adminUsers', 1)
            ->where('adminUsers.0.id', $admin->id)
            ->where('adminUsers.0.name', 'Site Admin')
            ->missing('adminUsers.0.password'));
});

test('an admin can create another admin account', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->post(route('admin.users.admins.store'), [
            'name' => 'New Admin',
            'email' => 'NEW-ADMIN@example.com',
            'password' => 'a-strong-password',
            'password_confirmation' => 'a-strong-password',
        ])
        ->assertRedirect();

    $newAdmin = AdminUser::query()->where('email', 'new-admin@example.com')->firstOrFail();
    expect($newAdmin->name)->toBe('New Admin')
        ->and(Hash::check('a-strong-password', $newAdmin->password))->toBeTrue();
});

test('admin creation rejects an email already used by a regular user', function () {
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

    $this->actingAs($admin, 'admin')
        ->from(route('admin.users'))
        ->post(route('admin.users.admins.store'), [
            'name' => 'Duplicate Admin',
            'email' => 'avery@example.com',
            'password' => 'a-strong-password',
            'password_confirmation' => 'a-strong-password',
        ])
        ->assertRedirect(route('admin.users'))
        ->assertSessionHasErrors('email');

    expect(AdminUser::query()->count())->toBe(1);
});

test('an admin can edit and delete a regular user', function () {
    $admin = AdminUser::create([
        'name' => 'Site Admin',
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ]);
    $user = User::create([
        'name' => 'Avery Student',
        'email' => 'avery@example.com',
        'studentId' => 'STU-123',
        'password' => 'secret-password',
    ]);
    $user->forceFill(['email_verified_at' => now()])->save();

    $this->actingAs($admin, 'admin')
        ->put(route('admin.users.update', $user), [
            'name' => 'Avery Updated',
            'email' => 'avery-updated@example.com',
            'studentId' => 'STU-456',
            'course' => 'BSCS',
            'year_level' => '3rd Year',
            'password' => 'a-strong-updated-password',
            'password_confirmation' => 'a-strong-updated-password',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Avery Updated',
        'email' => 'avery-updated@example.com',
        'studentId' => 'STU-456',
        'course' => 'BSCS',
        'year_level' => '3rd Year',
        'email_verified_at' => null,
    ]);
    expect(Hash::check('a-strong-updated-password', $user->fresh()->password))->toBeTrue();

    $this->delete(route('admin.users.destroy', $user))
        ->assertRedirect();

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});
