import { Form, Head, Link } from '@inertiajs/react'
import { useState, useEffect, ChangeEvent } from 'react'

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Password strength state
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Password strength calculator
    const calculateStrength = (pass: string) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length >= 8) score += 1;
        if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
        return score;
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        setStrength(calculateStrength(val));
    };

    return (
        <>
            <Head title="Register | Cotify" />
            
            <style>{`
                @keyframes slowZoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                @keyframes move-around-1 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-15vw, 10vh) rotate(15deg); }
                    50% { transform: translate(-5vw, 25vh) rotate(-10deg); }
                    75% { transform: translate(10vw, 15vh) rotate(5deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                @keyframes move-around-2 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(10vw, -15vh) rotate(-20deg); }
                    50% { transform: translate(-20vw, -10vh) rotate(10deg); }
                    75% { transform: translate(-10vw, 15vh) rotate(-5deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                @keyframes move-around-3 {
                    0% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    33% { transform: translate(15vw, -20vh) rotate(45deg) scale(1.2); }
                    66% { transform: translate(-15vw, 10vh) rotate(90deg) scale(0.8); }
                    100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse-soft {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.1); }
                }
                
                .animate-slow-zoom { animation: slowZoom 20s ease-in-out infinite alternate; }
                .shape-move-1 { animation: move-around-1 25s ease-in-out infinite; }
                .shape-move-2 { animation: move-around-2 30s ease-in-out infinite; }
                .shape-move-3 { animation: move-around-3 35s ease-in-out infinite; }
                .shape-spin { animation: spin-slow 40s linear infinite; }
                .animate-pulse-soft { animation: pulse-soft 8s ease-in-out infinite; }

                .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
                .clip-octagon { clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); }
            `}</style>

            <div className="font-sans text-slate-800 bg-[#F1F1F1] antialiased min-h-screen flex relative overflow-hidden">
                
                {/* BACKGROUND SHAPES */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-3xl shape-move-1"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] bg-blue-600/10 rounded-full blur-3xl shape-move-2"></div>
                    <div className="absolute top-[15%] right-[15%] w-[25rem] h-[25rem] border-[3px] border-blue-500/20 rounded-full shape-move-1"></div>
                    <div className="absolute bottom-[20%] left-[10%] w-32 h-32 border-[4px] border-blue-600/20 rounded-full shape-move-2"></div>
                    <div className="absolute top-[60%] right-[30%] w-20 h-20 border-[2px] border-blue-400/30 rounded-full shape-move-3"></div>
                    <div className="absolute top-[20%] left-[30%] w-40 h-40 bg-blue-500/10 clip-hexagon shape-move-2"></div>
                    <div className="absolute bottom-[15%] right-[20%] w-56 h-56 border-[4px] border-blue-600/15 clip-hexagon shape-move-1 bg-transparent">
                        <div className="w-full h-full bg-blue-500/5 clip-hexagon scale-[0.95]"></div>
                    </div>
                    <div className="absolute top-[45%] left-[15%] w-32 h-32 bg-blue-600/10 clip-octagon shape-move-3"></div>
                    <div className="absolute bottom-[35%] right-[35%] w-48 h-48 border-[4px] border-blue-500/15 clip-octagon shape-move-1 bg-transparent">
                        <div className="w-full h-full bg-blue-500/5 clip-octagon scale-[0.95]"></div>
                    </div>
                    <div className="absolute top-[70%] right-[10%] w-28 h-28 border-[3px] border-blue-500/20 rotate-45 shape-move-2"></div>
                    <div className="absolute bottom-[10%] left-[40%] w-16 h-16 bg-blue-600/15 rotate-12 shape-move-3"></div>
                    <div className="absolute top-[10%] right-[40%] w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[60px] border-b-blue-500/15 shape-move-2"></div>
                    <div className="absolute bottom-[40%] left-[5%] w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[50px] border-t-blue-600/15 shape-move-1"></div>
                    <div className="absolute top-[30%] right-[5%] w-3 h-48 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full shape-move-1"></div>
                    <div className="absolute bottom-[20%] left-[25%] w-48 h-3 bg-gradient-to-r from-blue-600/20 to-transparent rounded-full shape-move-3"></div>
                    <div className="absolute top-[5%] right-[5%] w-64 h-64 border-[15px] border-blue-600/10 rounded-full shape-move-3"></div>
                    <div className="absolute bottom-[5%] right-[30%] w-24 h-24 bg-blue-500/15 clip-octagon shape-move-1"></div>
                    <div className="absolute top-[55%] left-[30%] w-20 h-20 border-[3px] border-blue-500/20 rotate-45 shape-move-2"></div>
                    <div className="absolute bottom-[25%] left-[15%] w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[60px] border-b-blue-500/15 shape-move-3"></div>
                    <div className="absolute top-[85%] right-[10%] w-56 h-2 bg-gradient-to-r from-transparent via-blue-600/25 to-transparent rounded-full shape-move-1"></div>
                </div>

                {/* LEFT SIDE: Info Panel */}
                <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-center px-16 relative overflow-hidden z-10 border-r border-slate-200 shadow-2xl">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <img 
                            src="/images/download.jpg" 
                            alt="College of Technology Campus" 
                            className="w-full h-full object-cover opacity-20 animate-slow-zoom origin-center" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                    </div>
                    
                    <div 
                        className={`relative z-10 max-w-md transition-all duration-1000 ease-out ${
                            isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                        }`}
                    >
                        <div className="flex items-center mb-12">
                            <img 
                                src="/images/3rdLogo.png" 
                                alt="Cotify Logo" 
                                className="w-32 h-32 object-contain -ml-6 -mr-4" 
                            />
                            <div className="-ml-2">
                                <h1 className="font-extrabold text-4xl leading-tight tracking-tight">Cotify</h1>
                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mt-1">Your Campus Portal</p>
                            </div>
                        </div>

                        <h2 className="text-4xl font-extrabold mb-4 leading-tight">Join the Community!</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                            Create an account to stay updated with announcements, events, and important campus information.
                        </p>

                        <ul className="space-y-6 text-base text-slate-300 font-medium">
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-check text-blue-400 text-lg"></i>
                                </div>
                                Access all announcements
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-check text-blue-400 text-lg"></i>
                                </div>
                                Connect with the campus
                            </li>
                        </ul>
                    </div>
                </div>

                {/* RIGHT SIDE: Register Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12 relative z-10">
                    
                    <Link 
                        href="/" 
                        aria-label="Back to home"
                        className="absolute top-6 left-6 sm:top-8 sm:left-8 w-11 h-11 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm z-20 group focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        title="Back to Home"
                    >
                        <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                    </Link>

                    <div 
                        className={`w-full max-w-lg rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-1000 ease-out delay-150 ${
                            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}
                    >
                        <div className="absolute inset-0 z-0">
                            <img 
                                src="/images/download.jpg" 
                                alt="Card Background" 
                                className="w-full h-full object-cover opacity-30"
                            />
                            <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm"></div>
                        </div>

                        <div className="relative z-10 p-8 sm:p-10 border border-white/10 rounded-3xl">
                            
                            <div className="flex lg:hidden items-center mb-10">
                                <img 
                                    src="/images/3rdLogo.png" 
                                    alt="Cotify Logo" 
                                    className="w-24 h-24 object-contain -ml-4 -mr-3" 
                                />
                                <div className="-ml-1">
                                    <h1 className="font-extrabold text-3xl text-white leading-tight">Cotify</h1>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Your Campus Portal</p>
                                </div>
                            </div>

                            <h2 className="text-3xl font-extrabold text-white mb-2">Create an Account</h2>
                            <p className="text-sm font-medium text-slate-300 mb-8">Fill in the details below to get started.</p>

                            <Form method="POST" action="/register" className="space-y-5">
                                {({ errors, processing }) => (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label htmlFor="name" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Full Name</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <i className="fa-regular fa-user text-slate-400 group-focus-within:text-blue-400 transition-colors"></i>
                                                    </div>
                                                    <input 
                                                        id="name" type="text" name="name" placeholder="Juan Dela Cruz" 
                                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 rounded-xl border border-slate-600/50 text-white focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
                                                        required
                                                    />
                                                </div>
                                                {errors.name && <p className="mt-1.5 text-xs font-bold text-red-400">{errors.name}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="studentId" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Student ID</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <i className="fa-regular fa-id-card text-slate-400 group-focus-within:text-blue-400 transition-colors"></i>
                                                    </div>
                                                    <input 
                                                        id="studentId" type="text" name="studentId" placeholder="123456" 
                                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 rounded-xl border border-slate-600/50 text-white focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
                                                        required
                                                    />
                                                </div>
                                                {errors.studentId ? (
                                                    <p className="mt-1.5 text-xs font-bold text-red-400">{errors.studentId}</p>
                                                ) : (
                                                    <p className="mt-1.5 text-[10px] font-semibold text-slate-400">Format: 123456</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label htmlFor="course" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Course</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <i className="fa-solid fa-graduation-cap text-slate-400 group-focus-within:text-blue-400 transition-colors"></i>
                                                    </div>
                                                    <select 
                                                        id="course" name="course" defaultValue="" required
                                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 rounded-xl border border-slate-600/50 text-white focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Select Course</option>
                                                        
                                                        <optgroup label="College of Education">
                                                            <option value="BEEd">Bachelor of Elementary Education (BEEd)</option>
                                                            <option value="BTLEd">Bachelor of Technology and Livelihood Education (BTLEd)</option>
                                                            <option value="BSEd">Bachelor of Secondary Education (BSEd)</option>
                                                            <option value="DipPE">Diploma in Professional Education</option>
                                                        </optgroup>

                                                        <optgroup label="College of Engineering">
                                                            <option value="BSIE">BS Industrial Engineering (BSIE)</option>
                                                            <option value="BSME">BS Mechanical Engineering (BSME)</option>
                                                            <option value="BSCE">BS Civil Engineering (BSCE)</option>
                                                            <option value="BSEE">BS Electrical Engineering (BSEE)</option>
                                                            <option value="BSCpE">BS Computer Engineering (BSCpE)</option>
                                                        </optgroup>

                                                        <optgroup label="College of Technology">
                                                            <option value="BSIT">BS Information Technology (BSIT)</option>
                                                            <option value="BSMx">BS Mechatronics (BSMx)</option>
                                                            <option value="BIT">BIT Computer </option>
                                                            <option value="BIT">BIT Drafting </option>
                                                            <option value="BIT">BIT Electrical </option>
                                                            <option value="BIT">BIT Electronics </option>
                                                        </optgroup>

                                                        <optgroup label="College of Management and Entrepreneurship">
                                                            <option value="BSHM">BS Hospitality Management (BSHM)</option>
                                                            <option value="BSTM">BS Tourism Management (BSTM)</option>
                                                            <option value="BSBA">BS Business Administration (BSBA)</option>
                                                        </optgroup>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                        <i className="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
                                                    </div>
                                                </div>
                                                {errors.course && <p className="mt-1.5 text-xs font-bold text-red-400">{errors.course}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="year_level" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Year Level</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <i className="fa-solid fa-layer-group text-slate-400 group-focus-within:text-blue-400 transition-colors"></i>
                                                    </div>
                                                    <select 
                                                        id="year_level" name="year_level" defaultValue="" required
                                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 rounded-xl border border-slate-600/50 text-white focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Select Year</option>
                                                        <option value="1st Year">1st Year</option>
                                                        <option value="2nd Year">2nd Year</option>
                                                        <option value="3rd Year">3rd Year</option>
                                                        <option value="4th Year">4th Year</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                        <i className="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
                                                    </div>
                                                </div>
                                                {errors.year_level && <p className="mt-1.5 text-xs font-bold text-red-400">{errors.year_level}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Email Address</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="fa-regular fa-envelope text-slate-400 group-focus-within:text-blue-400 transition-colors"></i>
                                                </div>
                                                <input 
                                                    id="email" type="email" name="email" placeholder="you@example.com" 
                                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 rounded-xl border border-slate-600/50 text-white focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
                                                    required
                                                />
                                            </div>
                                            {errors.email && <p className="mt-1.5 text-xs font-bold text-red-400">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Password</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="fa-solid fa-lock text-slate-400 group-focus-within:text-blue-400 transition-colors"></i>
                                                </div>
                                                <input 
                                                    id="password" 
                                                    type={showPassword ? "text" : 'password'} 
                                                    name="password" 
                                                    placeholder="Create a strong password" 
                                                    onChange={handlePasswordChange}
                                                    className="w-full pl-11 pr-11 py-3.5 bg-slate-900/60 rounded-xl border border-slate-600/50 text-white focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
                                                    required
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-xl"
                                                >
                                                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-slate-400 hover:text-blue-400 transition-colors`}></i>
                                                </button>
                                            </div>
                                            
                                            <div className="mt-2 space-y-1.5">
                                                <p className="text-[10px] font-semibold text-slate-400">
                                                    Must be 8+ characters with letters and numbers.
                                                </p>
                                                <div className="flex gap-1 h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                                    <div className={`h-full transition-all duration-300 ${strength >= 1 ? 'w-1/4 bg-red-500' : 'w-0'}`}></div>
                                                    <div className={`h-full transition-all duration-300 ${strength >= 2 ? 'w-1/4 bg-orange-500' : 'w-0'}`}></div>
                                                    <div className={`h-full transition-all duration-300 ${strength >= 3 ? 'w-1/4 bg-yellow-500' : 'w-0'}`}></div>
                                                    <div className={`h-full transition-all duration-300 ${strength >= 4 ? 'w-1/4 bg-green-500' : 'w-0'}`}></div>
                                                </div>
                                                {errors.password && <p className="mt-1.5 text-xs font-bold text-red-400">{errors.password}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="password_confirmation" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="fa-solid fa-lock text-slate-400 group-focus-within:text-blue-400 transition-colors"></i>
                                                </div>
                                                <input 
                                                    id="password_confirmation" 
                                                    type={showConfirmPassword ? "text" : "password"} 
                                                    name="password_confirmation" 
                                                    placeholder="Re-enter your password" 
                                                    className="w-full pl-11 pr-11 py-3.5 bg-slate-900/60 rounded-xl border border-slate-600/50 text-white focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
                                                    required
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-xl"
                                                >
                                                    <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-slate-400 hover:text-blue-400 transition-colors`}></i>
                                                </button>
                                            </div>
                                            {errors.password_confirmation && <p className="mt-1.5 text-xs font-bold text-red-400">{errors.password_confirmation}</p>}
                                        </div>

                                        <div className="pt-2">
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center mt-0.5">
                                                    <input 
                                                        type="checkbox" 
                                                        name="terms" 
                                                        required
                                                        className="peer w-5 h-5 appearance-none border-2 border-slate-500/70 rounded-md checked:bg-blue-600 checked:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all cursor-pointer bg-slate-900/60 shrink-0"
                                                    />
                                                    <i className="fa-solid fa-check text-white text-xs absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                                                </div>
                                                <span className="text-xs text-slate-300 leading-relaxed">
                                                    I agree to the <a href="#" className="text-blue-400 hover:underline font-bold">Terms of Service</a> and <a href="#" className="text-blue-400 hover:underline font-bold">Privacy Policy</a> in accordance with the Data Privacy Act of 2012.
                                                </span>
                                            </label>
                                            {errors.terms && <p className="mt-1.5 text-xs font-bold text-red-400">{errors.terms}</p>}
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="w-full block text-center bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_-6px_rgba(37,99,235,0.6)] mt-6"
                                        >
                                            {processing ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <i className="fa-solid fa-spinner fa-spin"></i> Registering...
                                                </span>
                                            ) : 'Create Account'}
                                        </button>
                                    </> 
                                )}
                            </Form>

                            <p className="text-center text-sm text-slate-300 mt-8 font-semibold">
                                Already have an account? <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 hover:underline font-extrabold transition-colors">Log in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}