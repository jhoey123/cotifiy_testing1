import { Form, Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AnnouncementPage, { type Announcement } from '../announcementpage';

type DiscussionMessage = {
    id: number;
    parent_message_id: number | null;
    author: string;
    role: 'Client' | 'Admin';
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

export default function AdminAnnouncements({
    announcements = [],
    discussions = [],
}: {
    announcements: Announcement[];
    discussions: Discussion[];
}) {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isDeletingAnnouncement, setIsDeletingAnnouncement] = useState(false);
    
    // Editor State
    const [selectedCategory, setSelectedCategory] = useState('Academic');
    const [isUrgent, setIsUrgent] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [publishType, setPublishType] = useState<'now' | 'schedule'>('now');
    const [audienceType, setAudienceType] = useState<'all' | 'specific'>('all');

    // Table State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

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
        setIsUrgent(announcement?.is_pinned || false); // Assuming is_pinned maps to urgent for mockup
        setIsPinned(announcement?.is_pinned || false);
        setPublishType('now');
        setAudienceType('all');
        setIsEditorOpen(true);
    };

    return (
        <>
            <Head title="Announcements | Cotify Admin" />
            
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                .animate-fade-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; }
                .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
            `}</style>

            <div className="font-sans text-slate-800 bg-slate-50 antialiased h-screen flex overflow-hidden relative">
                
                {/* SIDEBAR (Simplified for brevity, assuming same as before) */}
                <aside className={`bg-ctu-dark flex flex-col justify-between shrink-0 absolute md:relative z-40 h-full transition-transform duration-300 shadow-2xl w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
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
                                <Link href="/admin/announcements" className="mt-1 flex items-center gap-3 px-3 py-2.5 bg-ctu-lightblue text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-900/30">
                                    <i className="fa-solid fa-bullhorn w-5 text-center"></i> Announcements
                                </Link>
                                <Link href="/admin/events" className="mt-1 flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-regular fa-calendar w-5 text-center group-hover:scale-110 transition-transform"></i> Events
                                </Link>
                            </div>
                        </nav>
                    </div>
                </aside>

                {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden animate-fade-in" onClick={() => setIsSidebarOpen(false)}></div>}

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative w-full z-10">
                    
                    <header className="h-20 bg-transparent border-b border-slate-200/50 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle sidebar" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors md:hidden">
                                <i className="fa-solid fa-bars"></i>
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
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
                                    {[
                                        { label: 'All', count: 24 },
                                        { label: 'Published', count: 18 },
                                        { label: 'Scheduled', count: 1 },
                                        { label: 'Drafts', count: 2 },
                                        { label: 'Archived', count: 3 },
                                    ].map((tab) => (
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

                            {/* SEARCH & FILTERS (Simplified for brevity) */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <div className="relative flex-1 min-w-[200px] max-w-xs">
                                    <input 
                                        type="text" 
                                        placeholder="Search title..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-4 pr-4 py-2 bg-white border border-slate-200 text-slate-800 rounded-lg text-sm focus:border-ctu-lightblue outline-none shadow-sm"
                                    />
                                </div>
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
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAnnouncements.map((announcement: any) => (
                                                <tr key={announcement.id} className="text-sm text-slate-700 hover:bg-slate-50 transition-colors group">
                                                    <td className="px-4 py-4">
                                                        <input type="checkbox" checked={selectedRows.includes(announcement.id)} onChange={() => handleSelectRow(announcement.id)} className="rounded border-slate-300 cursor-pointer" />
                                                    </td>
                                                    <td className="px-4 py-4 font-bold text-slate-900 line-clamp-1">{announcement.title}</td>
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
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => openEditor(announcement)} className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold hover:bg-slate-50">Edit</button>
                                                            <button onClick={() => setAnnouncementToDelete(announcement)} className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 hover:bg-rose-50 text-rose-600"><i className="fa-solid fa-trash"></i></button>
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

                {/* ======================================================== */}
                {/* REDESIGNED ANNOUNCEMENT EDITOR MODAL                     */}
                {/* ======================================================== */}
                {isEditorOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 sm:p-6 animate-fade-in" role="dialog" aria-modal="true">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[1100px] h-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
                            
                            <Form 
                                method="post" 
                                action={editingAnnouncement ? `/admin/announcements/${editingAnnouncement.id}` : '/admin/announcements'} 
                                onSuccess={() => setIsEditorOpen(false)} 
                                className="flex flex-col h-full"
                            >
                                {({ errors, processing }) => (
                                    <>
                                    {editingAnnouncement && <input type="hidden" name="_method" value="put" />}

                                    {/* EDITOR HEADER */}
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
                                        <div className="flex items-center gap-4">
                                            <button type="button" onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-slate-700">
                                                <i className="fa-solid fa-arrow-left"></i>
                                            </button>
                                            <h2 className="text-xl font-bold text-slate-900">— Announcements</h2>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-semibold text-slate-400">Draft saved 10:42 AM</span>
                                            <button type="button" className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Preview</button>
                                            <button type="button" className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Save draft</button>
                                            <button type="submit" disabled={processing} className="px-4 py-2 bg-ctu-dark hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50">
                                                {processing ? 'Publishing...' : 'Publish'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* EDITOR BODY (2 COLUMNS) */}
                                    <div className="flex-1 overflow-y-auto flex flex-col md:flex-row bg-white">
                                        
                                        {/* LEFT COLUMN (Main Content) */}
                                        <div className="flex-1 p-6 space-y-6 md:border-r border-slate-200">
                                            
                                            {/* Title */}
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

                                            {/* Details (Rich Text) */}
                                            <div>
                                                <label htmlFor="body" className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                                                    Details <span className="text-rose-500">*</span>
                                                </label>
                                                <div className="border border-slate-300 rounded-lg overflow-hidden flex flex-col focus-within:border-ctu-lightblue focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                                                    {/* Toolbar Mockup */}
                                                    <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 border-b border-slate-200 text-slate-500">
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

                                            {/* Media (Image & Attachments Grid) */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                                {/* Cover Image */}
                                                <div>
                                                    <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Cover Image</label>
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden group">
                                                        {editingAnnouncement?.image_url ? (
                                                            <img src={editingAnnouncement.image_url} alt="Cover" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="text-center p-4">
                                                                <p className="text-sm font-bold text-slate-700 mb-1">Drag an image or browse</p>
                                                                <p className="text-[10px] text-slate-500">JPG, PNG, WebP • up to 5 MB</p>
                                                            </div>
                                                        )}
                                                        <input type="file" name="image" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                                    </label>
                                                </div>

                                                {/* Attachments */}
                                                <div>
                                                    <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Attachments</label>
                                                    <div className="flex flex-col gap-2">
                                                        {/* Mock Attachment Item */}
                                                        <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg">
                                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                                <i className="fa-solid fa-file-pdf text-slate-400"></i> Schedule.pdf
                                                            </div>
                                                            <button type="button" className="text-slate-400 hover:text-rose-600"><i className="fa-solid fa-xmark"></i></button>
                                                        </div>
                                                        
                                                        <label className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                                                            <i className="fa-solid fa-plus text-xs"></i> Add file (PDF, DOCX • 10 MB)
                                                            <input type="file" name="attachment" className="hidden" />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* RIGHT COLUMN (Sidebar Settings) */}
                                        <div className="w-full md:w-[320px] bg-slate-50/50 p-6 space-y-6 shrink-0">
                                            
                                            {/* Publish Box */}
                                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                                <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                                                    Publish <i className="fa-regular fa-circle-check text-slate-400"></i>
                                                </h4>
                                                
                                                <div className="space-y-3 mb-4">
                                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                                                        <input type="radio" name="publish_type" checked={publishType === 'now'} onChange={() => setPublishType('now')} className="text-ctu-lightblue focus:ring-ctu-lightblue" /> Now
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                                                        <input type="radio" name="publish_type" checked={publishType === 'schedule'} onChange={() => setPublishType('schedule')} className="text-ctu-lightblue focus:ring-ctu-lightblue" /> Schedule
                                                    </label>
                                                </div>

                                                {publishType === 'schedule' && (
                                                    <input type="text" placeholder="Nov 2, 2026 · 8:00 AM" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3" />
                                                )}

                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                    <span className="text-xs font-bold text-slate-700">Also send by email</span>
                                                    <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-300 cursor-pointer">
                                                        <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white translate-x-1" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Category & Priority Box */}
                                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                                <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                                                    Category & priority <i className="fa-regular fa-circle-check text-slate-400"></i>
                                                </h4>
                                                
                                                <select 
                                                    name="category" 
                                                    value={selectedCategory} 
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium mb-3 focus:outline-none focus:border-ctu-lightblue"
                                                >
                                                    <option value="Academic">Academic</option>
                                                    <option value="General">General</option>
                                                    <option value="Event">Event</option>
                                                    <option value="Service">Service</option>
                                                </select>

                                                <div className="flex gap-2 mb-4">
                                                    <button type="button" onClick={() => setIsUrgent(false)} className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${!isUrgent ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-500'}`}>Normal</button>
                                                    <button type="button" onClick={() => setIsUrgent(true)} className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${isUrgent ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-500'}`}>Urgent</button>
                                                </div>

                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                                                        <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="rounded border-slate-300 text-ctu-lightblue" /> Pin to top until
                                                    </label>
                                                    <input type="text" placeholder="Nov 10" className="w-20 px-2 py-1 border border-slate-300 rounded text-xs" />
                                                </div>
                                            </div>

                                            {/* Audience Box */}
                                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                                <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                                                    Audience <i className="fa-regular fa-circle-check text-slate-400"></i>
                                                </h4>
                                                
                                                <div className="flex gap-2 mb-4">
                                                    <button type="button" onClick={() => setAudienceType('all')} className={`flex-1 py-1.5 rounded-full border text-xs font-bold ${audienceType === 'all' ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-500'}`}>All students</button>
                                                    <button type="button" onClick={() => setAudienceType('specific')} className={`flex-1 py-1.5 rounded-full border text-xs font-bold ${audienceType === 'specific' ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-500'}`}>Specific</button>
                                                </div>

                                                {audienceType === 'specific' && (
                                                    <div className="space-y-3 animate-fade-in">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {['BSIT', 'BSCS', 'BSIS'].map(course => (
                                                                <button key={course} type="button" className={`px-3 py-1 rounded-full text-[10px] font-bold border ${course === 'BSIT' ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600'}`}>{course} {course === 'BSIT' && '✓'}</button>
                                                            ))}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {['1st', '2nd', '3rd', '4th'].map(year => (
                                                                <button key={year} type="button" className={`px-3 py-1 rounded-full text-[10px] font-bold border ${year === '3rd' ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600'}`}>{year}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <p className="text-[10px] font-semibold text-slate-500 mt-4">Reaches about 310 students</p>
                                            </div>

                                            {/* Posted As Box */}
                                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                                <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                                                    Posted as <i className="fa-regular fa-circle-check text-slate-400"></i>
                                                </h4>
                                                <p className="text-sm font-bold text-slate-800">Registrar's Office <span className="text-slate-500 font-medium">(from your account)</span></p>
                                            </div>

                                        </div>
                                    </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                )}

                {/* Delete Modal (Simplified) */}
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
                                    router.post(`/admin/announcements/${announcementToDelete.id}`, { _method: 'delete' }, {
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