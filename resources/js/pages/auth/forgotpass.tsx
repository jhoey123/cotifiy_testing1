import { Head, Link, useForm } from '@inertiajs/react'
import { useState, useEffect } from 'react'

export default function ForgotPassword() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLinkSent(false);
        post('/forgot-password', {
            onSuccess: () => setLinkSent(true),
        });
    }

    return (
        <>
            <Head title="Forgot Password | Cotify" />

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

                .animate-slow-zoom { animation: slowZoom 20s ease-in-out infinite alternate; }
                .shape-move-1 { animation: move-around-1 25s ease-in-out infinite; }
                .shape-move-2 { animation: move-around-2 30s ease-in-out infinite; }
                .shape-move-3 { animation: move-around-3 35s ease-in-out infinite; }
                .shape-spin { animation: spin-slow 40s linear infinite; }

                .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
                .clip-octagon { clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); }
            `}</style>

            <div className="font-sans text-slate-800 bg-[#F1F1F1] antialiased min-h-screen flex relative overflow-hidden">

                {/* BACKGROUND SHAPES — identical to Register */}
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

                        <h2 className="text-4xl font-extrabold mb-4 leading-tight">Forgot your password?</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                            No worries — it happens to everyone. Enter the email you registered with and we'll send you a secure link to set a new password.
                        </p>

                        <ul className="space-y-6 text-base text-slate-300 font-medium">
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-check text-blue-400 text-lg"></i>
                                </div>
                                Secure, time-limited reset link
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-check text-blue-400 text-lg"></i>
                                </div>
                                No password change until you confirm
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-check text-blue-400 text-lg"></i>
                                </div>
                                Back to campus updates in minutes
                            </li>
                        </ul>
                    </div>
                </div>

                {/* RIGHT SIDE: Forgot Password Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12 relative z-10">

                    <Link
                        href="/auth/login"
                        aria-label="Back to login"
                        className="absolute top-6 left-6 sm:top-8 sm:left-8 w-11 h-11 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm z-20 group focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Back to Login"
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

                            <h2 className="text-3xl font-extrabold text-white mb-2">Reset your password</h2>
                            <p className="text-sm font-medium text-slate-300 mb-8">
                                Enter your registered email and we'll send you a reset link.
                            </p>

                            <form onSubmit={submit} className="space-y-5">
                                {linkSent && (
                                    <div
                                        role="status"
                                        aria-live="polite"
                                        className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30"
                                    >
                                        <i className="fa-solid fa-circle-check text-green-400 mt-0.5"></i>
                                        <p className="text-sm font-semibold text-green-300">
                                            If an account is associated with {data.email}, password reset instructions have been sent to that address. Please check your inbox.
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fa-regular fa-envelope text-slate-400 group-focus-within:text-blue-400 transition-colors"></i>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(event) => {
                                                setData('email', event.target.value);
                                                setLinkSent(false);
                                            }}
                                            placeholder="you@example.com"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 rounded-xl border border-slate-600/50 text-white focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                    {errors.email ? (
                                        <p className="mt-1.5 text-xs font-bold text-red-400">{errors.email}</p>
                                    ) : (
                                        <p className="mt-1.5 text-[10px] font-semibold text-slate-400">
                                            Use the same email you registered with.
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full block text-center bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_-6px_rgba(37,99,235,0.6)] mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                >
                                    {processing ? 'Sending link...' : 'Send reset link'}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-white/10 space-y-3 text-center text-sm font-semibold">
                                <p className="text-slate-300">
                                    Remembered it?{' '}
                                    <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 hover:underline font-extrabold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                                        Back to log in
                                    </Link>
                                </p>
                                <p className="text-slate-400">
                                    New here?{' '}
                                    <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 hover:underline font-extrabold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}