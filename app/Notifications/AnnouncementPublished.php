<?php

namespace App\Notifications;

use App\Models\Announcement;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AnnouncementPublished extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Announcement $announcement,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New announcement: '.$this->announcement->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('A new '.$this->announcement->category.' announcement has been posted.')
            ->line($this->announcement->title)
            ->line($this->announcement->body)
            ->action('Read announcement', route('client.announcements.show', $this->announcement))
            ->line('Posted by '.$this->announcement->posted_by.'.');
    }
}
