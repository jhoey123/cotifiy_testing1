<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\StaffUser;
use App\Models\User;
use App\Notifications\VerifyPendingRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use JsonException;

class RegistrationController extends Controller
{
    private const COURSES = ['BSIT', 'BSCS', 'BSIS', 'ACT'];

    private const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

    public function store(Request $request): RedirectResponse
    {
        $request->merge([
            'email' => Str::lower((string) $request->input('email')),
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'studentId' => ['required', 'string', 'max:255'],
            'course' => ['required', 'string', Rule::in(self::COURSES)],
            'year_level' => ['required', 'string', Rule::in(self::YEAR_LEVELS)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class), Rule::unique(AdminUser::class), Rule::unique(StaffUser::class)],
            'password' => ['required', 'string', Password::default(), 'confirmed'],
        ]);

        $pendingRegistration = [
            'name' => $validated['name'],
            'studentId' => $validated['studentId'],
            'course' => $validated['course'],
            'year_level' => $validated['year_level'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ];

        $registration = Crypt::encryptString(json_encode($pendingRegistration, JSON_THROW_ON_ERROR));
        $verificationUrl = $this->verificationUrl($registration);

        Notification::route('mail', $pendingRegistration['email'])
            ->notify(new VerifyPendingRegistration($verificationUrl));

        return to_route('registration.notice', [
            'email' => $pendingRegistration['email'],
            'registration' => $registration,
        ]);
    }

    public function resend(Request $request): RedirectResponse
    {
        $validatedRequest = $request->validate([
            'registration' => ['required', 'string'],
        ]);

        $pendingRegistration = json_decode(
            Crypt::decryptString($validatedRequest['registration']),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        $validated = Validator::make($pendingRegistration, [
            'name' => ['required', 'string', 'max:255'],
            'studentId' => ['required', 'string', 'max:255'],
            'course' => ['required', 'string', Rule::in(self::COURSES)],
            'year_level' => ['required', 'string', Rule::in(self::YEAR_LEVELS)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class), Rule::unique(AdminUser::class), Rule::unique(StaffUser::class)],
            'password' => ['required', 'string'],
        ])->validate();

        Notification::route('mail', $validated['email'])
            ->notify(new VerifyPendingRegistration($this->verificationUrl($validatedRequest['registration'])));

        return to_route('registration.notice', [
            'email' => $validated['email'],
            'registration' => $validatedRequest['registration'],
        ])->with('status', 'verification-link-sent');
    }

    /**
     * @throws JsonException
     */
    public function verify(Request $request): Response
    {
        $pendingRegistration = json_decode(
            Crypt::decryptString((string) $request->query('data')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        $validated = Validator::make($pendingRegistration, [
            'name' => ['required', 'string', 'max:255'],
            'studentId' => ['required', 'string', 'max:255'],
            'course' => ['required', 'string', Rule::in(self::COURSES)],
            'year_level' => ['required', 'string', Rule::in(self::YEAR_LEVELS)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class), Rule::unique(AdminUser::class), Rule::unique(StaffUser::class)],
            'password' => ['required', 'string'],
        ])->validate();

        $user = new User($validated);
        $user->forceFill(['email_verified_at' => now()])->save();

        return Inertia::render('auth/verify-email', [
            'verified' => true,
        ]);
    }

    private function verificationUrl(string $registration): string
    {
        return URL::temporarySignedRoute(
            'registration.verify',
            now()->addHour(),
            ['data' => $registration],
        );
    }
}
