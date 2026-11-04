<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/users', [
            'users' => User::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'studentId', 'course', 'year_level', 'created_at']),
            'adminUsers' => AdminUser::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'created_at']),
        ]);
    }

    public function staff(): Response
    {
        return Inertia::render('admin/adminstaff', [
            'adminUsers' => AdminUser::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'created_at']),
        ]);
    }

    public function storeAdmin(Request $request): RedirectResponse
    {
        $request->merge([
            'email' => Str::lower((string) $request->input('email')),
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
                Rule::unique(AdminUser::class),
            ],
            'password' => ['required', 'string', Password::default(), 'confirmed'],
        ]);

        AdminUser::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        return back();
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $request->merge([
            'email' => Str::lower((string) $request->input('email')),
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'studentId' => ['nullable', 'string', 'max:255'],
            'course' => ['nullable', 'string', 'max:255'],
            'year_level' => ['nullable', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user),
                Rule::unique(AdminUser::class),
            ],
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
        ]);

        $emailChanged = $user->email !== $validated['email'];
        $user->fill(collect($validated)->except(['password'])->all());
        if (! empty($validated['password'])) {
            $user->password = $validated['password'];
        }
        if ($emailChanged) {
            $user->email_verified_at = null;
        }
        $user->save();

        return back();
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return back();
    }
}
