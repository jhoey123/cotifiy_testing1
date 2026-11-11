import { Head, Link, useForm, router, usePage, Form } from '@inertiajs/react';
import { useState } from 'react';

interface ClientProfileProps {
    user: {
        name: string;
        email: string;
        student_id?: string | null;
        course?: string | null;
        year_level?: string | null;
        section?: string | null;
        student_number?: string | null; 
        preferences?: {
            email_all: boolean;
            email_urgent: boolean;
            reminder: boolean;
            categories: string[];
        };
    };
}

export default function ClientProfile({ user }: ClientProfileProps) {
    const { auth } = usePage<any>().props;
    const userName = auth?.user?.name || user.name;
    const userCourse = auth?.user?.course || user.course || 'Student';

    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    // Profile Form
    const profileForm = useForm({
        name: user.name,
        course: user.course || 'BSIT',
        year_level: user.year_level || '3rd Year',
        section: user.section || '',
        student_number: user.student_number || '',
    });

    // Password Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Notifications Form
    const prefsForm = useForm({
        preferences: user.preferences || {
            email_all: true,
            email_urgent: false,
            reminder: true,
            categories: ['Academic', 'Event', 'General', 'Service']
        }
    });

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put('/client/profile', { preserveScroll: true });
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/client/profile/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handleUpdatePreferences = (e: React.FormEvent) => {
        e.preventDefault();
        prefsForm.put('/client/profile/preferences', { preserveScroll: true });
    };

    const toggleCategory = (cat: string) => {
        const current = prefsForm.data.preferences.categories;
        const updated = current.includes(cat) 
            ? current.filter(c => c !== cat)
            : [...current, cat];
        prefsForm.setData('preferences', { ...prefsForm.data.preferences, categories: updated });
    };

    // Navigation Links
    const navLinks = [
        { href: '/client', label: 'Home', icon: 'fa-solid fa-house', active: false },
        { href: '/client/announcements', label: 'Announcements', icon: 'fa-solid fa-bullhorn', active: false },
        { href: '/client/events', label: 'Events', icon: 'fa-regular fa-calendar', active: false },
        { href: '/client/saved', label: 'Saved', icon: 'fa-regular fa-bookmark', active: false },
    ];

    return (
        <>
            <Head title="Profile & Settings | COTIFY" />

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
                
                {/* BACKGROUND SHAPES */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
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
                        
                        <Form method="post" action="/logout">
                            {({ processing }) => (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-bold rounded-xl transition-all text-slate-400 hover:bg-red-600 hover:text-white group disabled:opacity-60"
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
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Settings</h2>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="max-w-[1000px] mx-auto animate-slide-up">
                            
                            <div className="flex flex-col md:flex-row gap-8">
                                
                                {/* SETTINGS INNER TABS */}
                                <aside className="w-full md:w-64 shrink-0">
                                    <nav className="flex flex-col gap-1">
                                        <button
                                            onClick={() => setActiveTab('profile')}
                                            className={`flex items-center px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-ctu-dark text-white shadow-md' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}`}
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('password')}
                                            className={`flex items-center px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'password' ? 'bg-ctu-dark text-white shadow-md' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}`}
                                        >
                                            Password
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('notifications')}
                                            className={`flex items-center px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-ctu-dark text-white shadow-md' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}`}
                                        >
                                            Notifications
                                        </button>
                                    </nav>
                                </aside>

                                {/* RIGHT CONTENT AREA */}
                                <div className="flex-1">
                                    
                                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10">
                                        
                                        {/* PROFILE TAB */}
                                        {activeTab === 'profile' && (
                                            <form onSubmit={handleUpdateProfile} className="animate-fade-in space-y-8">
                                                
                                                {/* Header & Avatar */}
                                                <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
                                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ctu-lightblue to-blue-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg ring-4 ring-white">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-extrabold text-slate-900">{user.name}</h2>
                                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-1">
                                                            <span>{user.student_id || '123456'}</span>
                                                            <span>·</span>
                                                            <span>{user.email}</span>
                                                        </div>
                                                        <button type="button" className="mt-3 px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                                            Change photo
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Form Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2">Course</label>
                                                        <select
                                                            value={profileForm.data.course}
                                                            onChange={e => profileForm.setData('course', e.target.value)}
                                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-ctu-lightblue/10 outline-none transition-all cursor-pointer"
                                                        >
                                                            <option value="BSIT">BS Information Technology (BSIT)</option>
                                                            <option value="BSCS">BS Computer Science (BSCS)</option>
                                                            <option value="BSIS">BS Information Systems (BSIS)</option>
                                                            <option value="ACT">Associate in Computer Technology (ACT)</option>
                                                        </select>
                                                        {profileForm.errors.course && <p className="mt-1.5 text-xs font-bold text-red-600">{profileForm.errors.course}</p>}
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2">Year Level</label>
                                                        <select
                                                            value={profileForm.data.year_level}
                                                            onChange={e => profileForm.setData('year_level', e.target.value)}
                                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-ctu-lightblue/10 outline-none transition-all cursor-pointer"
                                                        >
                                                            <option value="1st Year">1st Year</option>
                                                            <option value="2nd Year">2nd Year</option>
                                                            <option value="3rd Year">3rd Year</option>
                                                            <option value="4th Year">4th Year</option>
                                                        </select>
                                                        {profileForm.errors.year_level && <p className="mt-1.5 text-xs font-bold text-red-600">{profileForm.errors.year_level}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2">Section</label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.data.section}
                                                            onChange={e => profileForm.setData('section', e.target.value)}
                                                            placeholder="e.g. 3-B"
                                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-ctu-lightblue/10 outline-none transition-all"
                                                        />
                                                        {profileForm.errors.section && <p className="mt-1.5 text-xs font-bold text-red-600">{profileForm.errors.section}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2">Student Number</label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.data.student_number}
                                                            onChange={e => profileForm.setData('student_number', e.target.value)}
                                                            placeholder="e.g. 123456"
                                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-ctu-lightblue/10 outline-none transition-all"
                                                        />
                                                        {profileForm.errors.student_number && <p className="mt-1.5 text-xs font-bold text-red-600">{profileForm.errors.student_number}</p>}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={profileForm.processing}
                                                        className="bg-ctu-dark text-white hover:bg-slate-800 text-sm font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-md"
                                                    >
                                                        {profileForm.processing ? 'Saving...' : 'Save changes'}
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {/* PASSWORD TAB */}
                                        {activeTab === 'password' && (
                                            <form onSubmit={handleUpdatePassword} className="animate-fade-in space-y-6">
                                                <div className="border-b border-slate-100 pb-4 mb-6">
                                                    <h2 className="text-xl font-extrabold text-slate-900">Change Password</h2>
                                                    <p className="text-sm text-slate-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2">Current Password</label>
                                                    <input
                                                        type="password"
                                                        value={passwordForm.data.current_password}
                                                        onChange={e => passwordForm.setData('current_password', e.target.value)}
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-ctu-lightblue/10 outline-none transition-all"
                                                    />
                                                    {passwordForm.errors.current_password && <p className="mt-1.5 text-xs font-bold text-red-600">{passwordForm.errors.current_password}</p>}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2">New Password</label>
                                                        <input
                                                            type="password"
                                                            value={passwordForm.data.password}
                                                            onChange={e => passwordForm.setData('password', e.target.value)}
                                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-ctu-lightblue/10 outline-none transition-all"
                                                        />
                                                        {passwordForm.errors.password && <p className="mt-1.5 text-xs font-bold text-red-600">{passwordForm.errors.password}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2">Confirm Password</label>
                                                        <input
                                                            type="password"
                                                            value={passwordForm.data.password_confirmation}
                                                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-ctu-lightblue focus:ring-4 focus:ring-ctu-lightblue/10 outline-none transition-all"
                                                        />
                                                        {passwordForm.errors.password_confirmation && <p className="mt-1.5 text-xs font-bold text-red-600">{passwordForm.errors.password_confirmation}</p>}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={passwordForm.processing}
                                                        className="bg-ctu-dark text-white hover:bg-slate-800 text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
                                                    >
                                                        {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {/* NOTIFICATIONS TAB */}
                                        {activeTab === 'notifications' && (
                                            <form onSubmit={handleUpdatePreferences} className="animate-fade-in space-y-6">
                                                <div className="border-b border-slate-100 pb-4 mb-6">
                                                    <h2 className="text-xl font-extrabold text-slate-900">Notifications</h2>
                                                </div>

                                                <div className="space-y-5">
                                                    {/* Toggle 1 */}
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">Email me when there is a new announcement</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => prefsForm.setData('preferences', { ...prefsForm.data.preferences, email_all: !prefsForm.data.preferences.email_all })}
                                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ctu-lightblue focus:ring-offset-2 ${prefsForm.data.preferences.email_all ? 'bg-ctu-dark' : 'bg-slate-200'}`}
                                                        >
                                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefsForm.data.preferences.email_all ? 'translate-x-6' : 'translate-x-1'}`} />
                                                        </button>
                                                    </div>

                                                    {/* Toggle 2 */}
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">Email me urgent announcements only</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => prefsForm.setData('preferences', { ...prefsForm.data.preferences, email_urgent: !prefsForm.data.preferences.email_urgent })}
                                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ctu-lightblue focus:ring-offset-2 ${prefsForm.data.preferences.email_urgent ? 'bg-ctu-dark' : 'bg-slate-200'}`}
                                                        >
                                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefsForm.data.preferences.email_urgent ? 'translate-x-6' : 'translate-x-1'}`} />
                                                        </button>
                                                    </div>

                                                    {/* Toggle 3 */}
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">Remind me 1 day before events I'm going to</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => prefsForm.setData('preferences', { ...prefsForm.data.preferences, reminder: !prefsForm.data.preferences.reminder })}
                                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ctu-lightblue focus:ring-offset-2 ${prefsForm.data.preferences.reminder ? 'bg-ctu-dark' : 'bg-slate-200'}`}
                                                        >
                                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefsForm.data.preferences.reminder ? 'translate-x-6' : 'translate-x-1'}`} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Categories */}
                                                <div className="pt-6 mt-6 border-t border-slate-100">
                                                    <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-3">Categories I follow</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Academic', 'Event', 'General', 'Service'].map(cat => {
                                                            const isActive = prefsForm.data.preferences.categories.includes(cat);
                                                            return (
                                                                <button
                                                                    key={cat}
                                                                    type="button"
                                                                    onClick={() => toggleCategory(cat)}
                                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                                                        isActive 
                                                                            ? 'bg-slate-800 text-white border-slate-800 shadow-sm' 
                                                                            : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                                                                    }`}
                                                                >
                                                                    {cat} {isActive && <i className="fa-solid fa-check ml-1 text-[10px]"></i>}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4 mt-8 border-t border-slate-100">
                                                    <button
                                                        type="submit"
                                                        disabled={prefsForm.processing}
                                                        className="bg-ctu-dark text-white hover:bg-slate-800 text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
                                                    >
                                                        {prefsForm.processing ? 'Saving...' : 'Save preferences'}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}