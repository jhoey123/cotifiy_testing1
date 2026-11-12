import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import StaffSidebar from './StaffSidebar';

export default function StaffSettings() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'password' | 'notifications'>('password');

    return (
        <>
            <Head title="Settings | Cotify Staff" />
            
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
                </div>

                <StaffSidebar
                    activePage="settings"
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
                                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-fade-in">
                                    <div className="border-b border-slate-200 px-6 py-4 bg-blue-50/50">
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

                            {/* TAB CONTENT: NOTIFICATIONS (VIBRANT STYLING) */}
                            {activeTab === 'notifications' && (
                                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-fade-in">
                                    <div className="border-b border-slate-200 px-6 py-4 bg-blue-50/50">
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