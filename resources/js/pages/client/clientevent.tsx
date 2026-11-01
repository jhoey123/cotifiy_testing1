import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface EventAnnouncement {
    id: number;
    title: string;
    category: 'Event';
    posted_by_office: string;
    date: string;
    content: string;
    image: string | null;
    event_date: string;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
}

interface ClientEventsProps {
    events?: EventAnnouncement[];
    unreadCount?: number;
    isLoading?: boolean;
    user?: {
        name: string;
    };
}

export default function ClientEvents({
    events = [],
    unreadCount = 0,
    isLoading = false,
    user = { name: 'Juan' }
}: ClientEventsProps) {
    const { auth } = usePage<any>().props;
    const userName = auth?.user?.name || user.name;

    const [view, setView] = useState<'calendar' | 'list'>('calendar');
    const [searchTerm, setSearchTerm] = useState('');

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // --- Filtering & Sorting ---
    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.location && e.location.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => a.event_date.localeCompare(b.event_date));

    // --- Calendar Logic ---
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today.toISOString().split('T')[0]);
    };

    const getEventsForDate = (dateStr: string) => filteredEvents.filter(e => e.event_date === dateStr);

    const activeDateStr = selectedDate || (
        new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear
            ? new Date().toISOString().split('T')[0]
            : `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`
    );
    
    const activeDateEvents = getEventsForDate(activeDateStr);
    const activeDateObj = new Date(`${activeDateStr}T00:00:00`);

    // --- Helpers ---
    const formatTime = (time: string | null) => time
        ? new Date(`1970-01-01T${time}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
        : '';
        
    const formatShortDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    return (
        <>
            <Head title="Events | COTIFY" />

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

                {/* HEADER */}
                <header className="bg-ctu-dark/95 relative z-50 border-b border-white/10 shadow-lg backdrop-blur-xl">
                    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
                            <div className="flex items-center gap-8">
                                <Link
                                    href="/client"
                                    className="group flex shrink-0 items-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <img
                                        src="/images/3rdLogo.png"
                                        alt="Cotify Logo"
                                        className="w-20 h-20 sm:w-28 sm:h-28 object-contain -ml-4 sm:-ml-6 -mr-6 sm:-mr-8" 
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

                                <nav className="hidden items-center gap-6 md:flex">
                                    <Link
                                        href="/client"
                                        className="rounded-md px-1 text-sm font-semibold text-slate-400 transition-colors hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/client/announcements"
                                        className="rounded-md px-1 text-sm font-semibold text-slate-400 transition-colors hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        Announcements
                                    </Link>
                                    <Link
                                        href="/client/events"
                                        className="border-ctu-lightblue rounded-t-md border-b-2 px-1 pb-1 text-sm font-bold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        Events
                                    </Link>
                                    <Link
                                        href="/client/saved"
                                        className="rounded-md px-1 text-sm font-semibold text-slate-400 transition-colors hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        Saved
                                    </Link>
                                </nav>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="relative hidden sm:block">
                                    <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400"></i>
                                    <input
                                        type="text"
                                        placeholder="Search events..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        aria-label="Search events"
                                        className="focus:ring-ctu-lightblue w-64 rounded-lg border border-slate-700 bg-slate-800/50 py-2 pr-4 pl-9 text-sm text-white placeholder-slate-400 transition-all outline-none focus:ring-2"
                                    />
                                </div>

                                <button 
                                    aria-label={`View notifications. ${unreadCount} unread.`}
                                    className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <i className="fa-regular fa-bell text-xl"></i>
                                    {unreadCount > 0 && (
                                        <span className="border-ctu-dark absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-red-500 text-[10px] font-bold text-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                <Link
                                    href="/client/profile"
                                    className="group flex cursor-pointer items-center gap-2 rounded-md border-l border-slate-700 pl-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:pl-4"
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

                <main className="relative z-10 mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 lg:px-8 animate-slide-up">
                    
                    {/* PAGE HEADER & TABS */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900">Events</h1>
                            <p className="mt-2 text-base text-slate-500">Discover what's happening on campus.</p>
                        </div>
                        
                        <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                            <button 
                                onClick={() => setView('calendar')}
                                aria-pressed={view === 'calendar'}
                                className={`rounded-md px-5 py-2 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    view === 'calendar' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                Calendar
                            </button>
                            <button 
                                onClick={() => setView('list')}
                                aria-pressed={view === 'list'}
                                className={`rounded-md px-5 py-2 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    view === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                List
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 animate-pulse">
                            <div className="h-96 rounded-2xl bg-slate-200 lg:col-span-8"></div>
                            <div className="h-96 rounded-2xl bg-slate-200 lg:col-span-4"></div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            
                            {/* --- CALENDAR VIEW --- */}
                            {view === 'calendar' && (
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                                    
                                    {/* Calendar Grid */}
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8">
                                        
                                        {/* Calendar Header */}
                                        <div className="mb-6 flex items-center justify-between">
                                            <h2 className="text-xl font-extrabold text-slate-900">
                                                {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                            </h2>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={prevMonth} 
                                                    aria-label="Previous month"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <i className="fa-solid fa-chevron-left text-sm"></i>
                                                </button>
                                                <button 
                                                    onClick={goToToday} 
                                                    className="rounded-md border border-slate-300 px-4 py-1.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    Today
                                                </button>
                                                <button 
                                                    onClick={nextMonth} 
                                                    aria-label="Next month"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <i className="fa-solid fa-chevron-right text-sm"></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Days of Week */}
                                        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                                                <div key={i} className="py-2 text-[12px] font-bold tracking-wider text-slate-400 uppercase">{day}</div>
                                            ))}
                                        </div>

                                        {/* Calendar Cells */}
                                        <div className="grid grid-cols-7 gap-1">
                                            {/* Empty cells for offset */}
                                            {Array.from({ length: firstDay }).map((_, i) => (
                                                <div key={`empty-${i}`} className="h-24 rounded-lg bg-slate-50/50"></div>
                                            ))}

                                            {/* Actual days */}
                                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                                const day = i + 1;
                                                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                const dayEvents = getEventsForDate(dateStr);
                                                const isSelected = selectedDate === dateStr;
                                                const isToday = dateStr === new Date().toISOString().split('T')[0];

                                                return (
                                                    <div 
                                                        key={day} 
                                                        onClick={() => setSelectedDate(dateStr)}
                                                        className={`flex h-24 cursor-pointer flex-col overflow-hidden rounded-lg border p-1.5 transition-colors ${
                                                            isSelected ? 'border-blue-500 bg-blue-50/50' : 
                                                            isToday ? 'border-slate-300 bg-slate-50' : 
                                                            'border-transparent hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
                                                            isToday ? 'bg-blue-600 text-white' : 'text-slate-700'
                                                        }`}>
                                                            {day}
                                                        </span>
                                                        
                                                        {/* Event Pills */}
                                                        <div className="no-scrollbar mt-1 space-y-1 overflow-y-auto">
                                                            {dayEvents.slice(0, 2).map(e => (
                                                                <div key={e.id} className="truncate rounded bg-slate-200/70 px-1.5 py-0.5 text-[11px] font-bold text-slate-700">
                                                                    {e.title}
                                                                </div>
                                                            ))}
                                                            {dayEvents.length > 2 && (
                                                                <div className="px-1.5 text-[11px] font-bold text-slate-500">+{dayEvents.length - 2} more</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Side Panel for Selected Date */}
                                    <aside className="space-y-4 lg:col-span-4">
                                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                            <h3 className="mb-4 border-b border-slate-100 pb-3 text-lg font-extrabold text-slate-900">
                                                {activeDateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                            </h3>
                                            
                                            {activeDateEvents.length === 0 ? (
                                                <div className="py-8 text-center">
                                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                                                        <i className="fa-regular fa-calendar-xmark text-xl text-slate-400"></i>
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-500">No events on this day.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-5">
                                                    {activeDateEvents.map(event => (
                                                        <div key={event.id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                                            
                                                            {/* Event Poster */}
                                                            <div className="mb-4 h-32 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
                                                                {event.image ? (
                                                                    <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                                        <i className="fa-regular fa-image text-3xl"></i>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            <h4 className="mb-2 text-base leading-tight font-bold text-slate-900">{event.title}</h4>
                                                            <p className="mb-4 text-sm font-medium text-slate-500">
                                                                {formatTime(event.start_time)} {event.end_time && `– ${formatTime(event.end_time)}`} • {event.location}
                                                            </p>
                                                            
                                                            {/* Rule: Secondary button */}
                                                            <Link 
                                                                href={`/client/announcements/${event.id}`} 
                                                                className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                            >
                                                                View event details
                                                            </Link>
                                                            
                                                            {/* Rule: Text link button */}
                                                            <button className="mt-3 flex w-full items-center justify-center gap-1 text-sm font-bold text-blue-600 transition-colors hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                                                                Add to Google Calendar
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </aside>
                                </div>
                            )}

                            {/* --- LIST VIEW --- */}
                            {view === 'list' && (
                                <div className="mx-auto max-w-4xl space-y-4">
                                    {filteredEvents.length === 0 ? (
                                        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                                            <h3 className="text-lg font-bold text-slate-800">No upcoming events found.</h3>
                                        </div>
                                    ) : (
                                        filteredEvents.map(event => (
                                            <div key={event.id} className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row">
                                                
                                                <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-100 sm:w-48">
                                                    {event.image ? (
                                                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <i className="fa-regular fa-image text-3xl text-slate-300"></i>
                                                    )}
                                                </div>
                                                
                                                <div className="flex flex-1 flex-col justify-between">
                                                    <div>
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <span className="rounded border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-emerald-700 uppercase">Event</span>
                                                            <span className="text-sm font-bold text-slate-500">{formatShortDate(event.event_date)}</span>
                                                        </div>
                                                        <h3 className="mb-2 text-xl font-bold text-slate-900">{event.title}</h3>
                                                        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{event.content}</p>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                                                            <span><i className="fa-regular fa-clock mr-1.5 text-slate-400"></i> {formatTime(event.start_time)}</span>
                                                            <span><i className="fa-solid fa-location-dot mr-1.5 text-slate-400"></i> {event.location}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                                        <p className="text-sm font-semibold text-slate-500">{event.posted_by_office}</p>
                                                        {/* Rule: Primary button */}
                                                        <Link 
                                                            href={`/client/announcements/${event.id}`} 
                                                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                        >
                                                            Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

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