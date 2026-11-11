import { Link, usePage } from '@inertiajs/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type ClientNavPage = 'home' | 'announcements' | 'events' | 'saved' | 'settings';

let isClientSidebarHovered = false;
let isClientSidebarNavigationPending = false;
let lastPointerPosition: { x: number; y: number } | null = null;

function rememberPointerPosition(event: { clientX: number; clientY: number }) {
    lastPointerPosition = { x: event.clientX, y: event.clientY };
}

interface ClientNavbarProps {
    activePage?: ClientNavPage;
}

export default function ClientNavbar({ activePage }: ClientNavbarProps) {
    const { auth } = usePage<{
        auth?: { user?: { name?: string; course?: string | null; profile_photo_url?: string | null } };
    }>().props;
    const userName = auth?.user?.name || 'Student';
    const userCourse = auth?.user?.course || 'Student';
    const [isOpen, setIsOpen] = useState(false);
    const [isHoveredExpanded, setIsHoveredExpanded] = useState(isClientSidebarHovered);
    const collapseTimeout = useRef<number | null>(null);
    const sidebarRef = useRef<HTMLElement>(null);
    const isExpanded = isOpen || isHoveredExpanded;

    useLayoutEffect(() => {
        const sidebarBounds = sidebarRef.current?.getBoundingClientRect();
        const isHovered = Boolean(
            sidebarBounds &&
                lastPointerPosition &&
                lastPointerPosition.x >= sidebarBounds.left &&
                lastPointerPosition.x <= sidebarBounds.right &&
                lastPointerPosition.y >= sidebarBounds.top &&
                lastPointerPosition.y <= sidebarBounds.bottom,
        );
        isClientSidebarHovered = isHovered;
        isClientSidebarNavigationPending = false;
        setIsHoveredExpanded(isHovered);
    }, []);

    useEffect(() => () => {
        if (collapseTimeout.current !== null) {
            window.clearTimeout(collapseTimeout.current);
        }
    }, []);

    const links: Array<{
        label: string;
        href: string;
        page: ClientNavPage;
        icon: string;
    }> = [
        { label: 'Home', href: '/client', page: 'home', icon: 'fa-solid fa-house' },
        {
            label: 'Announcements',
            href: '/client/announcements',
            page: 'announcements',
            icon: 'fa-solid fa-bullhorn',
        },
        { label: 'Events', href: '/client/events', page: 'events', icon: 'fa-regular fa-calendar' },
        { label: 'Saved', href: '/client/saved', page: 'saved', icon: 'fa-regular fa-bookmark' },
    ];

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-expanded={isOpen}
                className="fixed top-5 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 md:hidden"
            >
                <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
            </button>

            <aside
                ref={sidebarRef}
                onMouseEnter={(event) => {
                    rememberPointerPosition(event);
                    if (collapseTimeout.current !== null) {
                        window.clearTimeout(collapseTimeout.current);
                        collapseTimeout.current = null;
                    }
                    isClientSidebarHovered = true;
                    setIsHoveredExpanded(true);
                }}
                onMouseMove={rememberPointerPosition}
                onMouseLeave={(event) => {
                    rememberPointerPosition(event);
                    if (isClientSidebarNavigationPending) {
                        return;
                    }
                    collapseTimeout.current = window.setTimeout(() => {
                        isClientSidebarHovered = false;
                        setIsHoveredExpanded(false);
                        collapseTimeout.current = null;
                    }, 120);
                }}
                className={`bg-ctu-dark absolute z-40 flex h-full shrink-0 flex-col justify-between shadow-2xl transition-[width,transform] duration-300 ease-in-out md:relative
                    ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
                    ${isExpanded ? 'md:w-64' : 'md:w-20'}`}
            >
                <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex h-20 items-center border-b border-slate-800/50">
                        <Link
                            href="/client"
                            aria-label="Cotify Home"
                            className="flex h-full w-full items-center"
                        >
                            <span className="flex h-full w-20 shrink-0 items-center justify-center">
                                <img
                                    src="/images/3rdLogo.png"
                                    alt="Cotify Logo"
                                    className="h-20 w-20 max-w-none object-contain sm:h-28 sm:w-28"
                                />
                            </span>
                            <div className={`flex-none overflow-hidden whitespace-nowrap transition-[width,margin] duration-300 ease-in-out ${isExpanded ? 'ml-2 w-40' : 'ml-0 w-0'}`}>
                                <div className={`text-white transition-opacity duration-150 ${isExpanded ? 'delay-200 opacity-100' : 'opacity-0'}`}>
                                    <h1 className="text-xl leading-tight font-extrabold tracking-tight">Cotify</h1>
                                    <p className="mt-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Student Portal
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <nav className="no-scrollbar mt-4 flex-1 space-y-2 overflow-y-auto overflow-x-hidden px-3" aria-label="Client navigation">
                        {links.map(({ label, href, page, icon }) => (
                            <Link
                                key={page}
                                href={href}
                                onClick={(event) => {
                                    rememberPointerPosition(event);
                                    isClientSidebarNavigationPending = true;
                                    isClientSidebarHovered = true;
                                    setIsHoveredExpanded(true);
                                }}
                                onFinish={() => {
                                    isClientSidebarNavigationPending = false;
                                }}
                                aria-current={activePage === page ? 'page' : undefined}
                                className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                                    activePage === page
                                        ? 'bg-ctu-lightblue text-white shadow-md'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                                title={!isExpanded ? label : undefined}
                            >
                                <i
                                    className={`${icon} w-5 shrink-0 translate-x-1.5 text-center text-lg`}
                                    aria-hidden="true"
                                />
                                <span className={`min-w-0 whitespace-nowrap text-sm font-semibold transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>
                                    {label}
                                </span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="border-t border-slate-800/50 p-4">
                    <Link
                        href="/client/profile"
                        onClick={(event) => {
                            rememberPointerPosition(event);
                            isClientSidebarNavigationPending = true;
                            isClientSidebarHovered = true;
                            setIsHoveredExpanded(true);
                        }}
                        onFinish={() => {
                            isClientSidebarNavigationPending = false;
                        }}
                        aria-current={activePage === 'settings' ? 'page' : undefined}
                        className={`group mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                            activePage === 'settings'
                                ? 'bg-ctu-lightblue text-white shadow-md'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                        title={!isExpanded ? 'Settings' : undefined}
                    >
                        <i
                            className="fa-solid fa-gear w-5 shrink-0 translate-x-0.5 text-center text-lg"
                            aria-hidden="true"
                        />
                        <span className={`min-w-0 whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>
                            Settings
                        </span>
                    </Link>

                    <div className="mb-2 flex items-center gap-3 px-1 py-2">
                        {auth?.user?.profile_photo_url ? (
                            <img
                                src={auth.user.profile_photo_url}
                                alt=""
                                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-transparent"
                            />
                        ) : (
                            <div className="bg-ctu-lightblue flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-transparent">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className={`whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>
                            <p className="max-w-[120px] truncate text-sm font-bold text-white">{userName.split(' ')[0]}</p>
                            <p className="max-w-[120px] truncate text-[11px] font-medium text-slate-400">{userCourse}</p>
                        </div>
                    </div>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-400 transition-colors hover:bg-red-600 hover:text-white"
                        title={!isExpanded ? 'Log Out' : undefined}
                    >
                        <i
                            className="fa-solid fa-arrow-right-from-bracket w-5 shrink-0 translate-x-0.5 text-center text-lg"
                            aria-hidden="true"
                        />
                        <span className={`min-w-0 whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>
                            Log Out
                        </span>
                    </Link>
                </div>
            </aside>

            {isOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    className="animate-fade-in fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
