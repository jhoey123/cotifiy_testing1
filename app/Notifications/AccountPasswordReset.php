<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;

class AccountPasswordReset extends ResetPassword
{
    protected function resetUrl($notifiable): string
    {
        return route('client.password.reset.form', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ]);
    }
}
