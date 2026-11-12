import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import StaffSidebar from './StaffSidebar';

type UpcomingEvent = {
    id: number;
    title: string;
    event_date: string;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
    rsvp_count?: number;
    capacity?: number;
};

type Announcement = {
    id: number;
    title: string;
    category: string;
    status: string;
    date: string;
    is_pinned?: boolean;
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
}: {
    recentAnnouncements: Announcement[];
    upcomingEvents: UpcomingEvent[];
    announcementCount: number;
    eventCount: number;
    userName?: string;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <Head title="Staff Dashboard | Cotify" />
            
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes move-around-1 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(-15vw, 10vh) rotate(15deg); } 50% { transform: translate(-5vw, 25vh) rotate(-10deg); } 75% { transform: translate(10vw, 15vh) rotate(5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-2 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(10vw, -15vh) rotate(-20deg); } 50% { transform: translate(-20vw, -10vh) rotate(10deg); } 75% { transform: translate(-10vw, 15vh) rotate(-5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(15vw, -20vh) rotate(45deg) scale(1.2); } 66% { transform: translate(-15vw, 10vh) rotate(90deg) scale(0.8); } 100% { transform: translate(0, 0) rotate(0deg) scale(1); } }

                .animate-fade-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; }
                
                .shape-move-1 { animation: move-around-1 25s ease-in-out infinite; }
                .shape-move-2 { animation: move-around-2 30s ease-in-out infinite; }
                .shape-move-3 { animation: move-around-3 35s ease-in-out infinite; }

                .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
                .clip-octagon { clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); }
            `}</style>

            <div className="font-sans text-slate-800 bg-slate-50 antialiased h-screen flex overflow-hidden relative">
                
                {/* MOVING SHAPES BACKGROUND */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] bg-blue-500/5 rounded-full blur-3xl shape-move-1"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] bg-indigo-500/5 rounded-full blur-3xl shape-move-2"></div>
                    <div className="absolute top-[15%] right-[15%] w-[25rem] h-[25rem] border-[2px] border-blue-500/10 rounded-full shape-move-1"></div>
                    <div className="absolute bottom-[20%] left-[10%] w-32 h-32 border-[3px] border-indigo-500/10 rounded-full shape-move-2"></div>
                    <div className="absolute top-[60%] right-[30%] w-20 h-20 border-[2px] border-blue-500/15 rounded-full shape-move-3"></div>
                    <div className="absolute top-[20%] left-[30%] w-40 h-40 bg-blue-500/5 clip-hexagon shape-move-2"></div>
                    <div className="absolute bottom-[15%] right-[20%] w-56 h-56 border-[3px] border-indigo-500/10 clip-hexagon shape-move-1 bg-transparent">
                        <div className="w-full h-full bg-blue-500/5 clip-hexagon scale-[0.95]"></div>
                    </div>
                    <div className="absolute top-[45%] left-[15%] w-32 h-32 bg-indigo-500/5 clip-octagon shape-move-3"></div>
                </div>

                <StaffSidebar
                    activePage="dashboard"
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    userName={userName}
                />

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative w-full z-10">
                    
                    {/* TOP BAR */}
                    <header className="h-20 bg-transparent border-b border-slate-200/50 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle sidebar" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <i className="fa-solid fa-bars"></i>
                            </button>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Staff Dashboard</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button aria-label="View notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-ctu-lightblue hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <i className="fa-regular fa-bell text-lg"></i>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            </button>

                            {/* PRIMARY BUTTON - SAME AS ADMIN */}
                            <Link 
                                href="/staff/announcements"
                                className="bg-ctu-dark hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                            >
                                <i className="fa-solid fa-plus"></i> <span className="hidden sm:inline">New announcement</span>
                            </Link>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <section className="mb-8 animate-fade-up max-w-[1000px] mx-auto">
                            
                            {/* STATS ROW - Added more color */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wider">My Announcements</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-4xl font-extrabold text-slate-900">{announcementCount}</h3>
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                                            <i className="fa-solid fa-bullhorn"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-sm font-bold text-purple-600 mb-2 uppercase tracking-wider">My Events</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-4xl font-extrabold text-slate-900">{eventCount}</h3>
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                                            <i className="fa-regular fa-calendar"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TWO PANEL LAYOUT - Adjusted card borders and background for a slightly richer look */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                
                                {/* RECENT ANNOUNCEMENTS */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                    <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                                        <h4 className="font-extrabold text-lg text-slate-900">Recent Announcements</h4>
                                        <Link href="/staff/announcements" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                                            View all
                                        </Link>
                                    </div>
                                    
                                    <div className="flex-1 bg-white">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                                                    <th className="px-6 py-3">Title</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-6 py-3 w-32">Read</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {recentAnnouncements.map((announcement) => (
                                                    <tr key={announcement.id} className="hover:bg-slate-50/80 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-start gap-2">
                                                                {announcement.is_pinned && <i className="fa-solid fa-thumbtack text-xs text-rose-500 mt-1"></i>}
                                                                <div>
                                                                    <Link href={`/staff/announcements/${announcement.id}/edit`} className="text-left font-bold text-slate-900 hover:text-blue-600 transition-colors text-base line-clamp-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                                                                        {announcement.title}
                                                                    </Link>
                                                                    <p className="text-sm font-medium text-slate-500 mt-1">{formatDate(announcement.date)}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700">
                                                                {announcement.status || 'Published'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* UPCOMING EVENTS */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                    <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                                        <h4 className="font-extrabold text-lg text-slate-900">Upcoming Events</h4>
                                        <Link href="/staff/events" className="text-sm font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
                                            + New event
                                        </Link>
                                    </div>
                                    
                                    <div className="p-4 space-y-4 flex-1 bg-white">
                                        {upcomingEvents.length === 0 ? (
                                            <p className="p-4 text-base font-medium text-slate-500 text-center">No upcoming events scheduled.</p>
                                        ) : upcomingEvents.map((event) => (
                                            <div key={event.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-purple-50/50 transition-colors cursor-pointer group border border-transparent hover:border-purple-100">
                                                <div className="bg-purple-100 rounded-lg p-2 text-center min-w-[56px] shrink-0 h-fit">
                                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600">{new Date(`${event.event_date}T00:00:00`).toLocaleDateString(undefined, { month: 'short' })}</p>
                                                    <p className="text-xl font-black leading-none mt-0.5 text-purple-900">{new Date(`${event.event_date}T00:00:00`).getDate()}</p>
                                                </div>
                                                <div className="pt-1">
                                                    <p className="text-base font-bold text-slate-900 mb-1 group-hover:text-purple-700 transition-colors line-clamp-1">{event.title}</p>
                                                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                                        <i className="fa-regular fa-clock text-purple-400"></i>
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