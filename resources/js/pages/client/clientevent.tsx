import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import ClientNotificationDropdown from './ClientNotificationDropdown';
import ClientNavbar from './ClientNavbar';

interface EventAnnouncement {
    id: number;
    title: string;
    category: 'Event';
    posted_by_office: string;
    date: string;
    content: string;
    image: string | null;
    event_date: string;
    event_end_date?: string | null;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
}

interface ClientEventsProps {
    events?: EventAnnouncement[];
    isLoading?: boolean;
    user?: {
        name: string;
    };
}

export default function ClientEvents({
    events = [],
    isLoading = false,
}: ClientEventsProps) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            if (document.visibilityState === 'visible') {
                router.reload({ only: ['events', 'unreadCount'], showProgress: false });
            }
        }, 15_000);

        return () => window.clearInterval(intervalId);
    }, []);

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const calendarViewportRef = useRef<HTMLDivElement>(null);
    const calendarDragRef = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null);
    const calendarDraggedRef = useRef(false);

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
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

    const getEventsForDate = (dateStr: string) => filteredEvents.filter(e =>
        e.event_date <= dateStr && (e.event_end_date || e.event_date) >= dateStr
    );

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
        

    return (
        <>
            <Head title="Events | COTIFY" />

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

                <ClientNavbar activePage="events" />

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative w-full z-10">
                    
                    {/* TOP BAR */}
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">

                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Events</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative w-64 hidden md:block group">
                                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-ctu-lightblue transition-colors"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search events..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2 bg-slate-100 border border-transparent text-slate-800 rounded-xl text-sm focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-slate-400 font-medium" 
                                />
                            </div>

                            <ClientNotificationDropdown variant="light" />
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="max-w-[1400px] mx-auto animate-slide-up">
                            
                            {/* PAGE HEADER & TABS */}
                            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <p className="mt-2 text-base text-slate-500">Discover what's happening on campus.</p>
                                </div>
                                
                            </div>

                            {isLoading ? (
                                <div className="animate-pulse">
                                    <div className="h-96 rounded-2xl bg-slate-200"></div>
                                </div>
                            ) : (
                                <div className="animate-fade-in">
                                    
                                    <div className="space-y-8">
                                            
                                            {/* Calendar Grid */}
                                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                                <div className="-mx-6 -mt-6 mb-4 flex items-center justify-between rounded-t-2xl bg-white px-6 pt-6 pb-3">
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
                                                            onClick={nextMonth}
                                                            aria-label="Next month"
                                                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <i className="fa-solid fa-chevron-right text-sm"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div
                                                    ref={calendarViewportRef}
                                                    className="cursor-grab overflow-x-auto active:cursor-grabbing"
                                                    onPointerDown={(event) => {
                                                        if (event.pointerType !== 'mouse' || event.button !== 0 || (event.target instanceof Element && event.target.closest('button'))) {
                                                            return;
                                                        }

                                                        calendarDragRef.current = {
                                                            pointerId: event.pointerId,
                                                            startX: event.clientX,
                                                            scrollLeft: event.currentTarget.scrollLeft,
                                                        };
                                                        calendarDraggedRef.current = false;
                                                        event.currentTarget.setPointerCapture(event.pointerId);
                                                    }}
                                                    onPointerMove={(event) => {
                                                        const drag = calendarDragRef.current;
                                                        if (!drag || drag.pointerId !== event.pointerId) {
                                                            return;
                                                        }

                                                        const distance = event.clientX - drag.startX;
                                                        if (Math.abs(distance) > 5) {
                                                            calendarDraggedRef.current = true;
                                                            event.currentTarget.scrollLeft = drag.scrollLeft - distance;
                                                        }
                                                    }}
                                                    onPointerUp={(event) => {
                                                        if (calendarDragRef.current?.pointerId === event.pointerId) {
                                                            calendarDragRef.current = null;
                                                            event.currentTarget.releasePointerCapture(event.pointerId);
                                                        }
                                                    }}
                                                    onPointerCancel={() => {
                                                        calendarDragRef.current = null;
                                                    }}
                                                    onClickCapture={(event) => {
                                                        if (calendarDraggedRef.current) {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            calendarDraggedRef.current = false;
                                                        }
                                                    }}
                                                >
                                                <div className="min-w-[700px]">

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
                                                        const isToday = dateStr === todayStr;

                                                        return (
                                                            <div 
                                                                key={day} 
                                                                onClick={() => setSelectedDate(dateStr)}
                                                                className={`flex h-24 cursor-pointer flex-col overflow-hidden rounded-lg border p-1.5 transition-colors ${
                                                                    isToday ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' :
                                                                    isSelected ? 'border-blue-500 bg-blue-50/50' :
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
                                                </div>
                                            </div>

                                            {/* Side Panel for Selected Date */}
                                            <aside className="space-y-4">
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

                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}