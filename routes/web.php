<?php

use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\AnnouncementDiscussionController as AdminAnnouncementDiscussionController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\Client\AnnouncementDiscussionController;
use App\Http\Controllers\Client\ClientAccountController;
use App\Http\Controllers\Client\ClientPageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ClientPageController::class, 'welcome'])->name('home');
Route::inertia('/announcementpage', 'announcementpage')->name('announcementpage');
Route::inertia('/auth/login', 'auth/login')->name('login');
Route::inertia('/auth/register', 'auth/register')->name('register');
Route::inertia('/auth/verify-email', 'auth/verify-email')->name('verification.notice');
Route::get('/client/clientpage', ClientPageController::class)
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.clientpage');
Route::redirect('/client', '/client/clientpage')
    ->middleware(['auth:web', 'private-cache']);
Route::get('/client/announcements', [ClientPageController::class, 'announcements'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.announcements.index');
Route::get('/client/events', [ClientPageController::class, 'events'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.events');
Route::get('/client/saved', [ClientPageController::class, 'saved'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.saved');
Route::get('/client/profile', [ClientAccountController::class, 'profile'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.profile');
Route::put('/client/profile', [ClientAccountController::class, 'updateProfile'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.profile.update');
Route::put('/client/profile/password', [ClientAccountController::class, 'updatePassword'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.profile.password');
Route::get('/client/settings', [ClientAccountController::class, 'settings'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.settings');
Route::get('/client/notifications', [ClientAccountController::class, 'notifications'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.notifications');
Route::post('/client/notifications/{notification}/read', [ClientAccountController::class, 'markNotificationRead'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.notifications.read');
Route::post('/client/notifications/mark-all-read', [ClientAccountController::class, 'markAllNotificationsRead'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.notifications.mark-all-read');
Route::get('/client/announcements/{announcement}', [ClientPageController::class, 'show'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('client.announcements.show');
Route::post('/client/announcements/{announcement}/messages', [AnnouncementDiscussionController::class, 'store'])
    ->middleware(['auth:web', 'private-cache', 'throttle:10,1'])
    ->name('client.announcements.messages.store');
Route::get('/admin', [AnnouncementController::class, 'index'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin');
Route::get('/staff', [AnnouncementController::class, 'staffDashboard'])
    ->middleware(['auth:staff', 'private-cache'])
    ->name('staff');
Route::get('/staff/announcements', [AnnouncementController::class, 'staffAnnouncements'])
    ->middleware(['auth:staff', 'private-cache'])
    ->name('staff.announcements.index');
Route::get('/staff/events', [AnnouncementController::class, 'staffEvents'])
    ->middleware(['auth:staff', 'private-cache'])
    ->name('staff.events');
Route::post('/staff/announcements/{announcement}/comments', [AdminAnnouncementDiscussionController::class, 'storeStaffAnnouncementComment'])
    ->middleware(['auth:staff', 'private-cache', 'throttle:20,1'])
    ->name('staff.announcements.comments.store');
Route::post('/staff/discussions/{conversation}/messages', [AdminAnnouncementDiscussionController::class, 'storeStaffMessage'])
    ->middleware(['auth:staff', 'private-cache', 'throttle:20,1'])
    ->name('staff.discussions.messages.store');
Route::post('/staff/announcements', [AnnouncementController::class, 'store'])
    ->middleware(['auth:staff', 'private-cache'])
    ->name('staff.announcements.store');
Route::put('/staff/announcements/{announcement}', [AnnouncementController::class, 'update'])
    ->middleware(['auth:staff', 'private-cache'])
    ->name('staff.announcements.update');
Route::delete('/staff/announcements/{announcement}', [AnnouncementController::class, 'destroy'])
    ->middleware(['auth:staff', 'private-cache'])
    ->name('staff.announcements.destroy');
Route::get('/staff/settings', [SettingsController::class, 'staffIndex'])
    ->middleware(['auth:staff', 'private-cache'])
    ->name('staff.settings');
Route::put('/staff/settings/password', [SettingsController::class, 'updateStaffPassword'])
    ->middleware(['auth:staff', 'private-cache'])
    ->name('staff.settings.password');
Route::get('/admin/announcements', [AnnouncementController::class, 'announcements'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.announcements.index');
Route::get('/admin/events', [AnnouncementController::class, 'events'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.events');
Route::post('/admin/announcements/{announcement}/comments', [AdminAnnouncementDiscussionController::class, 'storeAnnouncementComment'])
    ->middleware(['auth:admin', 'private-cache', 'throttle:20,1'])
    ->name('admin.announcements.comments.store');
Route::post('/admin/discussions/{conversation}/messages', [AdminAnnouncementDiscussionController::class, 'store'])
    ->middleware(['auth:admin', 'private-cache', 'throttle:20,1'])
    ->name('admin.discussions.messages.store');
Route::get('/admin/users', [UserController::class, 'index'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.users');
Route::get('/admin/staff', [UserController::class, 'staff'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.staff');
Route::get('/admin/settings', [SettingsController::class, 'index'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.settings');
Route::put('/admin/settings/password', [SettingsController::class, 'updatePassword'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.settings.password');
Route::post('/admin/users/admins', [UserController::class, 'storeAdmin'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.users.admins.store');
Route::post('/admin/users/staff', [UserController::class, 'storeStaff'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.users.staff.store');
Route::put('/admin/users/{user}', [UserController::class, 'update'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.users.update');
Route::delete('/admin/users/{user}', [UserController::class, 'destroy'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.users.destroy');
Route::post('/admin/announcements', [AnnouncementController::class, 'store'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.announcements.store');
Route::put('/admin/announcements/{announcement}', [AnnouncementController::class, 'update'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.announcements.update');
Route::delete('/admin/announcements/{announcement}', [AnnouncementController::class, 'destroy'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.announcements.destroy');
Route::post('/admin/logout', [LoginController::class, 'destroy'])
    ->middleware(['auth:admin', 'private-cache'])
    ->name('admin.logout');
Route::post('/staff/logout', [LoginController::class, 'destroy'])
    ->middleware(['auth:staff', 'private-cache'])
    ->name('staff.logout');
Route::post('/logout', [LoginController::class, 'destroy'])
    ->middleware(['auth:web', 'private-cache'])
    ->name('logout');
Route::post('/auth/login', [LoginController::class, 'store'])
    ->name('login.authenticate');
Route::post('/register', [RegistrationController::class, 'store'])->name('register.store');
Route::get('/email/verify-registration', function (Request $request) {
    return Inertia::render('auth/verify-email', [
        'email' => $request->query('email'),
        'registration' => $request->query('registration'),
        'status' => $request->session()->get('status'),
        'verified' => false,
    ]);
})->name('registration.notice');
Route::post('/email/verify-registration/resend', [RegistrationController::class, 'resend'])
    ->middleware('throttle:6,1')
    ->name('registration.resend');
Route::get('/email/verify-registration/confirm', [RegistrationController::class, 'verify'])
    ->middleware('signed')
    ->name('registration.verify');

Route::get('/email/verify', function (Request $request) {
    $user = $request->user();

    if ($user->hasVerifiedEmail()) {
        return redirect(config('fortify.home'));
    }

    return Inertia::render('auth/verify-email', [
        'email' => $user->email,
        'status' => $request->session()->get('status'),
        'verified' => false,
    ]);
})
    ->middleware('auth')
    ->name('verification.notice');
