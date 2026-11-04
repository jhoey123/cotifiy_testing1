<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\Message;
use App\Models\StaffUser;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
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

    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string', 'current_password:web'],
            'password' => ['required', 'string', Password::default(), 'confirmed'],
        ], [
            'current_password.current_password' => __('The provided password does not match your current password.'),
        ]);

        $request->user()->forceFill([
            'password' => Hash::make($validated['password']),
        ])->save();

        return back();
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

    public function notifications(): Response
    {
        return Inertia::render('client/clientnotif', [
            'notifications' => [],
        ]);
    }
}
