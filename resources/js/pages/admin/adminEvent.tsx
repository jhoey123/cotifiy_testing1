import { Head, Link, router, useForm, Form } from '@inertiajs/react';
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

export default function AdminEvents({
    events = [],
}: {
    events: AdminEvent[];
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);
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

    // Update form when editing event changes - FIXED INFINITE LOOP
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
            // Scroll to form
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
            form.put(`/admin/events/${editingEvent.id}`, {
                preserveScroll: true,
                onSuccess: () => setEditingEvent(null),
            });
        } else {
            form.post('/admin/events', {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!eventToDelete) return;
        router.delete(`/admin/events/${eventToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setEventToDelete(null),
        });
    };

    return (
        <>
            <Head title="Manage Events | Cotify Admin" />
            
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                @keyframes move-around-1 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(-15vw, 10vh) rotate(15deg); } 50% { transform: translate(-5vw, 25vh) rotate(-10deg); } 75% { transform: translate(10vw, 15vh) rotate(5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-2 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(10vw, -15vh) rotate(-20deg); } 50% { transform: translate(-20vw, -10vh) rotate(10deg); } 75% { transform: translate(-10vw, 15vh) rotate(-5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(15vw, -20vh) rotate(45deg) scale(1.2); } 66% { transform: translate(-15vw, 10vh) rotate(90deg) scale(0.8); } 100% { transform: translate(0, 0) rotate(0deg) scale(1); } }

                .animate-fade-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; }
                .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                
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
                    <div className="absolute top-[70%] right-[10%] w-28 h-28 border-[2px] border-blue-500/10 rotate-45 shape-move-2"></div>
                    <div className="absolute bottom-[10%] left-[40%] w-16 h-16 bg-indigo-500/5 rotate-12 shape-move-3"></div>
                </div>

                {/* FULL SIDEBAR */}
                <aside 
                    className={`bg-ctu-dark flex flex-col justify-between shrink-0 absolute md:relative z-40 h-full transition-transform duration-300 shadow-2xl w-64 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
                >
                    <div className="flex-1 overflow-y-auto no-scrollbar w-64">
                        <div className="p-6 flex items-center">
                            <img src="/images/3rdLogo.png" alt="Cotify Logo" className="w-16 h-16 object-contain -ml-2 -mr-4" />
                            <div className="text-white">
                                <h1 className="font-extrabold text-xl leading-tight tracking-tight">Cotify</h1>
                            </div>
                        </div>

                        <nav className="mt-2 space-y-6 px-3">
                            <div>
                                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Main</p>
                                <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-solid fa-house w-5 text-center group-hover:scale-110 transition-transform"></i> Dashboard
                                </Link>
                                <Link href="/admin/announcements" className="mt-1 flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-solid fa-bullhorn w-5 text-center group-hover:scale-110 transition-transform"></i> Announcements
                                </Link>
                                <Link href="/admin/events" className="mt-1 flex items-center gap-3 px-3 py-2.5 bg-ctu-lightblue text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-900/30">
                                    <i className="fa-regular fa-calendar w-5 text-center"></i> Events
                                </Link>
                            </div>

                            <div>
                                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">People</p>
                                <Link href="/admin/users" prefetch="mount" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-solid fa-users w-5 text-center group-hover:scale-110 transition-transform"></i> Students
                                </Link>
                                <Link href="/admin/admins" prefetch="mount" className="mt-1 flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-solid fa-user-shield w-5 text-center group-hover:scale-110 transition-transform"></i> Staff & Admins
                                </Link>
                            </div>

                            <div>
                                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">System</p>
                                <Link href="/admin/settings" prefetch="mount" className="mt-1 flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-solid fa-gear w-5 text-center group-hover:rotate-90 transition-transform duration-300"></i> Settings
                                </Link>
                            </div>
                        </nav>
                    </div>

                    <div className="p-4 border-t border-slate-800/50 w-64">
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-sm ring-2 ring-slate-700">
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <div>
                                <p className="text-white text-sm font-bold">Niggas</p>
                                <p className="text-slate-400 text-[11px] font-medium">Registrar's Office</p>
                            </div>
                        </div> 
                        <Form method="post" action="/admin/logout">
                            {({ processing }) => (
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    onMouseEnter={() => setIsLogoutHovered(true)}
                                    onMouseLeave={() => setIsLogoutHovered(false)}
                                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-bold rounded-xl transition-all disabled:opacity-60
                                        ${isLogoutHovered ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                                    `}
                                >
                                    <i className={`fa-solid fa-arrow-right-from-bracket w-5 text-center transition-colors ${isLogoutHovered ? 'text-white' : 'text-slate-400'}`}></i> 
                                    {processing ? 'Logging Out...' : 'Log Out'}
                                </button>
                            )}
                        </Form>
                    </div>
                </aside>

                {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden animate-fade-in" onClick={() => setIsSidebarOpen(false)}></div>}

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative w-full z-10">
                    
                    {/* TOP BAR */}
                    <header className="h-20 bg-transparent border-b border-slate-200/50 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle sidebar" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors md:hidden">
                                <i className="fa-solid fa-bars"></i>
                            </button>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Manage Events</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative w-64 hidden md:block group">
                                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-ctu-lightblue transition-colors"></i>
                                <input type="text" placeholder="Search..." className="w-full pl-11 pr-4 py-2 bg-white border border-slate-200 text-slate-800 rounded-xl text-sm focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-slate-400 font-medium shadow-sm" />
                            </div>

                            <button aria-label="View notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-ctu-lightblue hover:bg-slate-50 transition-colors shadow-sm">
                                <i className="fa-regular fa-bell text-lg"></i>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            </button>

                            <button 
                                onClick={() => { setEditingEvent(null); form.reset(); document.getElementById('event-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                                className="bg-ctu-dark hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 shrink-0"
                            >
                                <i className="fa-solid fa-plus"></i> <span className="hidden sm:inline">New event</span>
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="max-w-[1000px] mx-auto space-y-8 animate-fade-up">
                            
                            {/* EVENTS LIST CARD */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                
                                {/* Card Header */}
                                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                                    <h3 className="text-lg font-extrabold text-slate-900">Events</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex bg-slate-100 p-1 rounded-lg">
                                            <button 
                                                onClick={() => setActiveTab('Upcoming')}
                                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'Upcoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Upcoming
                                            </button>
                                            <button 
                                                onClick={() => setActiveTab('Past')}
                                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'Past' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Past
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold bg-slate-50">
                                                <th className="px-6 py-3 w-24">Date</th>
                                                <th className="px-4 py-3">Event</th>
                                                <th className="px-4 py-3">Venue</th>
                                                <th className="px-4 py-3 w-48">RSVPs</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredEvents.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                                                        No {activeTab.toLowerCase()} events found.
                                                    </td>
                                                </tr>
                                            ) : filteredEvents.map((event) => {
                                                const isFull = event.capacity !== null && event.rsvp_count >= event.capacity;
                                                const percentage = event.capacity ? Math.min((event.rsvp_count / event.capacity) * 100, 100) : 0;
                                                
                                                return (
                                                    <tr key={event.id} className="text-sm text-slate-700 hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="text-xs font-extrabold text-slate-900 uppercase">
                                                                {new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}
                                                            </div>
                                                            <div className="text-lg font-black leading-none mt-0.5">
                                                                {new Date(event.date).getDate()}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <p className="font-bold text-slate-900 leading-tight">{event.title}</p>
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
                                                                            className={`h-1.5 rounded-full ${isFull ? 'bg-rose-500' : 'bg-slate-800'}`} 
                                                                            style={{ width: `${percentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button 
                                                                    onClick={() => setEditingEvent(event)}
                                                                    className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => setEventToDelete(event)}
                                                                    className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                                                                >
                                                                    Delete
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
                            <div id="event-form" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200">
                                    <h3 className="text-base font-extrabold text-slate-900">
                                        {editingEvent ? 'Edit event' : 'Event form'}
                                    </h3>
                                </div>
                                <form onSubmit={handleSaveEvent} className="p-6 space-y-5">
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Title</label>
                                            <input 
                                                type="text" 
                                                value={form.data.title}
                                                onChange={e => form.setData('title', e.target.value)}
                                                placeholder="IT Week Hackathon" 
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:border-ctu-lightblue focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                                            />
                                            {form.errors.title && <p className="mt-1 text-xs text-red-500">{form.errors.title}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Venue</label>
                                            <input 
                                                type="text" 
                                                value={form.data.venue}
                                                onChange={e => form.setData('venue', e.target.value)}
                                                placeholder="Computer Lab 2" 
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:border-ctu-lightblue focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Starts</label>
                                            <input 
                                                type="text" 
                                                value={form.data.start_time}
                                                onChange={e => form.setData('start_time', e.target.value)}
                                                placeholder="Nov 7 · 8:00 AM" 
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:border-ctu-lightblue focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Ends</label>
                                            <input 
                                                type="text" 
                                                value={form.data.end_time}
                                                onChange={e => form.setData('end_time', e.target.value)}
                                                placeholder="Nov 7 · 5:00 PM" 
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:border-ctu-lightblue focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Capacity</label>
                                            <input 
                                                type="number" 
                                                value={form.data.capacity}
                                                onChange={e => form.setData('capacity', e.target.value)}
                                                placeholder="40" 
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:border-ctu-lightblue focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Audience</label>
                                            <select 
                                                value={form.data.audience}
                                                onChange={e => form.setData('audience', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:border-ctu-lightblue focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="All">All Students</option>
                                                <option value="BSIT, BSCS">BSIT, BSCS</option>
                                                <option value="BSIT">BSIT Only</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                                            <input 
                                                type="checkbox" 
                                                checked={form.data.create_announcement}
                                                onChange={e => form.setData('create_announcement', e.target.checked)}
                                                className="rounded border-slate-300 text-ctu-lightblue focus:ring-ctu-lightblue" 
                                            /> 
                                            Also post as an announcement
                                        </label>

                                        <div className="flex gap-3">
                                            {editingEvent && (
                                                <button type="button" onClick={() => setEditingEvent(null)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                                    Cancel Edit
                                                </button>
                                            )}
                                            <button type="submit" disabled={form.processing} className="px-6 py-2 bg-ctu-dark hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50">
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
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
                            
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Delete this announcement?</h3>
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