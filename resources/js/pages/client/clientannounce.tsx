import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import ClientNotificationDropdown from './ClientNotificationDropdown';
import ClientNavbar from './ClientNavbar';

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
}: ClientAnnouncementsProps) {
    const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All');
    const [search, setSearch] = useState('');

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

                <ClientNavbar activePage="announcements" />

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative w-full z-10">
                    
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">

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

                            <ClientNotificationDropdown variant="light" />
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
                                <div className="animate-fade-in space-y-4">
                                    {filteredAnnouncements.map((announcement) => (
                                        <article
                                            key={announcement.id}
                                            role="link"
                                            tabIndex={0}
                                            aria-label={`Read announcement: ${announcement.title}`}
                                            className="group relative flex min-w-0 cursor-pointer gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50 sm:gap-6 sm:p-5"
                                            onClick={(event) => {
                                                if (event.target instanceof Element && event.target.closest('a, button')) {
                                                    return;
                                                }

                                                router.visit(`/client/announcements/${announcement.id}`);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.target === event.currentTarget && event.key === 'Enter') {
                                                    event.preventDefault();
                                                    router.visit(`/client/announcements/${announcement.id}`);
                                                }
                                            }}
                                        >
                                            {announcement.image ? (
                                                <img
                                                    src={announcement.image}
                                                    alt=""
                                                    loading="lazy"
                                                    className="mt-1 h-16 w-16 shrink-0 rounded-lg bg-slate-100 object-cover sm:h-20 sm:w-20"
                                                />
                                            ) : (
                                                <div className="mt-1 flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 sm:h-20 sm:w-20">
                                                    <i className="fa-regular fa-newspaper text-2xl" aria-hidden="true"></i>
                                                </div>
                                            )}

                                            <div className="min-w-0 flex-1">
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    <span className={`rounded border px-2.5 py-1 text-[12px] font-bold tracking-wider uppercase ${categoryStyles[announcement.category]}`}>
                                                        {announcement.category === 'Event' ? 'Events' : announcement.category === 'Service' ? 'Services' : announcement.category}
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-500 sm:text-sm">
                                                        {formatDate(announcement.date)}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="mb-1 text-base leading-snug font-bold text-slate-900 transition-colors group-hover:text-blue-600 sm:text-lg">
                                                    {announcement.title}
                                                </h3>
                                                
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: announcement.content_html }}
                                                    className="line-clamp-2 text-sm leading-relaxed text-slate-600 [&_a]:text-blue-700 [&_a]:underline [&_a]:[text-shadow:0_0_8px_rgb(59_130_246_/_50%)] [&_p]:mb-0 sm:text-base"
                                                />
                                                
                                                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                                    <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-500">
                                                        <i className="fa-solid fa-building text-slate-400" aria-hidden="true"></i>
                                                        <span className="truncate">
                                                            {announcement.posted_by}
                                                        </span>
                                                    </span>
                                                    
                                                    <Link
                                                        href={`/client/announcements/${announcement.id}`}
                                                        className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:hidden"
                                                    >
                                                        Read more <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/client/announcements/${announcement.id}`}
                                                aria-label={`Read more: ${announcement.title}`}
                                                className="absolute inset-y-0 right-0 z-10 hidden w-52 translate-x-4 items-center justify-center gap-2 rounded-r-2xl border-y-4 border-r-4 border-l-0 border-transparent [background-clip:padding-box,border-box] [background-image:linear-gradient(to_left,rgba(37,99,235,0.3)_0%,rgba(59,130,246,0.2)_30%,rgba(96,165,250,0.11)_60%,rgba(191,219,254,0.04)_85%,rgba(255,255,255,0)_100%),linear-gradient(to_left,rgba(30,64,175,0.9)_0%,rgba(59,130,246,0.65)_35%,rgba(147,197,253,0.35)_70%,rgba(191,219,254,0.03)_100%)] [background-origin:padding-box,border-box] text-base font-extrabold text-white drop-shadow-[0_1px_3px_rgba(15,23,42,0.9)] opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300 sm:flex"
                                            >
                                                Read more <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
                                            </Link>
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