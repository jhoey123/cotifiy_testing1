import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
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
            
            {/* ✅ SAME ANIMATIONS & MOVEMENT AS CLIENT HOME */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUpText { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
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
                .clip-octagon { clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); }
                .clip-diamond { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
            `}</style>

            <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased">
                
                {/* ✅ MORE VISIBLE MOVING SHAPES ACROSS THE SCREEN */}
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
                    <div className="absolute top-[60%] left-[5%] w-32 h-32 border-[4px] border-blue-500/30 rounded-full shape-move-4"></div>
                    <div className="absolute top-[20%] left-[40%] w-24 h-24 bg-indigo-600/15 clip-diamond shape-move-4"></div>
                </div>

                <ClientNavbar
                    activePage="announcements"
                    search={{
                        value: search,
                        onChange: setSearch,
                        placeholder: 'Search announcements...',
                        label: 'Search announcements',
                        type: 'search',
                    }}
                />

                <main className="relative z-10 mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 lg:px-8 animate-slide-up">
                    
                    {/* PAGE HEADER & FILTERS */}
                    <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900">Announcements</h1>
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
                                            
                                            {/* Rule: Primary Button */}
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
                </main>

                {/* FOOTER */}
                <footer className="bg-ctu-dark relative z-10 mt-auto border-t border-slate-800 py-8 text-white">
                    <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-400">
                                &copy; {new Date().getFullYear()} Cotify · College of Technology
                            </p>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-semibold text-slate-400">
                            <a href="#" className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">About</a>
                            <a href="#" className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">Contact</a>
                            <a href="#" className="transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">Privacy</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}