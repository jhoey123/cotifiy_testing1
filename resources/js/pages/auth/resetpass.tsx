import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface ResetPasswordProps {
    email: string;
    token: string;
}

export default function ResetPassword({ email, token }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        email,
        token,
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post('/account/password/reset');
    }

    return (
        <>
            <Head title="Choose a New Password | Cotify" />

            <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F1F1F1] px-4 py-12 font-sans text-slate-800 antialiased">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
                </div>

                <section className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] sm:p-10">
                    <div className="mb-8 flex items-center">
                        <img
                            src="/images/3rdLogo.png"
                            alt="Cotify Logo"
                            className="-mr-3 -ml-4 h-20 w-20 object-contain"
                        />
                        <div>
                            <h1 className="text-3xl leading-tight font-extrabold text-white">
                                Cotify
                            </h1>
                            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                                Your Campus Portal
                            </p>
                        </div>
                    </div>

                    <h2 className="mb-2 text-3xl font-extrabold text-white">
                        Choose a new password
                    </h2>
                    <p className="mb-8 text-sm font-medium text-slate-300">
                        Create a new password for your account.
                    </p>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-xs font-bold tracking-wide text-slate-300 uppercase"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                autoComplete="email"
                                required
                                className="w-full rounded-xl border border-slate-600/50 bg-slate-900/60 px-4 py-3.5 text-sm font-medium text-white transition-all outline-none focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/20"
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs font-bold text-red-400">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-xs font-bold tracking-wide text-slate-300 uppercase"
                            >
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(event) =>
                                    setData('password', event.target.value)
                                }
                                autoComplete="new-password"
                                required
                                className="w-full rounded-xl border border-slate-600/50 bg-slate-900/60 px-4 py-3.5 text-sm font-medium text-white transition-all outline-none focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/20"
                            />
                            {errors.password && (
                                <p className="mt-1.5 text-xs font-bold text-red-400">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-1.5 block text-xs font-bold tracking-wide text-slate-300 uppercase"
                            >
                                Confirm New Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(event) =>
                                    setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                                autoComplete="new-password"
                                required
                                className="w-full rounded-xl border border-slate-600/50 bg-slate-900/60 px-4 py-3.5 text-sm font-medium text-white transition-all outline-none focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/20"
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1.5 text-xs font-bold text-red-400">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-6 w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_12px_25px_-6px_rgba(37,99,235,0.6)] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none disabled:opacity-60"
                        >
                            {processing
                                ? 'Updating password...'
                                : 'Reset password'}
                        </button>
                    </form>

                    <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm font-semibold">
                        <Link
                            href="/forgot-password"
                            className="text-blue-400 transition-colors hover:text-blue-300 hover:underline focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            Request a new reset link
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
