import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Settings() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);
    const [activeTab, setActiveTab] = useState<'password' | 'categories' | 'offices' | 'school'>('password');

    return (
        <>
            <Head title="Settings | Cotify Admin" />
            
            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                
                @keyframes move-around-1 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(-15vw, 10vh) rotate(15deg); } 50% { transform: translate(-5vw, 25vh) rotate(-10deg); } 75% { transform: translate(10vw, 15vh) rotate(5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-2 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(10vw, -15vh) rotate(-20deg); } 50% { transform: translate(-20vw, -10vh) rotate(10deg); } 75% { transform: translate(-10vw, 15vh) rotate(-5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(15vw, -20vh) rotate(45deg) scale(1.2); } 66% { transform: translate(-15vw, 10vh) rotate(90deg) scale(0.8); } 100% { transform: translate(0, 0) rotate(0deg) scale(1); } }

                .animate-fade-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; }
                
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
                                <Link href="/admin/events" className="mt-1 flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-regular fa-calendar w-5 text-center group-hover:scale-110 transition-transform"></i> Events
                                </Link>
                            </div>

                            <div>
                                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">People</p>
                                <Link href="/admin/users" prefetch="mount" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-solid fa-users w-5 text-center group-hover:scale-110 transition-transform"></i> Students
                                </Link>
                                <Link href="/admin/staff" prefetch="mount" className="mt-1 flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all group">
                                    <i className="fa-solid fa-user-shield w-5 text-center group-hover:scale-110 transition-transform"></i> Staff & Admins
                                </Link>
                            </div>

                            <div>
                                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">System</p>
                                <Link href="/admin/settings" className="mt-1 flex items-center gap-3 px-3 py-2.5 bg-ctu-lightblue text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-900/30">
                                    <i className="fa-solid fa-gear w-5 text-center"></i> Settings
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
                    
                    <header className="h-20 bg-transparent border-b border-slate-200/50 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle sidebar" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors md:hidden">
                                <i className="fa-solid fa-bars"></i>
                            </button>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Settings</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button aria-label="View notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-ctu-lightblue hover:bg-slate-50 transition-colors shadow-sm">
                                <i className="fa-regular fa-bell text-lg"></i>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="max-w-[1000px] mx-auto animate-fade-up">
                            
                            <div className="mb-6">
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
                                <p className="text-sm font-medium text-slate-500 mt-1">Manage system preferences and your account.</p>
                            </div>

                            {/* SETTINGS TABS */}
                            <div className="flex items-center gap-6 border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
                                {[
                                    { id: 'password', label: 'Password' },
                                    { id: 'categories', label: 'Categories' },
                                    { id: 'offices', label: 'Offices' },
                                    { id: 'school', label: 'School & Semester' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${
                                            activeTab === tab.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        <span className={activeTab === tab.id ? 'border-b-2 border-slate-900 pb-3 -mb-3' : ''}>
                                            {tab.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* TAB CONTENT: PASSWORD */}
                            {activeTab === 'password' && (
                                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-fade-in">
                                    <div className="border-b border-slate-200 px-6 py-4">
                                        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                                            <i className="fa-solid fa-lock text-blue-600"></i> Change Password
                                        </h3>
                                    </div>
                                    <Form method="put" action="/admin/settings/password" resetOnSuccess className="space-y-5 p-6 sm:p-8">
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

                            {/* TAB CONTENT: CATEGORIES (Mockup for super admin) */}
                            {activeTab === 'categories' && (
                                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-fade-in">
                                    <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                                        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                                            <i className="fa-solid fa-tags text-blue-600"></i> Manage Categories
                                        </h3>
                                        <button type="button" className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors">
                                            + New Category
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {/* Mock list */}
                                            {['Academic', 'Events', 'General', 'Service'].map((cat, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-3 h-3 rounded-full ${
                                                            cat === 'Academic' ? 'bg-blue-500' : 
                                                            cat === 'Events' ? 'bg-emerald-500' : 
                                                            cat === 'Service' ? 'bg-purple-500' : 'bg-slate-500'
                                                        }`}></span>
                                                        <span className="font-bold text-slate-800">{cat}</span>
                                                    </div>
                                                    <button className="text-xs font-bold text-slate-500 hover:text-slate-900">Edit</button>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="mt-4 text-xs text-slate-500">Categories are stored in the database and colors apply globally.</p>
                                    </div>
                                </section>
                            )}

                            {/* TAB CONTENT: OFFICES (Mockup for super admin) */}
                            {activeTab === 'offices' && (
                                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-fade-in">
                                    <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                                        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                                            <i className="fa-solid fa-building text-blue-600"></i> Manage Offices
                                        </h3>
                                        <button type="button" className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors">
                                            + New Office
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {/* Mock list */}
                                            {['Registrar\'s Office', 'Office of the Dean', 'Student Affairs (SAO)', 'IT Department'].map((office, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                                                    <span className="font-bold text-slate-800">{office}</span>
                                                    <button className="text-xs font-bold text-slate-500 hover:text-slate-900">Edit</button>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="mt-4 text-xs text-slate-500">Offices link to admin accounts for accurate "Posted By" labels.</p>
                                    </div>
                                </section>
                            )}

                            {/* TAB CONTENT: SCHOOL & SEMESTER (Mockup for super admin) */}
                            {activeTab === 'school' && (
                                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-fade-in">
                                    <div className="border-b border-slate-200 px-6 py-4">
                                        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                                            <i className="fa-solid fa-school text-blue-600"></i> School & Semester
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4 max-w-lg">
                                        <div>
                                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2">School Name</label>
                                            <input type="text" defaultValue="College of Technology" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2">Current Semester</label>
                                            <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                                <option>1st Semester, AY 2023-2024</option>
                                                <option>2nd Semester, AY 2023-2024</option>
                                            </select>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                                            <button className="rounded-xl bg-ctu-dark px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors">Save Changes</button>
                                        </div>
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