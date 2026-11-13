import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function StaffSettings() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'password' | 'notifications'>('password');
    
    // Mock user data (you can pass these as props if needed)
    const userName = 'Staff User';
    const userCourse = 'BSIT';

    const navLinks = [
        { href: '/staff', label: 'Home', icon: 'fa-solid fa-house', active: false },
        { href: '/staff/announcements', label: 'Announcements', icon: 'fa-solid fa-bullhorn', active: false },
        { href: '/staff/events', label: 'Events', icon: 'fa-regular fa-calendar', active: false },
        { href: '/staff/saved', label: 'Saved', icon: 'fa-regular fa-bookmark', active: false },
    ];

    return (
        <>
            <Head title="Settings | Cotify Staff" />
            
            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                
                @keyframes move-around-1 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(-35vw, 25vh) rotate(25deg); } 50% { transform: translate(-15vw, 50vh) rotate(-15deg); } 75% { transform: translate(25vw, 30vh) rotate(15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-2 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(30vw, -30vh) rotate(-25deg); } 50% { transform: translate(-40vw, -20vh) rotate(15deg); } 75% { transform: translate(-25vw, 30vh) rotate(-15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(35vw, -40vh) rotate(55deg) scale(1.3); } 66% { transform: translate(-30vw, 25vh) rotate(110deg) scale(0.9); } 100% { transform: translate(0, 0) rotate(0deg) scale(1); } }

                .animate-fade-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; }
                
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
                            className="flex w-full items-center gap-4 px-3 py-3.5 mb-1 text-left font-bold text-[15px] rounded-xl transition-all bg-[#3b82f6] text-white shadow-sm"
                            title={!isSidebarExpanded ? "Settings" : undefined}
                        >
                            <i className="fa-solid fa-gear w-5 text-center text-lg shrink-0"></i>
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
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button aria-label="View notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-ctu-lightblue hover:bg-slate-50 transition-colors shadow-sm">
                                <i className="fa-regular fa-bell text-lg"></i>
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="max-w-[800px] mx-auto animate-fade-up">
                            
                            <div className="mb-6">
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
                                <p className="text-sm font-medium text-slate-500 mt-1">Manage your account preferences.</p>
                            </div>

                            {/* SETTINGS TABS - VIBRANT STYLING */}
                            <div className="flex items-center gap-6 border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
                                {[
                                    { id: 'password', label: 'Password' },
                                    { id: 'notifications', label: 'Notifications' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${
                                            activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        <span className={activeTab === tab.id ? 'border-b-2 border-blue-600 pb-3 -mb-3' : ''}>
                                            {tab.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* TAB CONTENT: PASSWORD */}
                            {activeTab === 'password' && (
                                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-fade-in">
                                    <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
                                        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                                            <i className="fa-solid fa-lock text-blue-600"></i> Change Password
                                        </h3>
                                    </div>
                                    <Form method="put" action="/staff/settings/password" resetOnSuccess className="space-y-5 p-6 sm:p-8">
                                        {({ errors, processing }) => (
                                            <>
                                                <div>
                                                    <label htmlFor="currentPassword" className="mb-2 block text-xs font-extrabold text-slate-700 uppercase tracking-wide">Current Password</label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <i className="fa-solid fa-key text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                                                        </div>
                                                        <input id="currentPassword" name="current_password" type="password" required autoComplete="current-password" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                                    </div>
                                                    {errors.current_password && <p className="mt-1.5 text-xs font-bold text-red-600">{errors.current_password}</p>}
                                                </div>
                                                <div>
                                                    <label htmlFor="newPassword" className="mb-2 block text-xs font-extrabold text-slate-700 uppercase tracking-wide">New Password</label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <i className="fa-solid fa-lock text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                                                        </div>
                                                        <input id="newPassword" name="password" type="password" required autoComplete="new-password" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                                    </div>
                                                    {errors.password && <p className="mt-1.5 text-xs font-bold text-red-600">{errors.password}</p>}
                                                </div>
                                                <div>
                                                    <label htmlFor="confirmNewPassword" className="mb-2 block text-xs font-extrabold text-slate-700 uppercase tracking-wide">Confirm New Password</label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <i className="fa-solid fa-lock text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                                                        </div>
                                                        <input id="confirmNewPassword" name="password_confirmation" type="password" required autoComplete="new-password" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                                    <button type="submit" disabled={processing} className="rounded-xl bg-ctu-dark px-8 py-3.5 text-sm font-bold text-white transition-all shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0">
                                                        {processing ? 'Updating...' : 'Update Password'}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </Form>
                                </section>
                            )}

                            {/* TAB CONTENT: NOTIFICATIONS */}
                            {activeTab === 'notifications' && (
                                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-fade-in">
                                    <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
                                        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                                            <i className="fa-solid fa-bell text-blue-600"></i> Notification Preferences
                                        </h3>
                                    </div>
                                    <div className="p-6 sm:p-8 space-y-6">
                                        {/* Toggle 1 */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-base font-bold text-slate-900">Email me when there is a new announcement</p>
                                                <p className="text-sm text-slate-500 mt-1">Get notified instantly about campus updates.</p>
                                            </div>
                                            <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                                            </button>
                                        </div>
                                        
                                        {/* Toggle 2 */}
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                            <div>
                                                <p className="text-base font-bold text-slate-900">Email me urgent announcements only</p>
                                                <p className="text-sm text-slate-500 mt-1">Only receive alerts for high-priority posts.</p>
                                            </div>
                                            <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                        
                                        {/* Toggle 3 */}
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                            <div>
                                                <p className="text-base font-bold text-slate-900">Remind me 1 day before events I'm going to</p>
                                                <p className="text-sm text-slate-500 mt-1">Get a calendar reminder before your events.</p>
                                            </div>
                                            <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
                                        <button className="rounded-xl bg-ctu-dark px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors">
                                            Save Preferences
                                        </button>
                                    </div>
                                </section>
                            )}

                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}