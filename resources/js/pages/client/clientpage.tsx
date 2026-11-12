import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import ClientNotificationDropdown from './ClientNotificationDropdown';
import ClientNavbar from './ClientNavbar';

interface Announcement {
    id: number;
    title: string;
    category: 'Academic' | 'Event' | 'General' | 'Service';
    posted_by_office: string;
    date: string;
    content: string;
    content_html: string;
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
    unreadCount = 0, // Defaults to 0, but uses the prop passed from backend
    isLoading = false,
    hasError = false,
    user = { name: 'Juan', course: 'BSIT', year_level: '3rd Year' },
}: ClientHomeProps) {
    const { auth } = usePage<any>().props;
    const userName = auth?.user?.name || user.name;

    const [activeFilter, setActiveFilter] = useState<
        'all' | 'Academic' | 'Event' | 'General' | 'Service'
    >('all');

    useEffect(() => {
        const pollForAnnouncements = () => {
            if (document.visibilityState === 'visible') {
                router.reload({
                    only: ['announcements', 'upcomingEvents', 'unreadCount'],
                    showProgress: false,
                });
            }
        };
        const intervalId = window.setInterval(pollForAnnouncements, 15_000);

        document.addEventListener('visibilitychange', pollForAnnouncements);
        window.addEventListener('focus', pollForAnnouncements);

        return () => {
            window.clearInterval(intervalId);
            document.removeEventListener('visibilitychange', pollForAnnouncements);
            window.removeEventListener('focus', pollForAnnouncements);
        };
    }, []);
    
    const filteredAnnouncements = useMemo(() => {
        return announcements.filter((announcement) => {
            const matchesFilter =
                activeFilter === 'all' ||
                announcement.category === activeFilter;
            return matchesFilter;
        });
    }, [activeFilter, announcements]);

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
                @keyframes popIn { 0% { transform: scale(0); } 80% { transform: scale(1.2); } 100% { transform: scale(1); } }
                
                @keyframes move-around-1 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(-35vw, 25vh) rotate(25deg); } 50% { transform: translate(-15vw, 50vh) rotate(-15deg); } 75% { transform: translate(25vw, 30vh) rotate(15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-2 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(30vw, -30vh) rotate(-25deg); } 50% { transform: translate(-40vw, -20vh) rotate(15deg); } 75% { transform: translate(-25vw, 30vh) rotate(-15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(35vw, -40vh) rotate(55deg) scale(1.3); } 66% { transform: translate(-30vw, 25vh) rotate(110deg) scale(0.9); } 100% { transform: translate(0, 0) rotate(0deg) scale(1); } }
                @keyframes move-around-4 { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-20vw, 30vh) scale(1.2); } 100% { transform: translate(0, 0) scale(1); } }

                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                .animate-slide-up { animation: slideUpText 0.5s ease-out forwards; }
                .animate-spin-slow { animation: spin-slow 25s linear infinite; }
                .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                .shape-move-1 { animation: move-around-1 35s ease-in-out infinite; }
                .shape-move-2 { animation: move-around-2 45s ease-in-out infinite; }
                .shape-move-3 { animation: move-around-3 40s ease-in-out infinite; }
                .shape-move-4 { animation: move-around-4 30s ease-in-out infinite; }

                .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
                .clip-diamond { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
            `}</style>

            <div className="font-sans text-slate-800 bg-slate-50 antialiased h-screen flex overflow-hidden relative">
                
                {/* BACKGROUND SHAPES */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[5%] left-[5%] w-[30rem] h-[30rem] bg-blue-500/15 rounded-full blur-3xl shape-move-1"></div>
                    <div className="absolute bottom-[5%] right-[5%] w-[35rem] h-[35rem] bg-purple-500/15 rounded-full blur-3xl shape-move-2"></div>
                    <div className="absolute top-[40%] left-[30%] w-[25rem] h-[25rem] bg-indigo-500/10 rounded-full blur-3xl shape-move-3"></div>
                    <div className="absolute top-[10%] right-[15%] w-64 h-64 bg-blue-600/20 clip-hexagon shape-move-3"></div>
                    <div className="absolute bottom-[15%] left-[10%] w-48 h-48 border-[6px] border-purple-500/30 clip-diamond animate-spin-slow"></div>
                    <div className="absolute top-[45%] right-[10%] w-40 h-40 border-[5px] border-blue-500/25 rotate-12 shape-move-1"></div>
                    <div className="absolute bottom-[20%] right-[40%] w-56 h-56 border-[8px] border-indigo-500/20 clip-hexagon shape-move-2 bg-transparent">
                        <div className="w-full h-full bg-blue-500/10 clip-hexagon scale-[0.95]"></div>
                    </div>
                </div>

                <ClientNavbar activePage="home" />

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative w-full z-10">
                    
                    {/* TOP BAR */}
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">

                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Home</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            
                            <ClientNotificationDropdown variant="light" />
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="mb-8 animate-slide-up max-w-[1400px] mx-auto">
                            <h1 className="text-3xl font-extrabold text-slate-900">
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

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 max-w-[1400px] mx-auto">
                            <div className="space-y-6 lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                
                                {/* FILTERS ONLY */}
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2">
                                        {['all', 'Academic', 'Event', 'General', 'Service'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveFilter(tab as any)}
                                                className={`rounded-full border px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    activeFilter === tab
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                {tab === 'all' ? 'All' : tab === 'Event' ? 'Events' : tab}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="shrink-0 text-xs font-semibold text-slate-500">
                                        Sort: Newest <i className="fa-solid fa-chevron-down ml-1 text-[10px]" aria-hidden="true"></i>
                                    </div>
                                </div>

                                {isLoading && (
                                    <div className="animate-pulse space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
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
                                        <h3 className="text-lg font-bold text-red-800">Unable to load announcements</h3>
                                        <button onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-500">Retry</button>
                                    </div>
                                )}

                                {!isLoading && !hasError && (
                                    <div className="space-y-4">
                                        {filteredAnnouncements.map((ann) => (
                                            <div
                                                key={ann.id}
                                                role="link"
                                                tabIndex={0}
                                                aria-label={`Read announcement: ${ann.title}`}
                                                className="group relative flex cursor-pointer gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                                                onClick={(event) => {
                                                    if (event.target instanceof Element && event.target.closest('a, button')) {
                                                        return;
                                                    }

                                                    router.visit(`/client/announcements/${ann.id}`);
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.target === event.currentTarget && event.key === 'Enter') {
                                                        event.preventDefault();
                                                        router.visit(`/client/announcements/${ann.id}`);
                                                    }
                                                }}
                                            >
                                                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                                                    {ann.image ? (
                                                        <img src={ann.image} alt={`Thumbnail for ${ann.title}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <i className="fa-regular fa-newspaper text-3xl text-slate-300" aria-hidden="true"></i>
                                                    )}
                                                </div>

                                                <div className="flex min-w-0 flex-1 flex-col justify-between">
                                                    <div>
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <span className={`rounded px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest uppercase border ${getCategoryColor(ann.category)}`}>
                                                                {ann.category === 'Event' ? 'Events' : ann.category === 'Academic' ? 'Academic' : ann.category === 'Service' ? 'Services' : 'General'}
                                                            </span>
                                                            <span className="text-xs font-semibold text-slate-500">{formatDate(ann.date)}</span>
                                                        </div>

                                                        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">
                                                            <Link href={`/client/announcements/${ann.id}`} className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                                                                {ann.title}
                                                            </Link>
                                                        </h3>
                                                        <div dangerouslySetInnerHTML={{ __html: ann.content_html }} className="line-clamp-1 text-sm text-slate-900 [&_a]:text-blue-700 [&_a]:underline [&_a]:[text-shadow:0_0_8px_rgb(59_130_246_/_50%)] [&_p]:mb-0" />
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-400">
                                                                <i className="fa-solid fa-building" aria-hidden="true"></i>
                                                            </div>
                                                            {ann.posted_by_office}
                                                        </div>
                                                        <Link
                                                            href={`/client/announcements/${ann.id}`}
                                                            className="text-xs font-bold text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:hidden"
                                                        >
                                                            Read more
                                                        </Link>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/client/announcements/${ann.id}`}
                                                    aria-label={`Read more: ${ann.title}`}
                                                    className="absolute inset-y-0 right-0 z-10 hidden w-48 translate-x-4 items-center justify-center gap-2 rounded-r-2xl border-y-4 border-r-4 border-l-0 border-transparent [background-clip:padding-box,border-box] [background-image:linear-gradient(to_left,rgba(37,99,235,0.3)_0%,rgba(59,130,246,0.2)_30%,rgba(96,165,250,0.11)_60%,rgba(191,219,254,0.04)_85%,rgba(255,255,255,0)_100%),linear-gradient(to_left,rgba(30,64,175,0.9)_0%,rgba(59,130,246,0.65)_35%,rgba(147,197,253,0.35)_70%,rgba(191,219,254,0.03)_100%)] [background-origin:padding-box,border-box] text-base font-extrabold text-white drop-shadow-[0_1px_3px_rgba(15,23,42,0.9)] opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300 sm:flex"
                                                >
                                                    Read more <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
                                                </Link>
                                            </div>
                                        ))}

                                        {filteredAnnouncements.length === 0 && (
                                            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                                                    <i className="fa-regular fa-folder-open text-2xl text-slate-300" aria-hidden="true"></i>
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-800">No updates found</h3>
                                            </div>
                                        )}

                                        {announcements.length === 10 && (
                                            <div className="pt-4 text-center">
                                                <Link href="/client/announcements" className="inline-flex rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                                        <h3 className="text-sm font-extrabold text-slate-900">Upcoming events</h3>
                                        <Link href="/client/events" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                                            View all
                                        </Link>
                                    </div>

                                    <div className="space-y-5 p-5">
                                        {upcomingEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                role="link"
                                                tabIndex={0}
                                                aria-label={`Read announcement: ${event.title}`}
                                                className="flex cursor-pointer gap-3"
                                                onClick={(clickEvent) => {
                                                    if (clickEvent.target instanceof Element && clickEvent.target.closest('a, button')) {
                                                        return;
                                                    }

                                                    router.visit(`/client/announcements/${event.id}`);
                                                }}
                                                onKeyDown={(keyEvent) => {
                                                    if (keyEvent.target === keyEvent.currentTarget && keyEvent.key === 'Enter') {
                                                        keyEvent.preventDefault();
                                                        router.visit(`/client/announcements/${event.id}`);
                                                    }
                                                }}
                                            >
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
                                                    <Link href={`/client/announcements/${event.id}`} className="mt-2 inline-flex text-xs font-bold text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
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
                </div>
            </div>
        </>
    );
}