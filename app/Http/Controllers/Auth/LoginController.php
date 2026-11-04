<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\StaffUser;
use App\Models\User;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);

        $email = Str::lower($credentials['email']);
        $throttleKey = Str::transliterate($email.'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $retryAfter = RateLimiter::availableIn($throttleKey);

            throw new ThrottleRequestsException(
                "Too many login attempts. Please try again in {$retryAfter} seconds.",
                null,
                ['Retry-After' => (string) $retryAfter],
            );
        }

        $admin = AdminUser::query()->where('email', $email)->first();

        if ($admin) {
            if (! Hash::check($credentials['password'], $admin->password)) {
                $this->rejectLogin($throttleKey);
            }

            RateLimiter::clear($throttleKey);
            Auth::guard('web')->logout();
            Auth::guard('staff')->logout();
            Auth::guard('admin')->login($admin, $request->boolean('remember'));
            $request->session()->regenerate();

            return redirect()->route('admin');
        }

        $staff = StaffUser::query()->where('email', $email)->first();

        if ($staff) {
            if (! Hash::check($credentials['password'], $staff->password)) {
                $this->rejectLogin($throttleKey);
            }

            RateLimiter::clear($throttleKey);
            Auth::guard('web')->logout();
            Auth::guard('admin')->logout();
            Auth::guard('staff')->login($staff, $request->boolean('remember'));
            $request->session()->regenerate();

            return redirect()->route('staff');
        }

        $user = User::query()->where('email', $email)->first();
        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            $this->rejectLogin($throttleKey);
        }

        RateLimiter::clear($throttleKey);
        Auth::guard('admin')->logout();
        Auth::guard('staff')->logout();
        Auth::guard('web')->login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->route('client.clientpage');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('admin')->logout();
        Auth::guard('staff')->logout();
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('login');
    }

    private function rejectLogin(string $throttleKey): never
    {
        RateLimiter::hit($throttleKey, 60);

        throw ValidationException::withMessages([
            'email' => [trans('auth.failed')],
        ]);
    }
}
