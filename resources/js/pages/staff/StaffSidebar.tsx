import { Form, Link } from '@inertiajs/react';
import { useState } from 'react';

type StaffPage = 'dashboard' | 'announcements' | 'events' | 'settings';

interface StaffSidebarProps {
    activePage: StaffPage;
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
}

const activeLinkClass =
    'bg-ctu-lightblue text-white font-bold shadow-md shadow-blue-900/30';
const inactiveLinkClass =
    'text-slate-400 hover:bg-slate-800 hover:text-white';
const linkClass =
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ctu-dark';

export default function StaffSidebar({
    activePage,
    isOpen,
    onClose,
    userName = 'J. Cruz',
}: StaffSidebarProps) {
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);

    const navigation = [
        { page: 'dashboard' as const, label: 'Dashboard', href: '/staff', icon: 'fa-solid fa-house' },
        { page: 'announcements' as const, label: 'Announcements', href: '/staff/announcements', icon: 'fa-solid fa-bullhorn' },
        { page: 'events' as const, label: 'Events', href: '/staff/events', icon: 'fa-regular fa-calendar' },
    ];

    return (
        <>
            <aside
                className={`absolute z-40 flex h-full w-64 shrink-0 flex-col justify-between bg-ctu-dark shadow-2xl transition-transform duration-300 md:relative ${
                    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div className="no-scrollbar w-64 flex-1 overflow-y-auto">
                    <div className="flex items-center p-6">
                        <img
                            src="/images/3rdLogo.png"
                            alt="Cotify Logo"
                            className="-mr-4 -ml-2 h-16 w-16 object-contain"
                        />
                        <div className="text-white">
                            <h1 className="text-xl leading-tight font-extrabold tracking-tight">Cotify</h1>
                            <p className="mt-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                Staff Portal
                            </p>
                        </div>
                    </div>

                    <nav className="mt-2 space-y-6 px-3" aria-label="Staff navigation">
                        <div>
                            <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Main
                            </p>
                            {navigation.map(({ page, label, href, icon }) => (
                                <Link
                                    key={page}
                                    href={href}
                                    onClick={onClose}
                                    aria-current={activePage === page ? 'page' : undefined}
                                    className={`${linkClass} ${page === 'dashboard' ? '' : 'mt-1'} ${
                                        activePage === page ? activeLinkClass : inactiveLinkClass
                                    }`}
                                >
                                    <i className={`${icon} w-5 text-center group-hover:scale-110 transition-transform`} aria-hidden="true" />
                                    {label}
                                </Link>
                            ))}
                        </div>

                        <div>
                            <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Account
                            </p>
                            <Link
                                href="/staff/settings"
                                prefetch="mount"
                                onClick={onClose}
                                aria-current={activePage === 'settings' ? 'page' : undefined}
                                className={`${linkClass} ${
                                    activePage === 'settings' ? activeLinkClass : inactiveLinkClass
                                }`}
                            >
                                <i className="fa-solid fa-gear w-5 text-center transition-transform duration-300 group-hover:rotate-90" aria-hidden="true" />
                                Settings
                            </Link>
                        </div>
                    </nav>
                </div>

                <div className="w-64 border-t border-slate-800/50 p-4">
                    <div className="mb-2 flex items-center gap-3 px-3 py-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm text-slate-300 ring-2 ring-slate-700">
                            <i className="fa-solid fa-user" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{userName}</p>
                            <p className="text-[11px] font-medium text-slate-400">Registrar&apos;s Office</p>
                        </div>
                    </div>
                    <Form method="post" action="/staff/logout">
                        {({ processing }) => (
                            <button
                                type="submit"
                                disabled={processing}
                                onMouseEnter={() => setIsLogoutHovered(true)}
                                onMouseLeave={() => setIsLogoutHovered(false)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ctu-dark disabled:opacity-60 ${
                                    isLogoutHovered
                                        ? 'bg-red-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <i
                                    className={`fa-solid fa-arrow-right-from-bracket w-5 text-center transition-colors ${
                                        isLogoutHovered ? 'text-white' : 'text-slate-400'
                                    }`}
                                    aria-hidden="true"
                                />
                                {processing ? 'Logging Out...' : 'Log Out'}
                            </button>
                        )}
                    </Form>
                </div>
            </aside>

            {isOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    className="animate-fade-in fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
}
