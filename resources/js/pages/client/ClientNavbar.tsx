import { Link, usePage } from '@inertiajs/react';
import ClientNotificationDropdown from './ClientNotificationDropdown';

type ClientNavPage = 'home' | 'announcements' | 'events' | 'saved' | 'settings';

interface ClientNavbarProps {
    activePage: ClientNavPage;
    fixed?: boolean;
    search?: {
        value: string;
        onChange: (value: string) => void;
        placeholder: string;
        label: string;
        type?: 'search' | 'text';
    };
}

export default function ClientNavbar({
    activePage,
    fixed = false,
    search,
}: ClientNavbarProps) {
    const { auth } = usePage<{ auth?: { user?: { name?: string } } }>().props;
    const userName = auth?.user?.name ?? 'Student';
    const links: Array<{ label: string; href: string; page: ClientNavPage }> = [
        { label: 'Home', href: '/client', page: 'home' },
        {
            label: 'Announcements',
            href: '/client/announcements',
            page: 'announcements',
        },
        { label: 'Events', href: '/client/events', page: 'events' },
        { label: 'Saved', href: '/client/saved', page: 'saved' },
    ];

    return (
        <header
            className={`${fixed ? 'fixed top-0 right-0 left-0' : 'relative'} bg-ctu-dark/95 z-50 border-b border-white/10 shadow-lg backdrop-blur-xl`}
        >
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
                    <div className="flex items-center gap-8">
                        <Link
                            href="/client"
                            aria-label="Cotify Home"
                            className="group flex shrink-0 items-center rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <img
                                src="/images/3rdLogo.png"
                                alt="Cotify Logo"
                                className="-mr-6 -ml-4 h-20 w-20 object-contain sm:-mr-8 sm:-ml-6 sm:h-28 sm:w-28"
                            />
                            <div className="hidden sm:block">
                                <span className="block text-xl leading-tight font-extrabold text-white">
                                    Cotify
                                </span>
                                <span className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                    College of Technology
                                </span>
                            </div>
                        </Link>

                        <nav
                            aria-label="Client navigation"
                            className="hidden items-center gap-6 md:flex"
                        >
                            {links.map(({ label, href, page }) => (
                                <Link
                                    key={page}
                                    href={href}
                                    aria-current={
                                        activePage === page ? 'page' : undefined
                                    }
                                    className={
                                        activePage === page
                                            ? 'border-ctu-lightblue rounded-t-md border-b-2 px-1 py-1 text-sm font-bold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                            : 'rounded-md px-1 py-1 text-sm font-semibold text-slate-400 transition-colors hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                    }
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {search && (
                            <div className="relative hidden sm:block">
                                <i
                                    className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400"
                                    aria-hidden="true"
                                />
                                <input
                                    type={search.type ?? 'text'}
                                    value={search.value}
                                    onChange={(event) =>
                                        search.onChange(event.target.value)
                                    }
                                    placeholder={search.placeholder}
                                    aria-label={search.label}
                                    className="focus:ring-ctu-lightblue w-64 rounded-lg border border-slate-700 bg-slate-800/50 py-2 pr-4 pl-9 text-sm text-white placeholder-slate-400 transition-all outline-none focus:ring-2"
                                />
                            </div>
                        )}

                        <ClientNotificationDropdown />

                        <Link
                            href="/client/profile"
                            aria-label="Profile settings"
                            aria-current={
                                activePage === 'settings' ? 'page' : undefined
                            }
                            className="group flex cursor-pointer items-center gap-2 rounded-md border-l border-slate-700 pl-2 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:pl-4"
                        >
                            <div className="bg-ctu-lightblue flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-transparent transition-all group-hover:ring-white/20">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <span className="hidden text-sm font-semibold text-white lg:block">
                                {userName.split(' ')[0]} D.
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
