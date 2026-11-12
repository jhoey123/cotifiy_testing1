import { Form, Head, Link, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AnnouncementPage, { type Announcement } from '../announcementpage';
import StaffSidebar from '../staff/StaffSidebar';

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

type AnnouncementComment = {
    announcement_id: number;
    messages: DiscussionMessage[];
};

const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});

export default function AdminAnnouncements({
    announcements = [],
    discussions = [],
    announcementComments = [],
    staffMode = false,
    staffName = '',
    staffId,
    adminId,
}: {
    announcements: Announcement[];
    discussions: Discussion[];
    announcementComments: AnnouncementComment[];
    staffMode?: boolean;
    staffName?: string;
    staffId?: number;
    adminId?: number;
}) {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isDeletingAnnouncement, setIsDeletingAnnouncement] = useState(false);
    const [selectedImageName, setSelectedImageName] = useState('');
    const [selectedAttachmentNames, setSelectedAttachmentNames] = useState<string[]>([]);
    const [removedAttachmentPaths, setRemovedAttachmentPaths] = useState<string[]>([]);
    const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Editor State
    const [selectedCategory, setSelectedCategory] = useState('Academic');
    
    // Table State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);
    const [activeTab, setActiveTab] = useState('My Posts');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const panelBase = staffMode ? '/staff' : '/admin';
    const tabs = [
        ...(staffMode ? [{
            label: 'My Posts',
            count: announcements.filter((announcement) => announcement.author_staff_id === staffId).length,
        }] : []),
        ...(!staffMode ? [{
            label: 'My Posts',
            count: announcements.filter((announcement) => announcement.author_admin_id === adminId).length,
        }] : []),
        { label: 'All', count: announcements.length },
        { label: 'Drafts', count: 2 },
        { label: 'Archived', count: 3 },
    ];

    // Filtering Logic
    const filteredAnnouncements = announcements.filter((ann) => {
        const matchesTab = activeTab === 'My Posts'
            ? staffMode
                ? ann.author_staff_id === staffId
                : ann.author_admin_id === adminId
            : activeTab === 'All' || ann.status === activeTab;
        const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || ann.category === categoryFilter;
        return matchesTab && matchesSearch && matchesCategory;
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
        setSelectedImageName('');
        setSelectedAttachmentNames([]);
        setRemovedAttachmentPaths([]);
        setIsEditorOpen(true);
    };

    const insertMarkdown = (prefix: string, suffix = '', placeholder = 'text') => {
        const textarea = bodyTextareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.slice(start, end);
        const insertedText = selectedText || placeholder;
        textarea.setRangeText(`${prefix}${insertedText}${suffix}`, start, end, 'select');
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + insertedText.length);
    };

    const prefixMarkdownLines = (prefix: string, ordered = false) => {
        const textarea = bodyTextareaRef.current;
        if (!textarea) return;

        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        if (start === end) {
            start = textarea.value.lastIndexOf('\n', start - 1) + 1;
            end = start;
        }

        const selectedText = textarea.value.slice(start, end);
        const lines = selectedText ? selectedText.split('\n') : [''];
        const insertedText = lines
            .map((line, index) => `${ordered ? `${index + 1}.` : prefix}${ordered ? ' ' : ''}${line}`)
            .join('\n');

        textarea.setRangeText(insertedText, start, end, 'end');
        textarea.focus();
    };

    return (
        <>
            <Head title={`Announcements | Cotify ${staffMode ? 'Staff' : 'Admin'}`} />
            
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
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

                {staffMode ? (
                    <StaffSidebar
                        activePage="announcements"
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        userName={staffName}
                    />
                ) : (
                    <>
                <aside 
                    className={`bg-ctu-dark flex flex-col justify-between shrink-0 absolute md:relative z-40 h-full transition-transform duration-300 shadow-2xl w-64 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
                >
                    <div className="flex-1 overflow-y-auto no-scrollbar w-64">
                        <div className="p-6 flex items-center">
                            <img src="/images/3rdLogo.png" alt="Cotify Logo" className="w-16 h-16 object-contain -ml-2 -mr-4" />
                            <div className="text-white">
                                <h1 className="font-extrabold text-xl leading-tight tracking-tight">Cotify</h1>
                                {staffMode && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Staff Portal</p>}
                            </div>
                        </div>

                        <nav className="mt-2 space-y-6 px-3">
                            <div>
                                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Main</p>
                                <Link href={panelBase} className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-solid fa-house w-5 text-center group-hover:scale-110 transition-transform"></i> Dashboard
                                </Link>
                                <Link href={`${panelBase}/announcements`} className="mt-1 flex items-center gap-3 px-3 py-2.5 bg-ctu-lightblue text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-900/30">
                                    <i className="fa-solid fa-bullhorn w-5 text-center"></i> Announcements
                                </Link>
                                <Link href={`${panelBase}/events`} className="mt-1 flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-regular fa-calendar w-5 text-center group-hover:scale-110 transition-transform"></i> Events
                                </Link>
                            </div>

                            {!staffMode && <div>
                                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">People</p>
                                <Link href="/admin/users" prefetch="mount" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-solid fa-users w-5 text-center group-hover:scale-110 transition-transform"></i> Students
                                </Link>
                                <Link href="/admin/staff" prefetch="mount" className="mt-1 flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-solid fa-user-shield w-5 text-center group-hover:scale-110 transition-transform"></i> Staff & Admins
                                </Link>
                            </div>}

                            <div>
                                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">System</p>
                                <Link href={`${panelBase}/settings`} prefetch="mount" className="mt-1 flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
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
                                <p className="text-white text-sm font-bold">{staffMode ? staffName : 'Admin'}</p>
                                <p className="text-slate-400 text-[11px] font-medium">Registrar's Office</p>
                            </div>
                        </div> 
                        <Form method="post" action={`${panelBase}/logout`}>
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
                    </>
                )}

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative w-full z-10">
                    
                    {/* TOP BAR */}
                    <header className="h-20 bg-transparent border-b border-slate-200/50 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle sidebar" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors md:hidden">
                                <i className="fa-solid fa-bars"></i>
                            </button>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Manage Announcements</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button aria-label="View notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-ctu-lightblue hover:bg-slate-50 transition-colors shadow-sm">
                                <i className="fa-regular fa-bell text-lg"></i>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            </button>

                            <button 
                                type="button" 
                                onClick={() => openEditor()} 
                                className="bg-ctu-dark hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 shrink-0"
                            >
                                <i className="fa-solid fa-plus"></i> <span className="hidden sm:inline">New announcement</span>
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        
                        <div className="max-w-[1200px] mx-auto animate-fade-up">
                            
                            {/* PAGE TITLE & TABS */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">Announcements</h1>
                                
                                <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.label}
                                            onClick={() => setActiveTab(tab.label)}
                                            className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${
                                                activeTab === tab.label ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                        >
                                            <span className={activeTab === tab.label ? 'border-b-2 border-slate-900 pb-3 -mb-3' : ''}>
                                                {tab.label}
                                            </span>
                                            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{tab.count}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SEARCH & FILTERS */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <div className="relative flex-1 min-w-[200px] max-w-xs">
                                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                    <input 
                                        type="text" 
                                        placeholder="Search announcements..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        aria-label="Search announcements"
                                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 text-slate-800 rounded-lg text-sm focus:border-ctu-lightblue outline-none shadow-sm"
                                    />
                                </div>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    aria-label="Filter announcements by category"
                                    className="min-w-[160px] px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm focus:border-ctu-lightblue outline-none shadow-sm"
                                >
                                    <option value="All">All categories</option>
                                    <option value="Academic">Academic</option>
                                    <option value="General">General</option>
                                    <option value="Event">Event</option>
                                    <option value="Service">Service</option>
                                </select>
                            </div>

                            {/* TABLE */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible mb-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[900px]">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold bg-slate-50/50">
                                                <th className="px-4 py-3 w-10">
                                                    <input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === filteredAnnouncements.length && filteredAnnouncements.length > 0} className="rounded border-slate-300 cursor-pointer" />
                                                </th>
                                                <th className="px-4 py-3">Title</th>
                                                <th className="px-4 py-3">Category</th>
                                                <th className="px-4 py-3">Audience</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Date</th>
                                                {!staffMode && <th className="px-4 py-3 text-right">Actions</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAnnouncements.map((announcement: any) => (
                                                <tr key={announcement.id} className="text-sm text-slate-700 hover:bg-slate-50 transition-colors group">
                                                    <td className="px-4 py-4">
                                                        <input type="checkbox" checked={selectedRows.includes(announcement.id)} onChange={() => handleSelectRow(announcement.id)} className="rounded border-slate-300 cursor-pointer" />
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedAnnouncement(announcement)}
                                                            className="line-clamp-1 text-left font-bold text-slate-900 transition-colors hover:text-ctu-lightblue focus:outline-none focus-visible:ring-2 focus-visible:ring-ctu-lightblue rounded"
                                                        >
                                                            {announcement.title}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="border border-slate-200 bg-slate-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{announcement.category}</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs font-semibold">{announcement.audience || 'All'}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${announcement.status === 'Scheduled' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-800'}`}>
                                                            {announcement.status || 'Published'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs">{formatDate(announcement.date)}</td>
                                                    {!staffMode && (
                                                        <td className="px-4 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => openEditor(announcement)} className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold hover:bg-slate-50">Edit</button>
                                                                <button onClick={() => setAnnouncementToDelete(announcement)} className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 hover:bg-rose-50 text-rose-600"><i className="fa-solid fa-trash"></i></button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {selectedAnnouncement && (
                    <AnnouncementPage
                        announcement={selectedAnnouncement}
                        discussions={discussions.filter((discussion) => discussion.announcement_id === selectedAnnouncement.id)}
                        announcementComments={announcementComments
                            .filter((comment) => comment.announcement_id === selectedAnnouncement.id)
                            .flatMap((comment) => comment.messages)}
                        staffMode={staffMode}
                        onClose={() => setSelectedAnnouncement(null)}
                    />
                )}

                {/* REDESIGNED ANNOUNCEMENT EDITOR MODAL */}
                {isEditorOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 sm:p-6 animate-fade-in" role="dialog" aria-modal="true">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[1100px] h-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
                            
                            <Form 
                                method="post" 
                                action={editingAnnouncement ? `${panelBase}/announcements/${editingAnnouncement.id}` : `${panelBase}/announcements`}
                                onSuccess={() => setIsEditorOpen(false)} 
                                className="flex flex-col h-full"
                            >
                                {({ errors, processing }) => (
                                    <>
                                    {editingAnnouncement && <input type="hidden" name="_method" value="put" />}

                                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
                                        <div className="flex items-center gap-4">
                                            <button type="button" onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-slate-700">
                                                <i className="fa-solid fa-arrow-left"></i>
                                            </button>
                                            <h2 className="text-xl font-bold text-slate-900">
                                                {editingAnnouncement ? 'Edit announcement' : 'New announcement'}
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button type="submit" disabled={processing} className="px-4 py-2 bg-ctu-dark hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50">
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
                                                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:border-ctu-lightblue focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                                                />
                                                {errors.title && <p className="mt-1 text-xs font-bold text-red-600">{errors.title}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="body" className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                                                    Details <span className="text-rose-500">*</span>
                                                </label>
                                                <div className="border border-slate-300 rounded-lg overflow-hidden flex flex-col focus-within:border-ctu-lightblue focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                                                    <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-slate-50 border-b border-slate-200 text-slate-500">
                                                        <button type="button" aria-label="Bold" title="Bold" onClick={() => insertMarkdown('**', '**')} className="font-bold hover:text-slate-800">B</button>
                                                        <button type="button" aria-label="Italic" title="Italic" onClick={() => insertMarkdown('*', '*')} className="italic hover:text-slate-800">I</button>
                                                        <button type="button" aria-label="Heading" title="Heading" onClick={() => prefixMarkdownLines('## ')} className="font-bold hover:text-slate-800">H</button>
                                                        <div className="w-px h-4 bg-slate-300"></div>
                                                        <button type="button" aria-label="Bulleted list" title="Bulleted list" onClick={() => prefixMarkdownLines('- ')} className="flex items-center gap-1 text-sm hover:text-slate-800"><i className="fa-solid fa-list-ul"></i></button>
                                                        <button type="button" aria-label="Numbered list" title="Numbered list" onClick={() => prefixMarkdownLines('', true)} className="flex items-center gap-1 text-sm hover:text-slate-800"><i className="fa-solid fa-list-ol"></i></button>
                                                        <button type="button" aria-label="Blockquote" title="Blockquote" onClick={() => prefixMarkdownLines('> ')} className="flex items-center text-sm hover:text-slate-800"><i className="fa-solid fa-quote-left"></i></button>
                                                        <div className="w-px h-4 bg-slate-300"></div>
                                                        <button type="button" aria-label="Link" title="Link" onClick={() => insertMarkdown('[', '](https://example.com)', 'link text')} className="flex items-center gap-1 text-sm hover:text-slate-800"><i className="fa-solid fa-link"></i></button>
                                                    </div>
                                                    <textarea 
                                                        id="body" 
                                                        name="body" 
                                                        ref={bodyTextareaRef}
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
                                                <label className="flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden group">
                                                    {selectedImageName ? (
                                                        <p className="p-4 text-sm font-bold text-slate-700 text-center break-all">{selectedImageName}</p>
                                                    ) : editingAnnouncement?.image_url ? (
                                                        <img src={editingAnnouncement.image_url} alt="Announcement cover" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <p className="text-sm font-bold text-slate-700 mb-1">Choose an image</p>
                                                            <p className="text-[10px] text-slate-500">JPG, PNG, GIF or WebP · up to 5 MB</p>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                                        onChange={(event) => setSelectedImageName(event.currentTarget.files?.[0]?.name ?? '')}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </label>
                                                {errors.image && <p className="mt-1 text-xs font-bold text-red-600">{errors.image}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="attachments" className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                                                    Downloadable documents
                                                </label>
                                                <input
                                                    id="attachments"
                                                    type="file"
                                                    name="attachments[]"
                                                    multiple
                                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.odt,.ods,.odp"
                                                    onChange={(event) => setSelectedAttachmentNames(Array.from(event.currentTarget.files ?? [], (file) => file.name))}
                                                    className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                                <p className="mt-1 text-[10px] text-slate-500">PDF, Office, OpenDocument, TXT or CSV · up to 10 MB each</p>
                                                {selectedAttachmentNames.length > 0 && (
                                                    <ul className="mt-2 space-y-1">
                                                        {selectedAttachmentNames.map((name, index) => (
                                                            <li key={`${name}-${index}`} className="break-all text-xs font-medium text-slate-700">{name}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {editingAnnouncement?.attachments?.filter(({ path }) => !removedAttachmentPaths.includes(path)).map((attachment) => (
                                                    <div key={attachment.path} className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                                                        <a href={attachment.url} target="_blank" rel="noreferrer" className="min-w-0 break-all text-xs font-semibold text-blue-700 hover:underline">
                                                            {attachment.name}
                                                        </a>
                                                        <button
                                                            type="button"
                                                            onClick={() => setRemovedAttachmentPaths((paths) => [...paths, attachment.path])}
                                                            className="shrink-0 text-xs font-bold text-rose-600 hover:text-rose-800"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                                {removedAttachmentPaths.map((path) => (
                                                    <input key={path} type="hidden" name="remove_attachments[]" value={path} />
                                                ))}
                                                {errors.attachments && <p className="mt-1 text-xs font-bold text-red-600">{errors.attachments}</p>}
                                                {Object.entries(errors)
                                                    .filter(([key]) => key.startsWith('attachments.'))
                                                    .map(([key, error]) => (
                                                        <p key={key} className="mt-1 text-xs font-bold text-red-600">{error}</p>
                                                    ))}
                                            </div>
                                        </div>

                                        <div className="w-full md:w-[320px] bg-slate-50/50 p-6 space-y-6 shrink-0">
                                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                                <label htmlFor="category" className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                                                    Category <span className="text-rose-500">*</span>
                                                </label>
                                                <select
                                                    id="category"
                                                    name="category"
                                                    required
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium mb-4 focus:outline-none focus:border-ctu-lightblue"
                                                >
                                                    <option value="Academic">Academic</option>
                                                    <option value="General">General</option>
                                                    {editingAnnouncement?.category === 'Event' && <option value="Event">Event</option>}
                                                    <option value="Service">Service</option>
                                                </select>
                                                {errors.category && <p className="mb-3 text-xs font-bold text-red-600">{errors.category}</p>}

                                                <label htmlFor="posted_by" className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                                                    Posted by <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    id="posted_by"
                                                    type="text"
                                                    name="posted_by"
                                                    defaultValue={editingAnnouncement?.posted_by ?? "Registrar's Office"}
                                                    required
                                                    maxLength={255}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-ctu-lightblue"
                                                />
                                                {errors.posted_by && <p className="mt-1 text-xs font-bold text-red-600">{errors.posted_by}</p>}
                                            </div>

                                            {selectedCategory === 'Event' && (
                                                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                                                    <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                                                        Event details
                                                    </h4>
                                                    <div>
                                                        <label htmlFor="event_date" className="block text-xs font-bold text-slate-700 mb-1">
                                                            Start date <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            id="event_date"
                                                            type="date"
                                                            name="event_date"
                                                            defaultValue={editingAnnouncement?.event_date ?? ''}
                                                            required
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                        />
                                                        {errors.event_date && <p className="mt-1 text-xs font-bold text-red-600">{errors.event_date}</p>}
                                                    </div>
                                                    <div>
                                                        <label htmlFor="event_end_date" className="block text-xs font-bold text-slate-700 mb-1">
                                                            End date <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            id="event_end_date"
                                                            type="date"
                                                            name="event_end_date"
                                                            min={editingAnnouncement?.event_date ?? undefined}
                                                            defaultValue={editingAnnouncement?.event_end_date ?? editingAnnouncement?.event_date ?? ''}
                                                            required
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                        />
                                                        {errors.event_end_date && <p className="mt-1 text-xs font-bold text-red-600">{errors.event_end_date}</p>}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label htmlFor="start_time" className="block text-xs font-bold text-slate-700 mb-1">Start time</label>
                                                            <input
                                                                id="start_time"
                                                                type="time"
                                                                name="start_time"
                                                                defaultValue={editingAnnouncement?.start_time?.slice(0, 5) ?? ''}
                                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                            />
                                                            {errors.start_time && <p className="mt-1 text-xs font-bold text-red-600">{errors.start_time}</p>}
                                                        </div>
                                                        <div>
                                                            <label htmlFor="end_time" className="block text-xs font-bold text-slate-700 mb-1">End time</label>
                                                            <input
                                                                id="end_time"
                                                                type="time"
                                                                name="end_time"
                                                                defaultValue={editingAnnouncement?.end_time?.slice(0, 5) ?? ''}
                                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                            />
                                                            {errors.end_time && <p className="mt-1 text-xs font-bold text-red-600">{errors.end_time}</p>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="location" className="block text-xs font-bold text-slate-700 mb-1">
                                                            Location <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            id="location"
                                                            type="text"
                                                            name="location"
                                                            defaultValue={editingAnnouncement?.location ?? ''}
                                                            required
                                                            maxLength={255}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
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
                                <button onClick={() => setAnnouncementToDelete(null)} className="flex-1 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Cancel</button>
                                <button onClick={() => {
                                    setIsDeletingAnnouncement(true);
                                    router.post(`${panelBase}/announcements/${announcementToDelete.id}`, { _method: 'delete' }, {
                                        onSuccess: () => setAnnouncementToDelete(null),
                                        onFinish: () => setIsDeletingAnnouncement(false),
                                    });
                                }} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 disabled:opacity-60">
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