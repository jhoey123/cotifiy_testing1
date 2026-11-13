import { Head, Link, Form } from '@inertiajs/react';
import { useState } from 'react';

type UpcomingEvent = {
    id: number;
    title: string;
    event_date: string;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
    rsvp_count?: number;
    capacity?: number;
    image?: string | null;
};

type Announcement = {
    id: number;
    title: string;
    category: string;
    status: string;
    date: string;
    is_pinned?: boolean;
    image?: string | null;
    content?: string;
};

const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});

export default function StaffDashboard({
    recentAnnouncements = [],
    upcomingEvents = [],
    announcementCount = 0,
    eventCount = 0,
    userName = 'Staff User',
    userCourse = 'BSIT',
}: {
    recentAnnouncements: Announcement[];
    upcomingEvents: UpcomingEvent[];
    announcementCount: number;
    eventCount: number;
    userName?: string;
    userCourse?: string;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    // Main Navigation Links
    const navLinks = [
        { href: '/staff', label: 'Home', icon: 'fa-solid fa-house', active: true },
        { href: '/staff/announcements', label: 'Announcements', icon: 'fa-solid fa-bullhorn', active: false },
        { href: '/staff/events', label: 'Events', icon: 'fa-regular fa-calendar', active: false },
    ];

    return (
        <>
            <Head title="Staff Dashboard | Cotify" />
            
            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes popIn { 0% { transform: scale(0); } 80% { transform: scale(1.2); } 100% { transform: scale(1); } }
                
                @keyframes move-around-1 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(-35vw, 25vh) rotate(25deg); } 50% { transform: translate(-15vw, 50vh) rotate(-15deg); } 75% { transform: translate(25vw, 30vh) rotate(15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-2 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(30vw, -30vh) rotate(-25deg); } 50% { transform: translate(-40vw, -20vh) rotate(15deg); } 75% { transform: translate(-25vw, 30vh) rotate(-15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(35vw, -40vh) rotate(55deg) scale(1.3); } 66% { transform: translate(-30vw, 25vh) rotate(110deg) scale(0.9); } 100% { transform: translate(0, 0) rotate(0deg) scale(1); } }

                .animate-fade-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; }
                .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                .shape-move-1 { animation: move-around-1 35s ease-in-out infinite; }
                .shape-move-2 { animation: move-around-2 45s ease-in-out infinite; }
                .shape-move-3 { animation: move-around-3 40s ease-in-out infinite; }

                .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
                .clip-octagon { clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); }
            `}</style>

            <div className="font-sans text-slate-800 bg-slate-50 antialiased h-screen flex overflow-hidden relative">
                
                {/* MOVING SHAPES BACKGROUND */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[5%] left-[5%] w-[30rem] h-[30rem] bg-blue-500/5 rounded-full blur-3xl shape-move-1"></div>
                    <div className="absolute bottom-[5%] right-[5%] w-[35rem] h-[35rem] bg-indigo-500/5 rounded-full blur-3xl shape-move-2"></div>
                    <div className="absolute top-[15%] right-[15%] w-[25rem] h-[25rem] border-[2px] border-blue-500/10 rounded-full shape-move-1"></div>
                    <div className="absolute bottom-[20%] left-[10%] w-32 h-32 border-[3px] border-indigo-500/10 rounded-full shape-move-2"></div>
                    <div className="absolute top-[60%] right-[30%] w-20 h-20 border-[2px] border-blue-500/15 rounded-full shape-move-3"></div>
                    <div className="absolute top-[20%] left-[30%] w-40 h-40 bg-blue-500/5 clip-hexagon shape-move-2"></div>
                    <div className="absolute bottom-[15%] right-[20%] w-56 h-56 border-[3px] border-indigo-500/10 clip-hexagon shape-move-1 bg-transparent">
                        <div className="w-full h-full bg-blue-500/5 clip-hexagon scale-[0.95]"></div>
                    </div>
                    <div className="absolute top-[45%] left-[15%] w-32 h-32 bg-indigo-500/5 clip-octagon shape-move-3"></div>
                </div>

                {/* COLLAPSIBLE SIDEBAR */}
                <aside 
                    onMouseEnter={() => setIsSidebarExpanded(true)}
                    onMouseLeave={() => setIsSidebarExpanded(false)}
                    className={`bg-ctu-dark flex flex-col justify-between shrink-0 absolute md:relative z-40 h-full transition-all duration-300 ease-in-out shadow-2xl
                    ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
                    ${isSidebarExpanded ? 'md:w-64' : 'md:w-20'}`}
                >
                    <div className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden pt-6">
                        
                        {/* Logo Section */}
                        <div className="px-4 flex items-center h-20 mb-4">
                            <Link href="/staff" className="flex items-center shrink-0">
                                <img src="/images/3rdLogo.png" alt="Cotify Logo" className="w-20 h-20 sm:w-28 sm:h-28 object-contain -ml-4 sm:-ml-6 -mr-6 sm:-mr-8"  />
                                <div className={`text-white whitespace-nowrap transition-opacity duration-300 ml-2 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                    <h1 className="font-extrabold text-xl leading-tight tracking-tight">Cotify</h1>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Staff Portal</p>
                                </div>
                            </Link>
                        </div>

                        {/* Main Navigation Links */}
                        <nav className="space-y-1 px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-4 px-3 py-3.5 rounded-xl transition-all group ${
                                        link.active
                                            ? 'bg-[#3b82f6] text-white shadow-sm'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                                    title={!isSidebarExpanded ? link.label : undefined}
                                >
                                    <i className={`${link.icon} w-5 text-center text-lg shrink-0`}></i>
                                    <span className={`whitespace-nowrap font-bold text-[15px] transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                        {link.label}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* BOTTOM SECTION */}
                    <div className="p-3">

                        <div className="flex items-center gap-4 px-3 py-3 mb-1 rounded-xl border border-transparent">
                            <div className="w-10 h-10 rounded-full bg-ctu-lightblue flex items-center justify-center text-white font-bold text-sm shrink-0 ring-2 ring-transparent">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className={`whitespace-nowrap transition-opacity duration-300 overflow-hidden ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                <p className="text-white text-[15px] font-extrabold truncate">{userName.split(' ')[0]}</p>
                                <p className="text-slate-400 text-xs font-semibold truncate">{userCourse}</p>
                            </div>
                        </div>
                        
                        <Form method="post" action="/staff/logout">
                            {({ processing }) => (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center gap-4 px-3 py-3.5 text-left font-bold text-[15px] rounded-xl transition-all text-slate-400 hover:bg-slate-800/50 hover:text-white group disabled:opacity-60"
                                    title={!isSidebarExpanded ? "Log Out" : undefined}
                                >
                                    <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center text-lg shrink-0"></i>
                                    <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                        {processing ? 'Logging out...' : 'Log Out'}
                                    </span>
                                </button>
                            )}
                        </Form>
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
                    
                    {/* TOP BAR (Button removed) */}
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                aria-label="Toggle sidebar"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors md:hidden" 
                            >
                                <i className="fa-solid fa-bars"></i>
                            </button>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Staff Dashboard</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button aria-label="View notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-ctu-lightblue hover:bg-slate-50 transition-colors shadow-sm">
                                <i className="fa-regular fa-bell text-lg"></i>
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm border border-white animate-pop-in">
                                    3
                                </span>
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <section className="mb-8 animate-fade-up max-w-[1200px] mx-auto">
                            
                            {/* STATS ROW */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wider">My Announcements</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-4xl font-extrabold text-slate-900">{announcementCount}</h3>
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                                            <i className="fa-solid fa-bullhorn"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-sm font-bold text-purple-600 mb-2 uppercase tracking-wider">My Events</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-4xl font-extrabold text-slate-900">{eventCount}</h3>
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                                            <i className="fa-regular fa-calendar"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TWO COLUMN LAYOUT FOR CARDS */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* RECENT ANNOUNCEMENTS (List style inside the card container) */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recent Announcements</h3>
                                        <Link href="/staff/announcements" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                                            View all
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {recentAnnouncements.map((announcement) => (
                                            <div 
                                                key={announcement.id} 
                                                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md h-full"
                                            >
                                                {/* Image or Placeholder */}
                                                <div className="h-40 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                                    {announcement.image ? (
                                                        <img src={announcement.image} alt={announcement.title} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="text-slate-400">
                                                            <i className="fa-regular fa-newspaper text-4xl"></i>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex flex-1 flex-col p-5">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                                                            {announcement.category || 'General'}
                                                        </span>
                                                        <span className="text-xs font-semibold text-slate-500">{formatDate(announcement.date)}</span>
                                                    </div>

                                                    <h4 className="mb-2 text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                                        {announcement.title}
                                                    </h4>
                                                    
                                                    <p className="mb-4 text-sm font-medium text-slate-500 line-clamp-2">
                                                        {announcement.content || 'Click to read the full details of this announcement.'}
                                                    </p>

                                                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                            <i className="fa-regular fa-eye text-slate-400"></i> 124
                                                        </span>
                                                        <Link href={`/staff/announcements/${announcement.id}/edit`} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-slate-700">
                                                            Edit
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* UPCOMING EVENTS (Sidebar style cards) */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Upcoming Events</h3>
                                        <Link href="/staff/events" className="text-sm font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors">
                                            + New
                                        </Link>
                                    </div>

                                    <div className="space-y-4">
                                        {upcomingEvents.length === 0 ? (
                                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                                                <p className="text-sm font-medium text-slate-500">No upcoming events scheduled.</p>
                                            </div>
                                        ) : upcomingEvents.map((event) => (
                                            <div 
                                                key={event.id} 
                                                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
                                            >
                                                <div className="flex flex-col items-center justify-center rounded-xl bg-purple-100 text-purple-800 p-3 shrink-0 min-w-[64px]">
                                                    <span className="text-[10px] font-extrabold uppercase tracking-widest">{new Date(`${event.event_date}T00:00:00`).toLocaleDateString(undefined, { month: 'short' })}</span>
                                                    <span className="text-2xl font-black leading-none mt-1">{new Date(`${event.event_date}T00:00:00`).getDate()}</span>
                                                </div>
                                                
                                                <div className="flex-1 min-w-0 pt-1">
                                                    <h4 className="text-base font-bold text-slate-900 mb-1 group-hover:text-purple-700 transition-colors line-clamp-2">
                                                        {event.title}
                                                    </h4>
                                                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
                                                        <i className="fa-regular fa-clock text-purple-400"></i>
                                                        {event.start_time || '8:00 AM'}
                                                    </p>
                                                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                                        <i className="fa-solid fa-location-dot text-purple-400"></i>
                                                        {event.location || 'TBA'}
                                                    </p>
                                                    <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                                                        <div 
                                                            className="bg-purple-500 h-1.5 rounded-full" 
                                                            style={{ width: `${Math.min(((event.rsvp_count || 0) / (event.capacity || 100)) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <p className="mt-1 text-[10px] font-bold text-slate-400 text-right">
                                                        {event.rsvp_count || 0} / {event.capacity || 100} going
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}