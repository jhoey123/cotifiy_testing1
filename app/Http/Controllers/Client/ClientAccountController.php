<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\Message;
use App\Models\StaffUser;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ClientAccountController extends Controller
{
    public function profile(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        return Inertia::render('client/clientprofile', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $user->studentId,
                'course' => $user->course,
                'year_level' => $user->year_level,
                'profile_photo_url' => $user->profile_photo_path
                    ? Storage::disk('public')->url($user->profile_photo_path)
                    : null,
                'created_at' => $user->created_at?->toDateString() ?? '',
            ],
            'stats' => [
                'comments' => Message::query()->where('sender_id', $user->id)->count(),
                'saved' => 0,
            ],
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $request->merge([
            'email' => strtolower((string) $request->input('email')),
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user),
                Rule::unique(AdminUser::class),
                Rule::unique(StaffUser::class),
            ],
            'student_id' => ['nullable', 'string', 'max:255'],
            'course' => ['required', 'string', Rule::in(['BSIT', 'BSCS', 'BSIS', 'ACT'])],
            'year_level' => ['required', 'string', Rule::in(['1st Year', '2nd Year', '3rd Year', '4th Year'])],
        ]);

        $emailChanged = $user->email !== $validated['email'];
        $user->forceFill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'studentId' => $validated['student_id'] ?? null,
            'course' => $validated['course'],
            'year_level' => $validated['year_level'],
            'email_verified_at' => $emailChanged ? null : $user->email_verified_at,
        ])->save();

        if ($emailChanged) {
            $user->sendEmailVerificationNotification();
        }

        return back();
    }

    public function updateProfilePhoto(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $validated = $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $oldPhotoPath = $user->profile_photo_path;
        $photoPath = $validated['photo']->store('profile-photos', 'public');

        $user->forceFill([
            'profile_photo_path' => $photoPath,
        ])->save();

        if ($oldPhotoPath !== null && ! Storage::disk('public')->delete($oldPhotoPath)) {
            throw new \RuntimeException('Unable to remove the previous profile photo.');
        }

        return back();
    }

    public function sendPasswordResetLink(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $status = Password::broker()->sendResetLink([
            'email' => $user->email,
        ]);

        if ($status !== Password::RESET_LINK_SENT) {
            return back()->withErrors([
                'password_reset' => __($status),
            ]);
        }

        return back()->with('status', __('A password reset link has been sent to your email address.'));
    }

    public function settings(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('client/clientsetting', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function notifications(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $notifications = $user->notifications()
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn (DatabaseNotification $notification) => [
                'id' => $notification->id,
                'title' => $notification->data['title'] ?? 'Notification',
                'message' => $notification->data['message'] ?? '',
                'office' => $notification->data['office'] ?? '',
                'time_ago' => $notification->created_at?->diffForHumans() ?? '',
                'is_read' => $notification->read_at !== null,
                'link' => $notification->data['link'] ?? route('client.announcements.index'),
                'type' => $notification->data['type'] ?? 'general',
                'created_at' => $notification->created_at?->toIso8601String(),
            ]);

        return Inertia::render('client/clientnotif', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotifications()->count(),
        ]);
    }

    public function markNotificationRead(Request $request, string $notification): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->notifications()->whereKey($notification)->firstOrFail()->markAsRead();

        return back();
    }

    public function markAllNotificationsRead(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->unreadNotifications()->update(['read_at' => now()]);

        return back();
    }
}
