import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AnnouncementPage, { type Announcement as BaseAnnouncement } from '../announcementpage';
import StaffSidebar from './StaffSidebar';

type Announcement = BaseAnnouncement & {
    status?: string;
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
}: {
    announcements: Announcement[];
    discussions: Discussion[];
}) {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
    const [isDeletingAnnouncement, setIsDeletingAnnouncement] = useState(false);
    
    // Editor State
    const [selectedCategory, setSelectedCategory] = useState('Academic');
    
    // Table State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    return (
        <>
            <Head title="My Announcements | Cotify Staff" />
            
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
                </div>

                <StaffSidebar
                    activePage="announcements"
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative w-full z-10">
                    
                    <header className="h-20 bg-transparent border-b border-slate-200/50 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle sidebar" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors md:hidden">
                                <i className="fa-solid fa-bars"></i>
                            </button>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">My Announcements</h2>
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
                            
                            {/* PAGE TITLE & TABS (Vibrant styling) */}
                            <div className="mb-6">
                                <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
                                    {[
                                        { label: 'All', count: 12 },
                                        { label: 'Published', count: 10 },
                                        { label: 'Scheduled', count: 0 },
                                        { label: 'Drafts', count: 2 },
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

                            {/* TABLE (Vibrant styling) */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible mb-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[900px]">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold bg-blue-50/50">
                                                <th className="px-4 py-3 w-10">
                                                    <input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === filteredAnnouncements.length && filteredAnnouncements.length > 0} className="rounded border-slate-300 cursor-pointer text-blue-600 focus:ring-blue-500" />
                                                </th>
                                                <th className="px-4 py-3">Title</th>
                                                <th className="px-4 py-3">Category</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAnnouncements.map((announcement) => (
                                                <tr key={announcement.id} className="text-sm text-slate-700 hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-4 py-4">
                                                        <input type="checkbox" checked={selectedRows.includes(announcement.id)} onChange={() => handleSelectRow(announcement.id)} className="rounded border-slate-300 cursor-pointer text-blue-600 focus:ring-blue-500" />
                                                    </td>
                                                    <td className="px-4 py-4 font-bold text-slate-900 line-clamp-1">{announcement.title}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`border px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                            announcement.category === 'Academic' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                                            announcement.category === 'Event' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                                                            announcement.category === 'Service' ? 'border-purple-200 bg-purple-50 text-purple-700' :
                                                            'border-slate-200 bg-slate-50 text-slate-700'
                                                        }`}>
                                                            {announcement.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                                                            announcement.status === 'Scheduled' ? 'border-amber-200 bg-amber-50 text-amber-700' : 
                                                            announcement.status === 'Draft' ? 'border-slate-300 bg-slate-100 text-slate-600' :
                                                            'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                        }`}>
                                                            {announcement.status || 'Published'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs font-medium">{formatDate(announcement.date)}</td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => openEditor(announcement)} className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">Edit</button>
                                                            <button onClick={() => setAnnouncementToDelete(announcement)} className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 hover:bg-rose-50 text-rose-600 transition-colors"><i className="fa-solid fa-trash"></i></button>
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
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[1100px] h-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
                            
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
                                                    <option value="Event">Event</option>
                                                    <option value="Service">Service</option>
                                                </select>
                                                {errors.category && <p className="mb-3 text-xs font-bold text-red-600">{errors.category}</p>}
                                            </div>

                                            {selectedCategory === 'Event' && (
                                                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                                                    <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                                                        Event details
                                                    </h4>
                                                    <div>
                                                        <label htmlFor="event_date" className="block text-xs font-bold text-slate-700 mb-1">
                                                            Event date <span className="text-rose-500">*</span>
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