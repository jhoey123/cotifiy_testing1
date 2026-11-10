import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface Announcement {
    id: number;
    title: string;
    category: string;
    date: string;
    summary: string;
}

interface WelcomeProps {
    publicAnnouncements?: Announcement[];
}

export default function Welcome({ publicAnnouncements = [] }: WelcomeProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Trigger entrance animations after the component mounts
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        const refreshAnnouncements = () => {
            if (document.visibilityState === 'visible') {
                router.reload({
                    only: ['publicAnnouncements'],
                    showProgress: false,
                });
            }
        };
        const intervalId = window.setInterval(refreshAnnouncements, 15_000);

        document.addEventListener('visibilitychange', refreshAnnouncements);
        window.addEventListener('focus', refreshAnnouncements);

        return () => {
            window.clearInterval(intervalId);
            document.removeEventListener('visibilitychange', refreshAnnouncements);
            window.removeEventListener('focus', refreshAnnouncements);
        };
    }, []);

    // Format date helper
    const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <>
            <Head>
                <title>Welcome | Cotify Campus Portal</title>
                <meta name="description" content="Stay informed with the latest announcements, events, and academic updates from the College of Technology. Join the Cotify campus community today." />
            </Head>
            
            {/* Custom Styles for Animations */}
            <style>{`
                @keyframes slowZoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                .animate-slow-zoom {
                    animation: slowZoom 20s ease-in-out infinite alternate;
                }
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
                .delay-300 { animation-delay: 300ms; }
                .delay-400 { animation-delay: 400ms; }
                .delay-500 { animation-delay: 500ms; }
            `}</style>

            <div className="font-sans text-slate-800 bg-slate-900 antialiased overflow-x-hidden min-h-screen flex flex-col">
                
                {/* Background with slow zoom animation */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                        src="/images/download.jpg" 
                        alt="College of Technology Campus" 
                        className="w-full h-full object-cover opacity-20 animate-slow-zoom origin-center"
                    />
                    {/* Darker overlay for accessibility contrast */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80"></div>
                </div>

                {/* ==================== */}
                {/* HEADER               */}
                {/* ==================== */}
                <header 
                    className={`relative z-50 flex items-center justify-between px-6 lg:px-8 py-4 max-w-[1400px] mx-auto w-full transition-all duration-1000 ease-out ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}
                >
                    <div className="flex items-center text-white">
                        <img 
                            src="/images/3rdLogo.png" 
                            alt="Cotify Logo" 
                            className="w-20 h-20 sm:w-28 sm:h-28 object-contain -ml-4 sm:-ml-6 -mr-6 sm:-mr-8" 
                        />
                        <div>
                            <h1 className="font-bold text-2xl sm:text-3xl leading-tight tracking-wide">Cotify</h1>
                            {/* Rule: Same subtitle everywhere */}
                            <p className="text-xs sm:text-sm text-slate-400">Your Campus Portal</p>
                        </div>
                    </div>

                    {/* Desktop Nav Links */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <a href="#announcements" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Announcements</a>
                        <a href="#events" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Events</a>
                        <a href="#about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</a>
                        <a href="#contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Contact</a>
                    </nav>

                    {/* Desktop Auth Buttons - Rule: One button set (Secondary outline, Primary solid) */}
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/auth/register" 
                            className="hidden sm:block border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-5 py-2 rounded-md text-sm font-medium transition-all duration-300"
                        >
                            Register
                        </Link>
                        <Link 
                            href="/auth/login" 
                            className="hidden sm:block bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Login
                        </Link>
                        
                        {/* Mobile Menu Toggle - Rule: Every icon-only button has an aria-label */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle navigation menu"
                            className="lg:hidden text-white text-xl hover:text-blue-400 transition-colors w-10 h-10 flex items-center justify-center focus:ring-2 focus:ring-blue-500 outline-none rounded-md"
                        >
                            <i className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                    </div>
                </header>

                {/* Mobile Menu */}
                <div 
                    className={`relative z-40 bg-slate-900/95 backdrop-blur-md lg:hidden border-b border-slate-800 overflow-hidden transition-all duration-300 ease-in-out ${
                        mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="px-6 py-4 flex flex-col gap-4 text-slate-300 text-sm font-medium">
                        <a href="#announcements" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Announcements</a>
                        <a href="#events" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Events</a>
                        <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">About</a>
                        <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Contact</a>
                        <hr className="border-slate-800 my-2" />
                        <div className="flex gap-3">
                            <Link href="/auth/register" className="flex-1 border border-blue-500 text-blue-400 text-center py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors">Register</Link>
                            <Link href="/auth/login" className="flex-1 bg-blue-500 text-white text-center py-2 rounded-md hover:bg-blue-600 transition-colors">Login</Link>
                        </div>
                    </div>
                </div>

                {/* ==================== */}
                {/* MAIN HERO SECTION    */}
                {/* ==================== */}
                <main className="relative z-10 flex-1 flex flex-col justify-center max-w-[1400px] mx-auto w-full px-6 lg:px-16 pt-10 pb-16">
                    <div className="max-w-3xl">
                        {/* Animated Subtitle */}
                        <p className={`text-blue-400 font-semibold tracking-widest text-xs uppercase mb-3 transition-all duration-700 ease-out delay-100 ${
                            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                            Cotify Platform
                        </p>
                        
                        {/* Animated Main Title - Rule: font sizes 32 / 24 / 18 / 16 / 14 / 12. Hero can be slightly larger (48px = text-5xl) */}
                        <h2 className={`text-4xl sm:text-5xl font-bold text-white leading-tight mb-6 transition-all duration-700 ease-out delay-200 ${
                            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                            Stay Informed,<br></br>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 inline-block pb-2">
                                Stay Connected
                            </span>
                        </h2>
                        
                        {/* Animated Paragraph - Rule: Body text at least 16px (text-base) with 1.5 line height (leading-relaxed) */}
                        <p className={`text-slate-300 text-base sm:text-lg mb-8 max-w-xl leading-relaxed transition-all duration-700 ease-out delay-300 ${
                            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                            Get the latest announcements, events, and important updates from Cotify — all in one place.
                        </p>
                        
                        {/* Animated Buttons */}
                        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-700 ease-out delay-400 ${
                            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                            {/* Primary Button */}
                            <a 
                                href="#announcements" 
                                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 group"
                            >
                                View Announcements 
                                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                            </a>
                            {/* Secondary Button */}
                            <a 
                                href="#about"
                                className="w-full sm:w-auto bg-transparent border border-slate-600 hover:border-slate-400 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/5"
                            >
                                Learn More <i className="fa-solid fa-circle-info text-xs"></i>
                            </a>
                        </div>
                    </div>
                </main>

                {/* ==================== */}
                {/* FEATURE STRIP        */}
                {/* ==================== */}
                <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-16 pb-16">
                    <div 
                        className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ease-out delay-500 ${
                            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}
                    >
                        {/* Feature 1 */}
                        <div className="flex items-start gap-4 p-3 rounded-xl group cursor-default">
                            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400 mt-1 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                                <i className="fa-solid fa-bullhorn text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-white text-sm font-semibold mb-1">Latest Announcements</h4>
                                {/* Accessibility Fix: Raised text color from slate-300 to slate-200 for >4.5:1 contrast */}
                                <p className="text-slate-200 text-xs leading-relaxed">Be the first to know what's happening on campus.</p>
                            </div>
                        </div>
                        
                        {/* Feature 2 */}
                        <div className="flex items-start gap-4 p-3 rounded-xl group cursor-default">
                            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400 mt-1 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                                <i className="fa-regular fa-calendar text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-white text-sm font-semibold mb-1">Upcoming Events</h4>
                                <p className="text-slate-200 text-xs leading-relaxed">Seminars, activities, and important dates.</p>
                            </div>
                        </div>
                        
                        {/* Feature 3 */}
                        <div className="flex items-start gap-4 p-3 rounded-xl group cursor-default">
                            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400 mt-1 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                                <i className="fa-solid fa-graduation-cap text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-white text-sm font-semibold mb-1">Academic Updates</h4>
                                <p className="text-slate-200 text-xs leading-relaxed">Class suspensions, enrollment and more.</p>
                            </div>
                        </div>
                        
                        {/* Feature 4 */}
                        <div className="flex items-start gap-4 p-3 rounded-xl group cursor-default">
                            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400 mt-1 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                                <i className="fa-solid fa-users text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-white text-sm font-semibold mb-1">Campus Life</h4>
                                <p className="text-slate-200 text-xs leading-relaxed">Be part of a connected community.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================== */}
                {/* LATEST ANNOUNCEMENTS */}
                {/* ==================== */}
                <section id="announcements" className="relative z-10 bg-slate-900/50 backdrop-blur-sm border-t border-slate-800 py-12">
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Latest Public Announcements</h3>
                                <p className="text-slate-400 text-sm">Catch up on what you missed. Log in to view all updates.</p>
                            </div>
                            <Link href="/auth/login" className="hidden sm:flex text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors items-center gap-2">
                                View All <i className="fa-solid fa-arrow-right text-xs"></i>
                            </Link>
                        </div>

                        {publicAnnouncements.length === 0 ? (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                                <p className="text-slate-400">No public announcements available at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {publicAnnouncements.slice(0, 3).map((ann) => (
                                    <div key={ann.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-blue-500/30 transition-all group flex flex-col h-full">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-blue-500/20 text-blue-400">
                                                {ann.category}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">{formatDate(ann.date)}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {ann.title}
                                        </h4>
                                        <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                                            {ann.summary}
                                        </p>
                                        <Link href="/auth/login" className="text-sm font-bold text-blue-400 flex items-center gap-2 hover:gap-3 transition-all mt-auto w-fit">
                                            Read More <i className="fa-solid fa-arrow-right text-xs"></i>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ==================== */}
                {/* WHO IS THIS FOR      */}
                {/* ==================== */}
                <section id="about" className="relative z-10 py-16 bg-slate-900">
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-16 text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">Who is Cotify for?</h3>
                        <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-base">Tailored to meet the needs of the entire campus community.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Students */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
                                {/* Rule: Color has one meaning (Blue = brand/actions) */}
                                <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-6">
                                    <i className="fa-solid fa-user-graduate text-2xl"></i>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3">Students</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Never miss a deadline. Get instant updates on class suspensions, enrollment schedules, and student activities.
                                </p>
                            </div>
                            
                            {/* Faculty */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
                                {/* Rule: Color has one meaning (Blue = brand/actions) */}
                                <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-6">
                                    <i className="fa-solid fa-chalkboard-user text-2xl"></i>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3">Faculty</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Stay connected with the administration. Receive important memos, academic calendar changes, and seminar invites.
                                </p>
                            </div>
                            
                            {/* Offices */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
                                {/* Rule: Color has one meaning (Gray = secondary text/neutral). Changed from Emerald. */}
                                <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-6">
                                    <i className="fa-solid fa-building-columns text-2xl"></i>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3">Offices</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    A direct line to the student body. Publish announcements, gather feedback, and manage campus events efficiently.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==================== */}
                {/* FOOTER               */}
                {/* ==================== */}
                <footer id="contact" className="relative z-10 bg-slate-950 border-t border-slate-800 pt-16 pb-8">
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            
                            {/* Brand & Address */}
                            <div className="md:col-span-2">
                                <div className="flex items-center text-white mb-6">
                                    <img 
                                        src="/images/3rdLogo.png" 
                                        alt="Cotify Logo" 
                                        className="w-12 h-12 object-contain -ml-2 -mr-4" 
                                    />
                                    <span className="font-bold text-2xl tracking-wide">Cotify</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                                    The official announcement and event management portal of the College of Technology. Stay informed, stay connected.
                                </p>
                                <div className="space-y-3 text-sm text-slate-400">
                                    <p className="flex items-center gap-3"><i className="fa-solid fa-location-dot text-blue-500 w-4"></i> Cotify City, Cebu, Philippines</p>
                                    <p className="flex items-center gap-3"><i className="fa-regular fa-envelope text-blue-500 w-4"></i> info@cotify.edu.ph</p>
                                    <p className="flex items-center gap-3"><i className="fa-solid fa-phone text-blue-500 w-4"></i> (032) 123-4567</p>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    <li><a href="#announcements" className="hover:text-blue-400 transition-colors">Announcements</a></li>
                                    <li><a href="#events" className="hover:text-blue-400 transition-colors">Events</a></li>
                                    <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                                    <li><Link href="/auth/login" className="hover:text-blue-400 transition-colors">Student Portal</Link></li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Data Protection</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="border-t border-slate-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} COTIFY. All rights reserved.</p>
                            <div className="flex items-center gap-4 text-slate-400">
                                <a href="#" className="hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                                <a href="#" className="hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10" aria-label="Twitter"><i className="fa-brands fa-twitter"></i></a>
                                <a href="#" className="hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}