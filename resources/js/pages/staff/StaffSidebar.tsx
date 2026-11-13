import { Link, Form } from '@inertiajs/react';
import { useState } from 'react';

interface StaffSidebarProps {
    activePage: 'dashboard' | 'announcements' | 'events';
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
    userCourse?: string;
}

export default function StaffSidebar({
    activePage,
    isOpen,
    onClose,
    userName = 'Staff User',
    userCourse = 'Staff',
}: StaffSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const navLinks = [
        { href: '/staff', label: 'Dashboard', icon: 'fa-solid fa-house', id: 'dashboard' },
        { href: '/staff/announcements', label: 'Announcements', icon: 'fa-solid fa-bullhorn', id: 'announcements' },
        { href: '/staff/events', label: 'Events', icon: 'fa-regular fa-calendar', id: 'events' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <aside 
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={`bg-ctu-dark flex flex-col justify-between shrink-0 absolute md:relative z-40 h-full transition-all duration-300 ease-in-out shadow-2xl
                ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
                ${isExpanded ? 'md:w-64' : 'md:w-20'}`}
            >
                <div className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden pt-6">
                    
                    {/* Logo Section */}
                    <div className="px-4 flex items-center h-20 mb-4">
                        <Link href="/staff" className="flex items-center shrink-0">
                            <img src="/images/3rdLogo.png" alt="Cotify Logo" className="w-20 h-20 sm:w-28 sm:h-28 object-contain -ml-4 sm:-ml-6 -mr-6 sm:-mr-8"  />
                            <div className={`text-white whitespace-nowrap transition-opacity duration-300 ml-2 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
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
                                    activePage === link.id
                                        ? 'bg-[#3b82f6] text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                                title={!isExpanded ? link.label : undefined}
                            >
                                <i className={`${link.icon} w-5 text-center text-lg shrink-0`}></i>
                                <span className={`whitespace-nowrap font-bold text-[15px] transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom Section: Profile, Logout */}
                <div className="p-3">

                    <div className="flex items-center gap-4 px-3 py-3 mb-1 rounded-xl border border-transparent">
                        <div className="w-10 h-10 rounded-full bg-ctu-lightblue flex items-center justify-center text-white font-bold text-sm shrink-0 ring-2 ring-transparent">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className={`whitespace-nowrap transition-opacity duration-300 overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
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
                                title={!isExpanded ? "Log Out" : undefined}
                            >
                                <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center text-lg shrink-0"></i>
                                <span className={`whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                    {processing ? 'Logging out...' : 'Log Out'}
                                </span>
                            </button>
                        )}
                    </Form>
                </div>
            </aside>
        </>
    );
}