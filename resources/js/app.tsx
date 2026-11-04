import { createInertiaApp } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

if (typeof window !== 'undefined') {
    let isRevalidatingProtectedPage = false;
    const isProtectedPage = () =>
        /^\/(?:admin|client)(?:\/|$)/.test(window.location.pathname);
    const hideProtectedPage = () => {
        if (isProtectedPage())
            document.documentElement.style.visibility = 'hidden';
    };
    const revalidateProtectedPage = () => {
        if (!isRevalidatingProtectedPage && isProtectedPage()) {
            isRevalidatingProtectedPage = true;
            hideProtectedPage();
            window.location.reload();
        }
    };

    window.addEventListener('pagehide', hideProtectedPage);
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) revalidateProtectedPage();
    });
    window.addEventListener('popstate', revalidateProtectedPage);
}

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
});
