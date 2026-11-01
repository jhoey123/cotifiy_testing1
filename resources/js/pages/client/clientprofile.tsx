import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface ClientProfileProps {
    user: {
        name: string;
        email: string;
        student_id?: string | null;
        course?: string | null;
        year_level?: string | null;
        section?: string | null;
        student_number?: string | null; // Changed from contact_number
        preferences?: {
            email_all: boolean;
            email_urgent: boolean;
            reminder: boolean;
            categories: string[];
        };
    };
}

export default function ClientProfile({ user }: ClientProfileProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile');

    // Profile Form
    const profileForm = useForm({
        name: user.name,
        course: user.course || 'BSIT',
        year_level: user.year_level || '3rd Year',
        section: user.section || '',
        student_number: user.student_number || '', // Changed from contact_number
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

    return (
        <>
            <Head title="Profile & Settings | COTIFY" />

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUpText { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                @keyframes move-around-1 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(-15vw, 10vh) rotate(15deg); } 50% { transform: translate(-5vw, 25vh) rotate(-10deg); } 75% { transform: translate(10vw, 15vh) rotate(5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-2 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(10vw, -15vh) rotate(-20deg); } 50% { transform: translate(-20vw, -10vh) rotate(10deg); } 75% { transform: translate(-10vw, 15vh) rotate(-5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(15vw, -20vh) rotate(45deg) scale(1.2); } 66% { transform: translate(-15vw, 10vh) rotate(90deg) scale(0.8); } 100% { transform: translate(0, 0) rotate(0deg) scale(1); } }

                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                .animate-slide-up { animation: slideUpText 0.5s ease-out forwards; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-spin-slow { animation: spin-slow 20s linear infinite; }

                .shape-move-1 { animation: move-around-1 25s ease-in-out infinite; }
                .shape-move-2 { animation: move-around-2 30s ease-in-out infinite; }
                .shape-move-3 { animation: move-around-3 35s ease-in-out infinite; }

                .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
                .clip-diamond { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
            `}</style>

            <div className="font-sans text-slate-800 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 antialiased min-h-screen relative overflow-hidden">
                
                {/* BACKGROUND SHAPES */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[5%] left-[5%] w-[35rem] h-[35rem] bg-blue-500/10 rounded-full blur-3xl shape-move-1"></div>
                    <div className="absolute bottom-[10%] right-[5%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-3xl shape-move-2"></div>
                    <div className="absolute top-[40%] left-[30%] w-[25rem] h-[25rem] bg-rose-500/5 rounded-full blur-3xl shape-move-3"></div>
                    <div className="absolute top-[15%] right-[20%] w-64 h-64 border-[2px] border-blue-500/15 rounded-full animate-float"></div>
                    <div className="absolute bottom-[20%] left-[10%] w-40 h-40 border-[3px] border-indigo-500/15 clip-diamond shape-move-2"></div>
                    <div className="absolute top-[25%] left-[15%] w-48 h-48 bg-indigo-500/5 clip-hexagon shape-move-3"></div>
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    
                    {/* HEADER */}
                    <header className="fixed top-0 left-0 right-0 z-50 bg-ctu-dark/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
                        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
                                <div className="flex items-center gap-8">
                                    <Link href="/client" className="flex items-center shrink-0 group">
                                        <img src="/images/3rdLogo.png" alt="Cotify"    className="w-20 h-20 sm:w-28 sm:h-28 object-contain -ml-4 sm:-ml-6 -mr-6 sm:-mr-8"  />
                                       <div className="hidden sm:block">
                                        <span className="block text-xl leading-tight font-extrabold text-white">
                                            Cotify
                                        </span>
                                        <span className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                            College of Technology
                                        </span>
                                    </div>
                                    </Link>
                                    <nav className="hidden md:flex items-center gap-6">
                                        <Link href="/client" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Home</Link>
                                        <Link href="/client/announcements" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Announcements</Link>
                                        <Link href="/client/events" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Events</Link>
                                        <Link href="/client/saved" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Saved</Link>
                                    </nav>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-300 transition-colors">
                                        <i className="fa-regular fa-bell text-xl"></i>
                                    </button>
                                    <Link href="/client/profile" className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-slate-700 cursor-pointer">
                                        <div className="w-8 h-8 rounded-full bg-ctu-lightblue text-white flex items-center justify-center font-bold text-sm ring-2 ring-white/20">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-semibold text-white hidden lg:block">{user.name.split(' ')[0]} D.</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* MAIN CONTENT */}
                    <main className="flex-1 pt-24 sm:pt-32 pb-16 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8 animate-slide-up">Settings</h1>

                        <div className="flex flex-col md:flex-row gap-8">
                            
                            {/* LEFT SIDEBAR TABS */}
                            <aside className="w-full md:w-64 shrink-0 animate-fade-in">
                                <nav className="flex flex-col gap-1">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`flex items-center px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-[#2d3748] text-white shadow-md' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}`}
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('password')}
                                        className={`flex items-center px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'password' ? 'bg-[#2d3748] text-white shadow-md' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}`}
                                    >
                                        Password
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('notifications')}
                                        className={`flex items-center px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-[#2d3748] text-white shadow-md' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}`}
                                    >
                                        Notifications
                                    </button>
                                    
                                    <div className="h-px bg-slate-200 my-2 mx-4"></div>
                                    
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex items-center px-5 py-3.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all w-full text-left"
                                    >
                                        Log out
                                    </Link>
                                </nav>
                            </aside>

                            {/* RIGHT CONTENT AREA */}
                            <div className="flex-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                
                                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl overflow-hidden p-6 sm:p-10">
                                    
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
                                                    className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
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
                                                    className="bg-[#2d3748] text-white hover:bg-slate-700 text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
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
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ctu-lightblue focus:ring-offset-2 ${prefsForm.data.preferences.email_all ? 'bg-[#2d3748]' : 'bg-slate-200'}`}
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
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ctu-lightblue focus:ring-offset-2 ${prefsForm.data.preferences.email_urgent ? 'bg-[#2d3748]' : 'bg-slate-200'}`}
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
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ctu-lightblue focus:ring-offset-2 ${prefsForm.data.preferences.reminder ? 'bg-[#2d3748]' : 'bg-slate-200'}`}
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
                                                    className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
                                                >
                                                    {prefsForm.processing ? 'Saving...' : 'Save preferences'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* FOOTER */}
                    <footer className="bg-ctu-dark text-white border-t border-slate-800 py-6 mt-auto">
                        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-slate-400">&copy; 2026 Cotify · College of Technology</p>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                <a href="#" className="hover:text-white transition-colors">About</a><span>·</span>
                                <a href="#" className="hover:text-white transition-colors">Contact</a><span>·</span>
                                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}