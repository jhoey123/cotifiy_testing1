<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     *
     * @throws ValidationException
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'studentId' => ['required', 'string', 'max:255'],
            'course' => ['required', 'string', Rule::in(['BSIT', 'BSCS', 'BSIS', 'ACT'])],
            'year_level' => ['required', 'string', Rule::in(['1st Year', '2nd Year', '3rd Year', '4th Year'])],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'studentId' => $input['studentId'],
            'course' => $input['course'],
            'year_level' => $input['year_level'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);
    }
}
