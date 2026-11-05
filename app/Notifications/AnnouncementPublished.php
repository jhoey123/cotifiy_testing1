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
        return ['database', 'mail'];
    }

    /**
     * @return array{title: string, message: string, office: string, link: string, type: string}
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => $this->announcement->title,
            'message' => 'A new '.$this->announcement->category.' announcement has been posted.',
            'office' => $this->announcement->posted_by,
            'link' => route('client.announcements.show', $this->announcement),
            'type' => strtolower($this->announcement->category),
        ];
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
