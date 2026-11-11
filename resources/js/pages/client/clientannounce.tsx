import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

type AnnouncementCategory = 'Academic' | 'Event' | 'General' | 'Service';

interface Announcement {
    id: number;
    title: string;
    category: AnnouncementCategory;
    posted_by: string;
    date: string;
    content: string;
    content_html: string;
    image: string | null;
    event_date: string | null;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
}

interface ClientAnnouncementsProps {
    announcements: Announcement[];
    unreadCount?: number;
}

const categories: Array<'All' | AnnouncementCategory> = [
    'All',
    'Academic',
    'Event',
    'General',
    'Service',
];

// Rule: Color has one meaning. Red is for urgent/errors. 
// Service is now Purple. Academic is Blue. Event is Green. General is Gray.
const categoryStyles: Record<AnnouncementCategory, string> = {
    Academic: 'bg-blue-50 text-blue-700 border-blue-200',
    Event: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    General: 'bg-slate-100 text-slate-700 border-slate-200',
    Service: 'bg-purple-50 text-purple-700 border-purple-200', 
};

function formatDate(value: string) {
    return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function ClientAnnouncements({
    announcements = [],
    unreadCount = 0,
}: ClientAnnouncementsProps) {
    const { auth } = usePage<any>().props;
    const userName = auth?.user?.name || 'Student';
    const userCourse = auth?.user?.course || 'Student';

    const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All');
    const [search, setSearch] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    useEffect(() => {
        const pollForAnnouncements = () => {
            if (document.visibilityState === 'visible') {
                router.reload({ only: ['announcements', 'unreadCount'], showProgress: false });
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
        const query = search.trim().toLowerCase();

        return announcements.filter((announcement) => {
            const matchesCategory =
                activeCategory === 'All' ||
                announcement.category === activeCategory;
            const matchesSearch =
                !query ||
                [
                    announcement.title,
                    announcement.content,
                    announcement.posted_by,
                ].some((value) => value.toLowerCase().includes(query));

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, announcements, search]);

    // Navigation Links
    const navLinks = [
        { href: '/client', label: 'Home', icon: 'fa-solid fa-house', active: false },
        { href: '/client/announcements', label: 'Announcements', icon: 'fa-solid fa-bullhorn', active: true },
        { href: '/client/events', label: 'Events', icon: 'fa-regular fa-calendar', active: false },
        { href: '/client/saved', label: 'Saved', icon: 'fa-regular fa-bookmark', active: false },
    ];

    return (
        <>
            <Head title="Announcements | COTIFY" />
            
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUpText { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                @keyframes move-around-1 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(-35vw, 25vh) rotate(25deg); } 50% { transform: translate(-15vw, 50vh) rotate(-15deg); } 75% { transform: translate(25vw, 30vh) rotate(15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-2 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(30vw, -30vh) rotate(-25deg); } 50% { transform: translate(-40vw, -20vh) rotate(15deg); } 75% { transform: translate(-25vw, 30vh) rotate(-15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(35vw, -40vh) rotate(55deg) scale(1.3); } 66% { transform: translate(-30vw, 25vh) rotate(110deg) scale(0.9); } 100% { transform: translate(0, 0) rotate(0deg) scale(1); } }
                @keyframes move-around-4 { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-20vw, 30vh) scale(1.2); } 100% { transform: translate(0, 0) scale(1); } }

                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                .animate-slide-up { animation: slideUpText 0.5s ease-out forwards; }
                .animate-spin-slow { animation: spin-slow 25s linear infinite; }
                
                .shape-move-1 { animation: move-around-1 35s ease-in-out infinite; }
                .shape-move-2 { animation: move-around-2 45s ease-in-out infinite; }
                .shape-move-3 { animation: move-around-3 40s ease-in-out infinite; }
                .shape-move-4 { animation: move-around-4 30s ease-in-out infinite; }

                .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
                .clip-octagon { clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); }
                .clip-diamond { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
            `}</style>

            <div className="font-sans text-slate-800 bg-slate-50 antialiased h-screen flex overflow-hidden relative">
                
                {/* MOVING SHAPES BACKGROUND */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
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

                {/* COLLAPSIBLE SIDEBAR */}
                <aside 
                    onMouseEnter={() => setIsSidebarExpanded(true)}
                    onMouseLeave={() => setIsSidebarExpanded(false)}
                    className={`bg-ctu-dark flex flex-col justify-between shrink-0 absolute md:relative z-40 h-full transition-all duration-300 ease-in-out shadow-2xl
                    ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
                    ${isSidebarExpanded ? 'md:w-64' : 'md:w-20'}`}
                >
                    <div className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden">
                        
                        {/* Logo Section */}
                        <div className="p-4 flex items-center h-20 border-b border-slate-800/50">
                            <Link href="/client" className="flex items-center shrink-0">
                                <img 
                                    src="/images/3rdLogo.png" 
                                    alt="Cotify Logo" 
                                   className="w-20 h-20 sm:w-28 sm:h-28 object-contain -ml-4 sm:-ml-6 -mr-6 sm:-mr-8" 
                                />
                                <div className={`text-white whitespace-nowrap transition-opacity duration-300 ml-2 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                    <h1 className="font-extrabold text-xl leading-tight tracking-tight">Cotify</h1>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Student Portal</p>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <nav className="mt-4 space-y-2 px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                                        link.active
                                            ? 'bg-ctu-lightblue text-white shadow-md'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                    title={!isSidebarExpanded ? link.label : undefined}
                                >
                                    <i className={`${link.icon} w-5 text-center text-lg shrink-0`}></i>
                                    <span className={`whitespace-nowrap font-semibold text-sm transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                        {link.label}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Bottom Profile / Logout */}
                    <div className="p-4 border-t border-slate-800/50">
                        <div className="flex items-center gap-3 px-1 py-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-ctu-lightblue flex items-center justify-center text-white font-bold text-sm shrink-0 ring-2 ring-transparent">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                <p className="text-white text-sm font-bold truncate max-w-[120px]">{userName.split(' ')[0]}</p>
                                <p className="text-slate-400 text-[11px] font-medium truncate max-w-[120px]">{userCourse}</p>
                            </div>
                        </div>
                        
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-bold rounded-xl transition-all text-slate-400 hover:bg-red-600 hover:text-white group"
                            title={!isSidebarExpanded ? "Log Out" : undefined}
                        >
                            <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center text-lg shrink-0"></i>
                            <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                Log Out
                            </span>
                        </Link>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative w-full z-10">
                    
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                aria-label="Toggle sidebar"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors md:hidden" 
                            >
                                <i className="fa-solid fa-bars"></i>
                            </button>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Announcements</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative w-64 hidden md:block group">
                                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-ctu-lightblue transition-colors"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search announcements..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2 bg-slate-100 border border-transparent text-slate-800 rounded-xl text-sm focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-slate-400 font-medium" 
                                />
                            </div>

                            <button aria-label="View notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-ctu-lightblue hover:bg-slate-50 transition-colors shadow-sm">
                                <i className="fa-regular fa-bell text-lg"></i>
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="max-w-[1400px] mx-auto animate-slide-up">
                            
                            {/* PAGE HEADER & FILTERS */}
                            <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                                <div>
                                    <p className="mt-2 text-base text-slate-500">
                                        Stay up to date with academic notices, services, and campus news.
                                    </p>
                                </div>
                                
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    
                                    {/* Mobile Search */}
                                    <div className="relative sm:hidden">
                                        <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400"></i>
                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search..."
                                            className="focus:ring-ctu-lightblue w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-9 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2"
                                        />
                                    </div>

                                    {/* Category Chips */}
                                    <div
                                        className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
                                        role="group"
                                        aria-label="Filter announcements by category"
                                    >
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                type="button"
                                                onClick={() => setActiveCategory(category)}
                                                aria-pressed={activeCategory === category}
                                                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    activeCategory === category
                                                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                {category === 'Event' ? 'Events' : category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* RESULTS COUNT */}
                            <div className="mb-4">
                                <p className="text-sm font-semibold text-slate-500">
                                    Showing {filteredAnnouncements.length} {filteredAnnouncements.length === 1 ? 'announcement' : 'announcements'}
                                </p>
                            </div>

                            {filteredAnnouncements.length === 0 ? (
                                <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                                        <i className="fa-regular fa-folder-open text-2xl text-slate-400" aria-hidden="true"></i>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">No announcements found</h3>
                                    <p className="mt-2 text-base text-slate-500">
                                        {search || activeCategory !== 'All'
                                            ? 'Try another search or category.'
                                            : 'There are no announcements to show right now.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                                    {filteredAnnouncements.map((announcement) => (
                                        <article
                                            key={announcement.id}
                                            className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                                        >
                                            {/* Image / Placeholder */}
                                            {announcement.image ? (
                                                <img
                                                    src={announcement.image}
                                                    alt={announcement.title}
                                                    loading="lazy"
                                                    className="h-48 w-full bg-slate-100 object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                                                    <i className="fa-regular fa-newspaper text-4xl" aria-hidden="true"></i>
                                                </div>
                                            )}
                                            
                                            <div className="flex flex-1 flex-col p-6">
                                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                                    <span className={`rounded border px-2.5 py-1 text-[12px] font-bold tracking-wider uppercase ${categoryStyles[announcement.category]}`}>
                                                        {announcement.category === 'Event' ? 'Events' : announcement.category === 'Service' ? 'Services' : announcement.category}
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-500">
                                                        {formatDate(announcement.date)}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="mb-2 text-lg leading-snug font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {announcement.title}
                                                </h3>
                                                
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: announcement.content_html }}
                                                    className="line-clamp-3 flex-1 text-base leading-relaxed text-slate-900 [&_a]:text-blue-700 [&_a]:underline [&_a]:[text-shadow:0_0_8px_rgb(59_130_246_/_50%)] [&_p]:mb-0"
                                                />
                                                
                                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                                    <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-500">
                                                        <i className="fa-solid fa-building text-slate-400" aria-hidden="true"></i>
                                                        <span className="truncate">
                                                            {announcement.posted_by}
                                                        </span>
                                                    </span>
                                                    
                                                    <Link
                                                        href={`/client/announcements/${announcement.id}`}
                                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    >
                                                        Read more
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}