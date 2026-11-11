import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface SavedItem {
    id: number;
    title: string;
    subtitle: string;
    category: 'Event' | 'Academic' | 'General' | 'Service';
    link: string;
}

interface ClientSavedProps {
    savedItems?: SavedItem[];
    unreadCount?: number;
    user?: { name: string };
}

export default function ClientSaved({
    savedItems = [],
    unreadCount = 0,
}: ClientSavedProps) {
    const { auth } = usePage<any>().props;
    const userName = auth?.user?.name || 'Student';
    const userCourse = auth?.user?.course || 'Student';

    const [activeTab, setActiveTab] = useState<'All' | 'Events'>('All');
    const [items, setItems] = useState<SavedItem[]>(savedItems);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    const filteredItems = items.filter(item => activeTab === 'All' || item.category === 'Event');

    const handleRemove = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        setItems(items.filter(item => item.id !== id));
        router.delete(`/client/saved/${id}`, { preserveScroll: true, showProgress: false });
    };

    // Navigation Links
    const navLinks = [
        { href: '/client', label: 'Home', icon: 'fa-solid fa-house', active: false },
        { href: '/client/announcements', label: 'Announcements', icon: 'fa-solid fa-bullhorn', active: false },
        { href: '/client/events', label: 'Events', icon: 'fa-regular fa-calendar', active: false },
        { href: '/client/saved', label: 'Saved', icon: 'fa-regular fa-bookmark', active: true },
    ];

    return (
        <>
            <Head title="Saved | COTIFY" />
            
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
                                <img src="/images/3rdLogo.png" alt="Cotify Logo" className="w-20 h-20 sm:w-28 sm:h-28 object-contain -ml-4 sm:-ml-6 -mr-6 sm:-mr-8"  />
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
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Saved</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button aria-label="View notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-ctu-lightblue hover:bg-slate-50 transition-colors shadow-sm">
                                <i className="fa-regular fa-bell text-lg"></i>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm border border-white animate-pop-in">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="max-w-4xl mx-auto animate-slide-up">
                            
                            {/* PAGE HEADER & TABS */}
                            <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                                <div>
                                    <p className="mt-2 text-base text-slate-500">
                                        {items.length} {items.length === 1 ? 'item' : 'items'} kept for later.
                                    </p>
                                </div>
                                
                                <div className="flex w-fit rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                                    <button 
                                        onClick={() => setActiveTab('All')}
                                        aria-pressed={activeTab === 'All'}
                                        className={`rounded-md px-5 py-1.5 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            activeTab === 'All' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        All
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('Events')}
                                        aria-pressed={activeTab === 'Events'}
                                        className={`rounded-md px-5 py-1.5 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            activeTab === 'Events' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        Events
                                    </button>
                                </div>
                            </div>

                            {/* LIST */}
                            {filteredItems.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center animate-fade-in">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                                        <i className="fa-regular fa-bookmark text-2xl text-slate-300" aria-hidden="true"></i>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">Nothing else saved</h3>
                                    <p className="mt-2 text-base text-slate-500 flex items-center justify-center gap-1.5">
                                        Tap <i className="fa-regular fa-bookmark text-slate-400"></i> on any announcement to keep it here.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-fade-in">
                                    {filteredItems.map((item) => (
                                        <div 
                                            key={item.id}
                                            className="group relative flex items-center gap-4 border-b border-slate-100 p-4 transition-colors last:border-0 hover:bg-slate-50 sm:p-5"
                                        >
                                            {/* Clickable Area */}
                                            <Link 
                                                href={item.link}
                                                className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                                aria-label={`View saved item: ${item.title}`}
                                            />

                                            {/* Icon/Thumbnail */}
                                            <div className="pointer-events-none flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                                {item.category === 'Event' ? (
                                                    <i className="fa-regular fa-calendar text-2xl text-slate-300"></i>
                                                ) : (
                                                    <i className="fa-regular fa-newspaper text-2xl text-slate-300"></i>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="pointer-events-none min-w-0 flex-1 pr-12">
                                                <h3 className="truncate text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 truncate text-sm font-medium text-slate-500">
                                                    {item.subtitle}
                                                </p>
                                            </div>

                                            {/* Remove Action (Rule: Text link style) */}
                                            <button 
                                                onClick={(e) => handleRemove(e, item.id)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-sm font-bold text-slate-400 transition-colors hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                                                aria-label={`Remove ${item.title} from saved`}
                                            >
                                                Remove
                                            </button>
                                        </div>
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