import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type RecentNotification = {
    id: string;
    title: string;
    message: string;
    office: string;
    is_read: boolean;
    link: string;
    created_at: string | null;
};

type SharedProps = {
    unreadCount?: number;
    recentNotifications?: RecentNotification[];
};

export default function ClientNotificationDropdown() {
    const { unreadCount = 0, recentNotifications = [] } = usePage<SharedProps>().props;
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('pointerdown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [isOpen]);

    const openNotification = (notification: RecentNotification) => {
        setIsOpen(false);

        if (notification.is_read) {
            router.visit(notification.link);
            return;
        }

        router.post(`/client/notifications/${notification.id}/read`, {}, {
            preserveScroll: true,
            showProgress: false,
            onSuccess: () => router.visit(notification.link),
        });
    };

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                aria-label={`View notifications. ${unreadCount} unread.`}
                aria-expanded={isOpen}
                aria-controls="client-notification-menu"
                onClick={() => {
                    const shouldOpen = !isOpen;
                    setIsOpen(shouldOpen);
                    if (shouldOpen) {
                        router.reload({
                            only: ['recentNotifications', 'unreadCount'],
                            showProgress: false,
                        });
                    }
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <i className="fa-regular fa-bell text-xl" aria-hidden="true"></i>
                {unreadCount > 0 && (
                    <span className="border-ctu-dark absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    id="client-notification-menu"
                    role="region"
                    aria-label="Recent notifications"
                    className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-xl"
                >
                    <div className="border-b border-slate-100 px-4 py-3">
                        <h2 className="text-sm font-extrabold text-slate-900">Recent notifications</h2>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {recentNotifications.map((notification) => (
                            <button
                                key={notification.id}
                                type="button"
                                onClick={() => openNotification(notification)}
                                className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50 ${
                                    notification.is_read ? 'bg-white' : 'bg-blue-50/50'
                                }`}
                            >
                                <span className="block truncate text-sm font-bold text-slate-800">{notification.title}</span>
                                <span className="mt-1 block line-clamp-2 text-xs text-slate-500">{notification.message}</span>
                                <span className="mt-1 block text-[11px] font-medium text-slate-400">{notification.office}</span>
                            </button>
                        ))}
                        {recentNotifications.length === 0 && (
                            <p className="px-4 py-6 text-center text-sm text-slate-500">No notifications yet.</p>
                        )}
                    </div>
                    <Link
                        href="/client/notifications"
                        onClick={() => setIsOpen(false)}
                        className="block border-t border-slate-100 px-4 py-3 text-center text-xs font-bold text-ctu-lightblue hover:bg-slate-50"
                    >
                        View all notifications
                    </Link>
                </div>
            )}
        </div>
    );
}
