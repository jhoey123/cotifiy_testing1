<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/settings');
    }

    public function staffIndex(Request $request): Response
    {
        return Inertia::render('admin/settings', [
            'staffMode' => true,
            'staffName' => $request->user('staff')->name,
        ]);
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string', 'current_password:admin'],
            'password' => ['required', 'string', Password::default(), 'confirmed'],
        ], [
            'current_password.current_password' => __('The provided password does not match your current password.'),
        ]);

        $request->user('admin')->forceFill([
            'password' => Hash::make($validated['password']),
        ])->save();

        return back();
    }

    public function updateStaffPassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string', 'current_password:staff'],
            'password' => ['required', 'string', Password::default(), 'confirmed'],
        ], [
            'current_password.current_password' => __('The provided password does not match your current password.'),
        ]);

        $request->user('staff')->forceFill([
            'password' => Hash::make($validated['password']),
        ])->save();

        return back();
    }
}
