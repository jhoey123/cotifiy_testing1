import { Form, Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Announcement = {
    id: number;
    title: string;
    category: 'Academic' | 'Event' | 'General' | 'Service';
    body: string;
    status?: string;
    date: string;
    posted_by: string;
    is_pinned?: boolean;
    image_url?: string | null;
    event_date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    location?: string | null;
};

type DiscussionMessage = {
    id: number;
    parent_message_id: number | null;
    author: string;
    role: 'Client' | 'Admin' | 'Staff';
    content: string;
    sent_at: string | null;
};

type Discussion = {
    id: number;
    announcement_id: number;
    announcement_title: string;
    client_name: string;
    messages: DiscussionMessage[];
};

const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});

export default function StaffAnnouncements({
    announcements = [],
    discussions = [],
    userName = 'Staff User',
    userCourse = 'BSIT',
}: {
    announcements: Announcement[];
    discussions: Discussion[];
    userName?: string;
    userCourse?: string;
}) {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
    const [isDeletingAnnouncement, setIsDeletingAnnouncement] = useState(false);
    
    // Editor State
    const [selectedCategory, setSelectedCategory] = useState('Academic');
    
    // Table & Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // Filtering Logic
    const filteredAnnouncements = announcements.filter((ann) => {
        const matchesTab = activeTab === 'All' || ann.status === activeTab;
        const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedRows(filteredAnnouncements.map(a => a.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id: number) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const openEditor = (announcement: Announcement | null = null) => {
        setEditingAnnouncement(announcement);
        setSelectedCategory(announcement?.category || 'Academic');
        setIsEditorOpen(true);
    };

    // Navigation Links
    const navLinks = [
        { href: '/staff', label: 'Home', icon: 'fa-solid fa-house', active: false },
        { href: '/staff/announcements', label: 'Announcements', icon: 'fa-solid fa-bullhorn', active: true },
        { href: '/staff/events', label: 'Events', icon: 'fa-regular fa-calendar', active: false },
        { href: '/staff/saved', label: 'Saved', icon: 'fa-regular fa-bookmark', active: false },
    ];

    return (
        <>
            <Head title="My Announcements | Cotify Staff" />
            
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
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">My Announcements</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative w-64 hidden md:block group">
                                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-ctu-lightblue transition-colors"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search announcements..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2 bg-slate-100 border border-transparent text-slate-800 rounded-xl text-sm focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-slate-400 font-medium" 
                                />
                            </div>

                            <button aria-label="View notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-ctu-lightblue hover:bg-slate-50 transition-colors shadow-sm">
                                <i className="fa-regular fa-bell text-lg"></i>
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        
                        <div className="max-w-[1200px] mx-auto animate-fade-up">
                            
                            {/* STATS & HIGHLIGHTS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-blue-600 mb-1 uppercase tracking-wider">Total Posts</p>
                                        <h3 className="text-3xl font-extrabold text-slate-900">{announcements.length}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <i className="fa-solid fa-bullhorn text-xl"></i>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-emerald-600 mb-1 uppercase tracking-wider">Published</p>
                                        <h3 className="text-3xl font-extrabold text-slate-900">{announcements.filter(a => a.status !== 'Draft' && a.status !== 'Scheduled').length}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <i className="fa-solid fa-check-circle text-xl"></i>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-amber-600 mb-1 uppercase tracking-wider">Drafts</p>
                                        <h3 className="text-3xl font-extrabold text-slate-900">{announcements.filter(a => a.status === 'Draft').length}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                        <i className="fa-regular fa-file-lines text-xl"></i>
                                    </div>
                                </div>
                            </div>

                            {/* TABS & NEW ANNOUNCEMENT BUTTON */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-3">
                                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                                    {[
                                        { label: 'All', count: announcements.length },
                                        { label: 'Published', count: announcements.filter(a => a.status !== 'Draft' && a.status !== 'Scheduled').length },
                                        { label: 'Scheduled', count: announcements.filter(a => a.status === 'Scheduled').length },
                                        { label: 'Drafts', count: announcements.filter(a => a.status === 'Draft').length },
                                    ].map((tab) => (
                                        <button
                                            key={tab.label}
                                            onClick={() => setActiveTab(tab.label)}
                                            className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${
                                                activeTab === tab.label ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                        >
                                            <span className={activeTab === tab.label ? 'border-b-2 border-blue-600 pb-3 -mb-3' : ''}>
                                                {tab.label}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === tab.label ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {tab.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    type="button" 
                                    onClick={() => openEditor()} 
                                    className="bg-ctu-dark hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 shrink-0"
                                >
                                    <i className="fa-solid fa-plus"></i> New announcement
                                </button>
                            </div>

                            {/* SEARCH & FILTERS */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <div className="relative flex-1 min-w-[200px] max-w-xs">
                                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                    <input 
                                        type="text" 
                                        placeholder="Search my announcements..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        aria-label="Search my announcements"
                                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 text-slate-800 rounded-lg text-sm focus:border-ctu-lightblue outline-none shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* TABLE */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[900px]">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold bg-slate-50">
                                                <th className="px-4 py-4 w-10">
                                                    <input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === filteredAnnouncements.length && filteredAnnouncements.length > 0} className="rounded border-slate-300 cursor-pointer text-blue-600 focus:ring-blue-500" />
                                                </th>
                                                <th className="px-4 py-4">Title</th>
                                                <th className="px-4 py-4">Category</th>
                                                <th className="px-4 py-4">Status</th>
                                                <th className="px-4 py-4">Date</th>
                                                <th className="px-4 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAnnouncements.map((announcement) => (
                                                <tr key={announcement.id} className="text-sm text-slate-700 hover:bg-slate-50/80 transition-colors group">
                                                    <td className="px-4 py-4">
                                                        <input type="checkbox" checked={selectedRows.includes(announcement.id)} onChange={() => handleSelectRow(announcement.id)} className="rounded border-slate-300 cursor-pointer text-blue-600 focus:ring-blue-500" />
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                            {announcement.title}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`border px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                                            announcement.category === 'Academic' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                                            announcement.category === 'Event' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                                                            announcement.category === 'Service' ? 'border-purple-200 bg-purple-50 text-purple-700' :
                                                            'border-slate-200 bg-slate-50 text-slate-700'
                                                        }`}>
                                                            {announcement.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                                                            announcement.status === 'Scheduled' ? 'border-amber-200 bg-amber-50 text-amber-700' : 
                                                            announcement.status === 'Draft' ? 'border-slate-300 bg-slate-100 text-slate-600' :
                                                            'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                                announcement.status === 'Scheduled' ? 'bg-amber-500' : 
                                                                announcement.status === 'Draft' ? 'bg-slate-500' :
                                                                'bg-emerald-500'
                                                            }`}></span>
                                                            {announcement.status || 'Published'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs font-medium text-slate-500">{formatDate(announcement.date)}</td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => openEditor(announcement)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Edit">
                                                                <i className="fa-solid fa-pen text-xs"></i>
                                                            </button>
                                                            <button onClick={() => setAnnouncementToDelete(announcement)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Delete">
                                                                <i className="fa-solid fa-trash text-xs"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* ANNOUNCEMENT EDITOR MODAL */}
                {isEditorOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 sm:p-6 animate-fade-in" role="dialog" aria-modal="true">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1100px] h-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
                            
                            <Form 
                                method="post" 
                                action={editingAnnouncement ? `/staff/announcements/${editingAnnouncement.id}` : '/staff/announcements'} 
                                onSuccess={() => setIsEditorOpen(false)} 
                                className="flex flex-col h-full"
                            >
                                {({ errors, processing }) => (
                                    <>
                                    {editingAnnouncement && <input type="hidden" name="_method" value="put" />}

                                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
                                        <div className="flex items-center gap-4">
                                            <button type="button" onClick={() => setIsEditorOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                                                <i className="fa-solid fa-arrow-left text-sm"></i>
                                            </button>
                                            <h2 className="text-xl font-bold text-slate-900">
                                                {editingAnnouncement ? 'Edit announcement' : 'New announcement'}
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button type="submit" disabled={processing} className="px-5 py-2.5 bg-ctu-dark hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 shadow-md">
                                                {processing ? 'Saving...' : editingAnnouncement ? 'Save changes' : 'Publish'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto flex flex-col md:flex-row bg-white">
                                        <div className="flex-1 p-6 space-y-6 md:border-r border-slate-200">
                                            <div>
                                                <label htmlFor="title" className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                                                    Title <span className="text-rose-500">*</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    id="title" 
                                                    name="title" 
                                                    defaultValue={editingAnnouncement?.title ?? ''} 
                                                    required
                                                    placeholder="Midterm Exam Schedule, 1st Semester"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                                                />
                                                {errors.title && <p className="mt-1 text-xs font-bold text-red-600">{errors.title}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="body" className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                                                    Details <span className="text-rose-500">*</span>
                                                </label>
                                                <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col focus-within:border-ctu-lightblue focus-within:ring-4 focus-within:ring-blue-500/10 transition-all bg-slate-50">
                                                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 border-b border-slate-200 text-slate-500">
                                                        <button type="button" className="font-bold hover:text-slate-800">B</button>
                                                        <button type="button" className="italic hover:text-slate-800">I</button>
                                                        <div className="w-px h-4 bg-slate-300"></div>
                                                        <button type="button" className="flex items-center gap-1 text-sm hover:text-slate-800"><i className="fa-solid fa-list-ul"></i> 1. List</button>
                                                        <div className="w-px h-4 bg-slate-300"></div>
                                                        <button type="button" className="flex items-center gap-1 text-sm hover:text-slate-800"><i className="fa-solid fa-link"></i> Link</button>
                                                    </div>
                                                    <textarea 
                                                        id="body" 
                                                        name="body" 
                                                        defaultValue={editingAnnouncement?.body ?? ''} 
                                                        required 
                                                        rows={8} 
                                                        className="w-full p-4 text-sm focus:outline-none resize-none bg-white" 
                                                        placeholder="Write the announcement details..."
                                                    />
                                                </div>
                                                {errors.body && <p className="mt-1 text-xs font-bold text-red-600">{errors.body}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Cover image</label>
                                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden group">
                                                    {editingAnnouncement?.image_url ? (
                                                        <img src={editingAnnouncement.image_url} alt="Announcement cover" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <p className="text-sm font-bold text-slate-700 mb-1">Choose an image</p>
                                                            <p className="text-[10px] text-slate-500">JPG, PNG, GIF or WebP · up to 5 MB</p>
                                                        </div>
                                                    )}
                                                    <input type="file" name="image" accept="image/jpeg,image/png,image/gif,image/webp" className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </label>
                                                {errors.image && <p className="mt-1 text-xs font-bold text-red-600">{errors.image}</p>}
                                            </div>
                                        </div>

                                        <div className="w-full md:w-[320px] bg-slate-50/50 p-6 space-y-6 shrink-0">
                                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                                <label htmlFor="category" className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                                                    Category <span className="text-rose-500">*</span>
                                                </label>
                                                <select
                                                    id="category"
                                                    name="category"
                                                    required
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium mb-4 focus:bg-white focus:outline-none focus:border-ctu-lightblue transition-all"
                                                >
                                                    <option value="Academic">Academic</option>
                                                    <option value="General">General</option>
                                                    <option value="Event">Event</option>
                                                    <option value="Service">Service</option>
                                                </select>
                                                {errors.category && <p className="mb-3 text-xs font-bold text-red-600">{errors.category}</p>}
                                            </div>

                                            {selectedCategory === 'Event' && (
                                                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                                                    <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                                                        Event details
                                                    </h4>
                                                    <div>
                                                        <label htmlFor="event_date" className="block text-xs font-bold text-slate-700 mb-1.5">
                                                            Event date <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            id="event_date"
                                                            type="date"
                                                            name="event_date"
                                                            defaultValue={editingAnnouncement?.event_date ?? ''}
                                                            required
                                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-ctu-lightblue transition-all"
                                                        />
                                                        {errors.event_date && <p className="mt-1 text-xs font-bold text-red-600">{errors.event_date}</p>}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label htmlFor="start_time" className="block text-xs font-bold text-slate-700 mb-1.5">Start time</label>
                                                            <input
                                                                id="start_time"
                                                                type="time"
                                                                name="start_time"
                                                                defaultValue={editingAnnouncement?.start_time?.slice(0, 5) ?? ''}
                                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-ctu-lightblue transition-all"
                                                            />
                                                            {errors.start_time && <p className="mt-1 text-xs font-bold text-red-600">{errors.start_time}</p>}
                                                        </div>
                                                        <div>
                                                            <label htmlFor="end_time" className="block text-xs font-bold text-slate-700 mb-1.5">End time</label>
                                                            <input
                                                                id="end_time"
                                                                type="time"
                                                                name="end_time"
                                                                defaultValue={editingAnnouncement?.end_time?.slice(0, 5) ?? ''}
                                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-ctu-lightblue transition-all"
                                                            />
                                                            {errors.end_time && <p className="mt-1 text-xs font-bold text-red-600">{errors.end_time}</p>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="location" className="block text-xs font-bold text-slate-700 mb-1.5">
                                                            Location <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            id="location"
                                                            type="text"
                                                            name="location"
                                                            defaultValue={editingAnnouncement?.location ?? ''}
                                                            required
                                                            maxLength={255}
                                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-ctu-lightblue transition-all"
                                                        />
                                                        {errors.location && <p className="mt-1 text-xs font-bold text-red-600">{errors.location}</p>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {announcementToDelete && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 animate-scale-in text-center">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mx-auto mb-5">
                                <i className="fa-solid fa-triangle-exclamation text-red-500 text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Delete Announcement</h3>
                            <p className="text-sm font-medium text-slate-500 mb-8">Are you sure you want to delete <strong className="text-slate-800">“{announcementToDelete.title}”</strong>?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setAnnouncementToDelete(null)} className="flex-1 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                                <button onClick={() => {
                                    setIsDeletingAnnouncement(true);
                                    router.post(`/staff/announcements/${announcementToDelete.id}`, { _method: 'delete' }, {
                                        onSuccess: () => setAnnouncementToDelete(null),
                                        onFinish: () => setIsDeletingAnnouncement(false),
                                    });
                                }} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 disabled:opacity-60 transition-colors">
                                    {isDeletingAnnouncement ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}