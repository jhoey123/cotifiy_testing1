import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Announcement {
    id: number;
    title: string;
    category: 'Academic' | 'Event' | 'General' | 'Service';
    posted_by_office: string;
    date: string;
    content: string;
    image: string | null;
    event_date: string | null;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
}

interface ClientHomeProps {
    announcements?: Announcement[];
    upcomingEvents?: Announcement[];
    unreadCount?: number;
    isLoading?: boolean;
    hasError?: boolean;
    user?: {
        name: string;
        course: string;
        year_level: string;
    };
}

export default function ClientHome({
    announcements = [],
    upcomingEvents = [],
    unreadCount = 0,
    isLoading = false,
    hasError = false,
    user = { name: 'Juan', course: 'BSIT', year_level: '3rd Year' },
}: ClientHomeProps) {
    const { auth } = usePage<any>().props;
    const userName = auth?.user?.name || user.name;

    const [activeFilter, setActiveFilter] = useState<
        'all' | 'Academic' | 'Event' | 'General' | 'Service'
    >('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [newAnnouncementCount, setNewAnnouncementCount] = useState(0);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const knownAnnouncementIds = useRef(new Set(announcements.map(({ id }) => id)));

    useEffect(() => {
        const newAnnouncements = announcements.filter(
            ({ id }) => !knownAnnouncementIds.current.has(id),
        );

        if (newAnnouncements.length > 0) {
            newAnnouncements.forEach(({ id }) => knownAnnouncementIds.current.add(id));
            setNewAnnouncementCount((count) => count + newAnnouncements.length);
        }
    }, [announcements]);

    useEffect(() => {
        const pollForAnnouncements = () => {
            if (document.visibilityState === 'visible') {
                router.reload({
                    only: ['announcements'],
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        };
        const intervalId = window.setInterval(pollForAnnouncements, 30_000);

        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!notificationsOpen) {
            return;
        }

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (
                event.target instanceof Node &&
                !notificationsRef.current?.contains(event.target)
            ) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('pointerdown', closeOnOutsideClick);

        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
        };
    }, [notificationsOpen]);
    
    const filteredAnnouncements = useMemo(() => {
        const query = searchTerm.trim().toLocaleLowerCase();

        return announcements.filter((announcement) => {
            const matchesFilter =
                activeFilter === 'all' ||
                announcement.category === activeFilter;
            const matchesSearch =
                !query ||
                announcement.title.toLocaleLowerCase().includes(query) ||
                announcement.posted_by_office
                    .toLocaleLowerCase()
                    .includes(query);

            return matchesFilter && matchesSearch;
        });
    }, [activeFilter, announcements, searchTerm]);

    const formatDate = (date: string) =>
        new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

    const formatTime = (time: string | null) =>
        time
            ? new Date(`1970-01-01T${time}`).toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit',
              })
            : '';

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'Academic':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Event':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Service':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <>
            <Head title="Home | COTIFY" />

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUpText { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                /* Expanded movement paths to roam the entire viewport */
                @keyframes move-around-1 { 
                    0% { transform: translate(0, 0) rotate(0deg); } 
                    25% { transform: translate(-35vw, 25vh) rotate(25deg); } 
                    50% { transform: translate(-15vw, 50vh) rotate(-15deg); } 
                    75% { transform: translate(25vw, 30vh) rotate(15deg); } 
                    100% { transform: translate(0, 0) rotate(0deg); } 
                }
                @keyframes move-around-2 { 
                    0% { transform: translate(0, 0) rotate(0deg); } 
                    25% { transform: translate(30vw, -30vh) rotate(-25deg); } 
                    50% { transform: translate(-40vw, -20vh) rotate(15deg); } 
                    75% { transform: translate(-25vw, 30vh) rotate(-15deg); } 
                    100% { transform: translate(0, 0) rotate(0deg); } 
                }
                @keyframes move-around-3 { 
                    0% { transform: translate(0, 0) rotate(0deg) scale(1); } 
                    33% { transform: translate(35vw, -40vh) rotate(55deg) scale(1.3); } 
                    66% { transform: translate(-30vw, 25vh) rotate(110deg) scale(0.9); } 
                    100% { transform: translate(0, 0) rotate(0deg) scale(1); } 
                }
                @keyframes move-around-4 {
                    0% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-20vw, 30vh) scale(1.2); }
                    100% { transform: translate(0, 0) scale(1); }
                }

                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                .animate-slide-up { animation: slideUpText 0.5s ease-out forwards; }
                .animate-spin-slow { animation: spin-slow 25s linear infinite; }
                
                .shape-move-1 { animation: move-around-1 35s ease-in-out infinite; }
                .shape-move-2 { animation: move-around-2 45s ease-in-out infinite; }
                .shape-move-3 { animation: move-around-3 40s ease-in-out infinite; }
                .shape-move-4 { animation: move-around-4 30s ease-in-out infinite; }

                .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
                .clip-diamond { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
            `}</style>

            <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased">
                
                {/* ========================================= */}
                {/* BACKGROUND SHAPES (More shapes, higher opacity) */}
                {/* ========================================= */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* 1. Top Left - Large Blue Glow */}
                    <div className="absolute top-[5%] left-[5%] w-[30rem] h-[30rem] bg-blue-500/15 rounded-full blur-3xl shape-move-1"></div>
                    
                    {/* 2. Bottom Right - Large Purple Glow */}
                    <div className="absolute bottom-[5%] right-[5%] w-[35rem] h-[35rem] bg-purple-500/15 rounded-full blur-3xl shape-move-2"></div>
                    
                    {/* 3. Center - Soft Indigo Glow */}
                    <div className="absolute top-[40%] left-[30%] w-[25rem] h-[25rem] bg-indigo-500/10 rounded-full blur-3xl shape-move-3"></div>
                    
                    {/* 4. Top Right - Visible Hexagon */}
                    <div className="absolute top-[10%] right-[15%] w-64 h-64 bg-blue-600/20 clip-hexagon shape-move-3"></div>

                    {/* 5. Bottom Left - Rotating Diamond Ring */}
                    <div className="absolute bottom-[15%] left-[10%] w-48 h-48 border-[6px] border-purple-500/30 clip-diamond animate-spin-slow"></div>

                    {/* 6. Mid Right - Floating Square */}
                    <div className="absolute top-[45%] right-[10%] w-40 h-40 border-[5px] border-blue-500/25 rotate-12 shape-move-1"></div>

                    {/* 7. Bottom Center - Visible Hexagon Ring */}
                    <div className="absolute bottom-[20%] right-[40%] w-56 h-56 border-[8px] border-indigo-500/20 clip-hexagon shape-move-2 bg-transparent">
                        <div className="w-full h-full bg-blue-500/10 clip-hexagon scale-[0.95]"></div>
                    </div>

                    {/* 8. Mid Left - Soft Circle Ring */}
                    <div className="absolute top-[60%] left-[5%] w-32 h-32 border-[4px] border-blue-500/30 rounded-full shape-move-4"></div>

                    {/* 9. Top Center - Solid Indigo Diamond */}
                    <div className="absolute top-[20%] left-[40%] w-24 h-24 bg-indigo-600/15 clip-diamond shape-move-4"></div>
                </div>

                <header className="bg-ctu-dark/95 relative z-50 border-b border-white/10 shadow-lg backdrop-blur-xl">
                    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
                            <div className="flex items-center gap-8">
                                <Link
                                    href="/client"
                                    className="flex shrink-0 items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
                                    aria-label="Cotify Home"
                                >
                                   <img
                                        src="/images/3rdLogo.png"
                                        alt="Cotify Logo"
                                           className="w-20 h-20 sm:w-28 sm:h-28 object-contain -ml-4 sm:-ml-6 -mr-6 sm:-mr-8" 
                                    />
                                    <div className="hidden sm:block">
                                        <span className="text-xl font-extrabold text-white leading-tight block">
                                            Cotify
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                            College of Technology
                                        </span>
                                    </div>
                                </Link>

                                <nav className="hidden items-center gap-6 md:flex">
                                    <Link
                                        href="/client"
                                        className="border-ctu-lightblue border-b-2 pb-1 text-sm font-bold text-white"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/client/announcements"
                                        className="text-sm font-semibold text-slate-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                                    >
                                        Announcements
                                    </Link>
                                    <Link
                                        href="/client/events"
                                        className="text-sm font-semibold text-slate-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                                    >
                                        Events
                                    </Link>
                                    <Link
                                        href="/client/saved"
                                        className="text-sm font-semibold text-slate-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                                    >
                                        Saved
                                    </Link>
                                </nav>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="relative hidden sm:block">
                                    <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true"></i>
                                    <input
                                        type="text"
                                        placeholder="Search announcements..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="focus:ring-ctu-lightblue w-64 rounded-lg border border-slate-700 bg-slate-800/50 py-2 pr-4 pl-9 text-sm text-white placeholder-slate-400 transition-all outline-none focus:ring-2"
                                        aria-label="Search announcements"
                                    />
                                </div>

                                <div ref={notificationsRef} className="relative">
                                    <button
                                        type="button"
                                        className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        aria-label={`Notifications${newAnnouncementCount > 0 ? `, ${newAnnouncementCount} new announcements` : ''}`}
                                        aria-expanded={notificationsOpen}
                                        aria-controls="recent-announcements-menu"
                                        onClick={() => {
                                            const willOpen = !notificationsOpen;
                                            setNotificationsOpen(willOpen);

                                            if (willOpen) {
                                                setNewAnnouncementCount(0);
                                            }
                                        }}
                                    >
                                        <i className="fa-regular fa-bell text-xl" aria-hidden="true"></i>
                                        {newAnnouncementCount > 0 && (
                                            <span
                                                aria-live="polite"
                                                className="border-ctu-dark absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 bg-red-500 px-1 text-[10px] font-bold text-white"
                                            >
                                                {newAnnouncementCount > 99 ? '99+' : newAnnouncementCount}
                                            </span>
                                        )}
                                    </button>

                                    {notificationsOpen && (
                                        <div
                                            id="recent-announcements-menu"
                                            role="region"
                                            aria-label="Recent announcements"
                                            className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-xl"
                                        >
                                            <div className="border-b border-slate-100 px-4 py-3">
                                                <h2 className="text-sm font-extrabold text-slate-900">
                                                    Recent announcements
                                                </h2>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {announcements.slice(0, 5).map((announcement) => (
                                                    <Link
                                                        key={announcement.id}
                                                        href={`/client/announcements/${announcement.id}`}
                                                        onClick={() => setNotificationsOpen(false)}
                                                        className="block border-b border-slate-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                                                    >
                                                        <span className="flex items-center justify-between gap-3">
                                                            <span className="truncate text-sm font-bold text-slate-800">
                                                                {announcement.title}
                                                            </span>
                                                            <span className="shrink-0 text-[11px] font-medium text-slate-400">
                                                                {formatDate(announcement.date)}
                                                            </span>
                                                        </span>
                                                        <span className="mt-1 block text-xs text-slate-500">
                                                            {announcement.category} · {announcement.posted_by_office}
                                                        </span>
                                                    </Link>
                                                ))}
                                                {announcements.length === 0 && (
                                                    <p className="px-4 py-6 text-center text-sm text-slate-500">
                                                        No announcements have been posted yet.
                                                    </p>
                                                )}
                                            </div>
                                            <Link
                                                href="/client/announcements"
                                                onClick={() => setNotificationsOpen(false)}
                                                className="block border-t border-slate-100 px-4 py-3 text-center text-xs font-bold text-blue-600 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                                            >
                                                View all announcements
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <Link 
                                    href="/client/profile"
                                    className="group flex cursor-pointer items-center gap-2 border-l border-slate-700 pl-2 sm:pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-lg p-1"
                                    aria-label="Profile settings"
                                >
                                    <div className="bg-ctu-lightblue flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white">
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

                <main className="relative z-10 mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8 animate-slide-up">
                        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                            Good morning, {userName.split(' ')[0]}
                        </h1>
                        <p className="mt-2 text-base text-slate-500 leading-relaxed">
                            {user.course || 'Course not set'} · {user.year_level || 'Year level not set'} ·{' '}
                            <span className="text-blue-600 font-bold">
                                {unreadCount} new announcements
                            </span>{' '}
                            since your last visit · 1 event this week
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        <div className="space-y-6 lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2">
                                    {[
                                        'all',
                                        'Academic',
                                        'Event',
                                        'General',
                                        'Service',
                                    ].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() =>
                                                setActiveFilter(tab as any)
                                            }
                                            className={`rounded-full border px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                activeFilter === tab
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {tab === 'all'
                                                ? 'All'
                                                : tab === 'Event'
                                                  ? 'Events'
                                                  : tab}
                                        </button>
                                    ))}
                                </div>
                                <div className="shrink-0 text-xs font-semibold text-slate-500">
                                    Sort: Newest{' '}
                                    <i className="fa-solid fa-chevron-down ml-1 text-[10px]" aria-hidden="true"></i>
                                </div>
                            </div>

                            {isLoading && (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                                        >
                                            <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-200"></div>
                                            <div className="flex-1 space-y-3 py-1">
                                                <div className="h-4 w-1/4 rounded bg-slate-200"></div>
                                                <div className="h-5 w-3/4 rounded bg-slate-200"></div>
                                                <div className="h-4 w-full rounded bg-slate-200"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {hasError && !isLoading && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                                    <h3 className="text-lg font-bold text-red-800">
                                        Unable to load announcements
                                    </h3>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            {!isLoading && !hasError && (
                                <div className="space-y-4">
                                    {filteredAnnouncements.map((ann) => (
                                        <div
                                            key={ann.id}
                                            className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                                                {ann.image ? (
                                                    <img
                                                        src={ann.image}
                                                        alt={`Thumbnail for ${ann.title}`}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <i className="fa-regular fa-newspaper text-3xl text-slate-300" aria-hidden="true"></i>
                                                )}
                                            </div>

                                            <div className="flex min-w-0 flex-1 flex-col justify-between">
                                                <div>
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <span
                                                            className={`rounded px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest uppercase border ${getCategoryColor(ann.category)}`}
                                                        >
                                                            {ann.category === 'Event'
                                                                ? 'Events'
                                                                : ann.category === 'Academic'
                                                                  ? 'Academic'
                                                                  : ann.category === 'Service'
                                                                    ? 'Services'
                                                                    : 'General'}
                                                        </span>
                                                        <span className="text-xs font-semibold text-slate-500">
                                                            {formatDate(ann.date)}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">
                                                        <Link href={`/client/announcements/${ann.id}`} className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                                                            {ann.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="line-clamp-1 text-sm text-slate-500">
                                                        {ann.content}
                                                    </p>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-400">
                                                            <i className="fa-solid fa-building" aria-hidden="true"></i>
                                                        </div>
                                                        {ann.posted_by_office}
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <Link
                                                            href={`/client/announcements/${ann.id}`}
                                                            className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            Read more
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {filteredAnnouncements.length === 0 && (
                                        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                                                <i className="fa-regular fa-folder-open text-2xl text-slate-300" aria-hidden="true"></i>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">
                                                No updates found
                                            </h3>
                                        </div>
                                    )}

                                    {announcements.length === 10 && (
                                        <div className="pt-4 text-center">
                                            <Link
                                                href="/client/announcements"
                                                className="inline-flex rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                View all announcements
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <aside className="space-y-6 lg:col-span-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                    <h3 className="text-sm font-extrabold text-slate-900">
                                        Upcoming events
                                    </h3>
                                    <Link
                                        href="/client/events"
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                    >
                                        View all
                                    </Link>
                                </div>

                                <div className="space-y-5 p-5">
                                    {upcomingEvents.map((event) => (
                                        <div key={event.id} className="flex gap-3">
                                            <div className="h-fit min-w-[50px] shrink-0 rounded-lg bg-slate-100 p-2 text-center">
                                                <p className="text-[9px] font-extrabold text-slate-500 uppercase" aria-hidden="true">
                                                    {new Date(`${event.event_date}T00:00:00`).toLocaleDateString(undefined, { month: 'short' })}
                                                </p>
                                                <p className="mt-0.5 text-lg leading-none font-black text-slate-800">
                                                    {new Date(`${event.event_date}T00:00:00`).getDate()}
                                                </p>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="mb-1 line-clamp-1 text-sm leading-tight font-bold text-slate-900">
                                                    {event.title}
                                                </h4>
                                                <p className="text-[11px] font-semibold text-slate-500">
                                                    {formatTime(event.start_time)} · {event.location}
                                                </p>
                                                <Link
                                                    href={`/client/announcements/${event.id}`}
                                                    className="mt-2 inline-flex text-xs font-bold text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                                >
                                                    View event details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                    {upcomingEvents.length === 0 && (
                                        <p className="py-4 text-center text-sm font-medium text-slate-500">
                                            No upcoming events.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>

                <footer className="bg-ctu-dark relative z-10 mt-auto border-t border-slate-800 py-6 text-white">
                    <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-slate-400">
                                &copy; 2026 Cotify · College of Technology
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                            <a href="#" className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">About</a>
                            <span>·</span>
                            <a href="#" className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">Contact</a>
                            <span>·</span>
                            <a href="#" className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">Privacy</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}