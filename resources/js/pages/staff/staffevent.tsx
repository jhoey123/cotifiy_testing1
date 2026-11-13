import { Head, router, useForm, Link, Form } from '@inertiajs/react';
import { useState, useEffect } from 'react';

type AdminEvent = {
    id: number;
    title: string;
    date: string;
    time: string;
    venue: string;
    rsvp_count: number;
    capacity: number | null;
    audience: string;
    status: 'Upcoming' | 'Past';
    start_time: string;
    end_time: string;
};

export default function StaffEvents({
    events = [],
    userName = 'Staff User',
    userCourse = 'BSIT',
}: {
    events: AdminEvent[];
    userName?: string;
    userCourse?: string;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
    const [eventToDelete, setEventToDelete] = useState<AdminEvent | null>(null);
    const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);

    // Initialize form
    const form = useForm({
        title: '',
        venue: '',
        start_time: '',
        end_time: '',
        capacity: '',
        audience: 'All',
        create_announcement: false,
    });

    // Update form when editing event changes
    useEffect(() => {
        if (editingEvent) {
            form.setData({
                title: editingEvent.title,
                venue: editingEvent.venue,
                start_time: editingEvent.start_time,
                end_time: editingEvent.end_time,
                capacity: editingEvent.capacity || '',
                audience: editingEvent.audience,
                create_announcement: false,
            });
            document.getElementById('event-form')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingEvent]);

    // Filter events by tab
    const filteredEvents = events.filter((e) => e.status === activeTab);

    // Form submission handler
    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEvent) {
            form.put(`/staff/events/${editingEvent.id}`, {
                preserveScroll: true,
                onSuccess: () => setEditingEvent(null),
            });
        } else {
            form.post('/staff/events', {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!eventToDelete) return;
        router.delete(`/staff/events/${eventToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setEventToDelete(null),
        });
    };

    // Navigation Links
    const navLinks = [
        { href: '/staff', label: 'Home', icon: 'fa-solid fa-house', active: false },
        { href: '/staff/announcements', label: 'Announcements', icon: 'fa-solid fa-bullhorn', active: false },
        { href: '/staff/events', label: 'Events', icon: 'fa-regular fa-calendar', active: true },
        { href: '/staff/saved', label: 'Saved', icon: 'fa-regular fa-bookmark', active: false },
    ];

    return (
        <>
            <Head title="My Events | Cotify Staff" />
            
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                @keyframes move-around-1 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(-35vw, 25vh) rotate(25deg); } 50% { transform: translate(-15vw, 50vh) rotate(-15deg); } 75% { transform: translate(25vw, 30vh) rotate(15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-2 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(30vw, -30vh) rotate(-25deg); } 50% { transform: translate(-40vw, -20vh) rotate(15deg); } 75% { transform: translate(-25vw, 30vh) rotate(-15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(35vw, -40vh) rotate(55deg) scale(1.3); } 66% { transform: translate(-30vw, 25vh) rotate(110deg) scale(0.9); } 100% { transform: translate(0, 0) rotate(0deg) scale(1); } }

                .animate-fade-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; }
                .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                
                .shape-move-1 { animation: move-around-1 35s ease-in-out infinite; }
                .shape-move-2 { animation: move-around-2 45s ease-in-out infinite; }
                .shape-move-3 { animation: move-around-3 40s ease-in-out infinite; }

                .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
                .clip-octagon { clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); }
            `}</style>

            <div className="font-sans text-slate-800 bg-slate-50 antialiased h-screen flex overflow-hidden relative">
                
                {/* MOVING SHAPES BACKGROUND */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[5%] left-[5%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-3xl shape-move-1"></div>
                    <div className="absolute bottom-[5%] right-[5%] w-[35rem] h-[35rem] bg-purple-500/10 rounded-full blur-3xl shape-move-2"></div>
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
                                <img src="/images/3rdLogo.png" alt="Cotify Logo" className="w-12 h-12 object-contain -ml-1 shrink-0" />
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
                        <Link
                            href="/staff/settings"
                            className="flex w-full items-center gap-4 px-3 py-3.5 mb-1 text-left font-bold text-[15px] rounded-xl transition-all text-slate-400 hover:bg-slate-800/50 hover:text-white group"
                            title={!isSidebarExpanded ? "Settings" : undefined}
                        >
                            <i className="fa-solid fa-gear w-5 text-center text-lg shrink-0 group-hover:rotate-90 transition-transform duration-300"></i>
                            <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                Settings
                            </span>
                        </Link>

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
                    
                    {/* TOP BAR */}
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                aria-label="Toggle sidebar"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors md:hidden" 
                            >
                                <i className="fa-solid fa-bars"></i>
                            </button>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">My Events</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative w-64 hidden md:block group">
                                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-ctu-lightblue transition-colors"></i>
                                <input type="text" placeholder="Search events..." className="w-full pl-11 pr-4 py-2 bg-slate-100 border border-transparent text-slate-800 rounded-xl text-sm focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-slate-400 font-medium" />
                            </div>

                            <button aria-label="View notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-ctu-lightblue hover:bg-slate-50 transition-colors shadow-sm">
                                <i className="fa-regular fa-bell text-lg"></i>
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="max-w-[1200px] mx-auto space-y-8 animate-fade-up">
                            
                            {/* STATS & HIGHLIGHTS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-blue-600 mb-1 uppercase tracking-wider">Upcoming Events</p>
                                        <h3 className="text-3xl font-extrabold text-slate-900">{events.filter(e => e.status === 'Upcoming').length}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <i className="fa-regular fa-calendar-check text-xl"></i>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-purple-600 mb-1 uppercase tracking-wider">Past Events</p>
                                        <h3 className="text-3xl font-extrabold text-slate-900">{events.filter(e => e.status === 'Past').length}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                        <i className="fa-solid fa-clock-rotate-left text-xl"></i>
                                    </div>
                                </div>
                            </div>

                            {/* EVENTS LIST CARD */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                
                                {/* TABS & NEW EVENT BUTTON */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-200">
                                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                        <button 
                                            onClick={() => setActiveTab('Upcoming')}
                                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Upcoming' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Upcoming
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('Past')}
                                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Past' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Past
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => { setEditingEvent(null); form.reset(); document.getElementById('event-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                                        className="bg-ctu-dark hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 shrink-0"
                                    >
                                        <i className="fa-solid fa-plus"></i> New event
                                    </button>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold bg-slate-50">
                                                <th className="px-6 py-4 w-24">Date</th>
                                                <th className="px-4 py-4">Event</th>
                                                <th className="px-4 py-4">Venue</th>
                                                <th className="px-4 py-4 w-48">RSVPs</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredEvents.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-slate-500">
                                                        No {activeTab.toLowerCase()} events found.
                                                    </td>
                                                </tr>
                                            ) : filteredEvents.map((event) => {
                                                const isFull = event.capacity !== null && event.rsvp_count >= event.capacity;
                                                const percentage = event.capacity ? Math.min((event.rsvp_count / event.capacity) * 100, 100) : 0;
                                                
                                                return (
                                                    <tr key={event.id} className="text-sm text-slate-700 hover:bg-slate-50/80 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="text-xs font-extrabold text-blue-600 uppercase">
                                                                {new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}
                                                            </div>
                                                            <div className="text-lg font-black leading-none mt-0.5 text-slate-900">
                                                                {new Date(event.date).getDate()}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                                                {event.title}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-xs font-semibold text-slate-600">
                                                            {event.venue}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-col gap-1.5">
                                                                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                                                    <span>{event.capacity ? `${event.rsvp_count}/${event.capacity}` : `No limit · ${event.rsvp_count}`}</span>
                                                                </div>
                                                                {event.capacity && (
                                                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                                        <div 
                                                                            className={`h-1.5 rounded-full ${isFull ? 'bg-rose-500' : 'bg-blue-500'}`} 
                                                                            style={{ width: `${percentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button 
                                                                    onClick={() => setEditingEvent(event)}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Edit"
                                                                >
                                                                    <i className="fa-solid fa-pen text-xs"></i>
                                                                </button>
                                                                <button 
                                                                    onClick={() => setEventToDelete(event)}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Delete"
                                                                >
                                                                    <i className="fa-solid fa-trash text-xs"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* EVENT FORM CARD */}
                            <div id="event-form" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                                    <h3 className="text-lg font-extrabold text-slate-900">
                                        {editingEvent ? 'Edit event' : 'Create new event'}
                                    </h3>
                                </div>
                                <form onSubmit={handleSaveEvent} className="p-6 space-y-6">
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Title</label>
                                            <input 
                                                type="text" 
                                                value={form.data.title}
                                                onChange={e => form.setData('title', e.target.value)}
                                                placeholder="IT Week Hackathon" 
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                                            />
                                            {form.errors.title && <p className="mt-1 text-xs text-red-500">{form.errors.title}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Venue</label>
                                            <input 
                                                type="text" 
                                                value={form.data.venue}
                                                onChange={e => form.setData('venue', e.target.value)}
                                                placeholder="Computer Lab 2" 
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Starts</label>
                                            <input 
                                                type="text" 
                                                value={form.data.start_time}
                                                onChange={e => form.setData('start_time', e.target.value)}
                                                placeholder="Nov 7 · 8:00 AM" 
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Ends</label>
                                            <input 
                                                type="text" 
                                                value={form.data.end_time}
                                                onChange={e => form.setData('end_time', e.target.value)}
                                                placeholder="Nov 7 · 5:00 PM" 
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Capacity</label>
                                            <input 
                                                type="number" 
                                                value={form.data.capacity}
                                                onChange={e => form.setData('capacity', e.target.value)}
                                                placeholder="40" 
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Audience</label>
                                            <select 
                                                value={form.data.audience}
                                                onChange={e => form.setData('audience', e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="All">All Students</option>
                                                <option value="BSIT, BSCS">BSIT, BSCS</option>
                                                <option value="BSIT">BSIT Only</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                                        <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-700">
                                            <input 
                                                type="checkbox" 
                                                checked={form.data.create_announcement}
                                                onChange={e => form.setData('create_announcement', e.target.checked)}
                                                className="w-5 h-5 rounded border-slate-300 text-ctu-dark focus:ring-ctu-dark" 
                                            /> 
                                            Also post as an announcement
                                        </label>

                                        <div className="flex gap-3 w-full sm:w-auto">
                                            {editingEvent && (
                                                <button type="button" onClick={() => setEditingEvent(null)} className="flex-1 sm:flex-none px-5 py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                                    Cancel
                                                </button>
                                            )}
                                            <button type="submit" disabled={form.processing} className="flex-1 sm:flex-none px-6 py-3 bg-ctu-dark hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 shadow-md">
                                                {editingEvent ? 'Save Changes' : 'Create Event'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </main>
                </div>

                {/* DELETE CONFIRMATION MODAL */}
                {eventToDelete && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
                            
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Delete this event?</h3>
                            <p className="text-sm font-medium text-slate-600 mb-2 leading-relaxed">
                                <strong className="text-slate-900">"{eventToDelete.title}"</strong> will be removed for all students. This can't be undone.
                            </p>
                            <p className="text-xs font-medium text-slate-400 mb-8 flex items-center gap-1.5">
                                <i className="fa-solid fa-circle-info"></i> Tip: Archive hides it but keeps the record.
                            </p>
                            
                            <div className="flex items-center justify-end gap-3">
                                <button 
                                    onClick={() => setEventToDelete(null)} 
                                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => setEventToDelete(null)} 
                                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Archive instead
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </>
    );
}