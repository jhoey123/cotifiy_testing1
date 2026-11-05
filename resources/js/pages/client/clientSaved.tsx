import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ClientNotificationDropdown from './ClientNotificationDropdown';

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
    user = { name: 'Juan' }
}: ClientSavedProps) {
    const { auth } = usePage<any>().props;
    const userName = auth?.user?.name || user.name;
    
    const [activeTab, setActiveTab] = useState<'All' | 'Events'>('All');
    const [items, setItems] = useState<SavedItem[]>(savedItems);

    const filteredItems = items.filter(item => activeTab === 'All' || item.category === 'Event');

    const handleRemove = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        setItems(items.filter(item => item.id !== id));
        router.delete(`/client/saved/${id}`, { preserveScroll: true, showProgress: false });
    };

    return (
        <>
            <Head title="Saved | COTIFY" />
            
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

                {/* DARK HEADER */}
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
                                        className="rounded-md px-1 text-sm font-semibold text-slate-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/client/announcements"
                                        className="rounded-md px-1 text-sm font-semibold text-slate-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Announcements
                                    </Link>
                                    <Link
                                        href="/client/events"
                                        className="rounded-md px-1 text-sm font-semibold text-slate-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Events
                                    </Link>
                                    <Link
                                        href="/client/saved"
                                        className="border-ctu-lightblue rounded-t-md border-b-2 px-1 pb-1 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Saved
                                    </Link>
                                </nav>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4">
                                <ClientNotificationDropdown />

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

                <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8 animate-slide-up">
                    
                    {/* PAGE HEADER & TABS */}
                    <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900">Saved</h1>
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
                </main>

                {/* FOOTER */}
                <footer className="bg-ctu-dark relative z-10 mt-auto border-t border-slate-800 py-6 text-white">
                    <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-400">
                                &copy; {new Date().getFullYear()} Cotify · College of Technology
                            </p>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-semibold text-slate-400">
                            <a href="#" className="rounded transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">About</a>
                            <a href="#" className="rounded transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">Contact</a>
                            <a href="#" className="rounded transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">Privacy</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}