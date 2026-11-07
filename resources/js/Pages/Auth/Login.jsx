import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-bg">
            <Head title="Login" />

            {/* ── LEFT HERO PANEL (DESKTOP) ── */}
            <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] min-h-screen relative bg-primary text-white flex-col items-center justify-center text-center p-10 xl:p-16 overflow-hidden shadow-2xl select-none flex-shrink-0">
                {/* Ambient Decorative Lighting */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/25 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_70%)] pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center max-w-md">
                    {/* Logo LeDHaK */}
                    <img
                        src="/images/logo/logo LeDHaK UNHAS.webp"
                        alt="Logo LeDHaK UNHAS"
                        className="w-28 h-28 xl:w-32 xl:h-32 object-contain drop-shadow-xl mb-6 transition-transform hover:scale-105 duration-300"
                    />

                    {/* Judul & Universitas */}
                    <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                        LeDHaK UNHAS
                    </h2>
                    <p className="text-xs uppercase tracking-widest text-white/75 font-semibold mt-1">
                        Universitas Hasanuddin
                    </p>

                    {/* Divider halus */}
                    <div className="w-16 h-0.5 bg-white/30 my-5 rounded-full" />

                    {/* Kepanjangan LeDHaK */}
                    <p className="text-base xl:text-lg font-medium text-white/90 leading-snug">
                        Lembaga Dialektika Haluan Kebangsaan
                    </p>

                    {/* Badge Nama Portal */}
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-sm font-semibold tracking-wide backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                        <span>Portal Terintegrasi</span>
                    </div>
                </div>

                {/* Subtle bottom credit */}
                <p className="absolute bottom-6 text-caption text-white/60">
                    &copy; {new Date().getFullYear()} UKM LeDHaK UNHAS
                </p>
            </div>

            {/* ── RIGHT FORM PANEL (MOBILE & DESKTOP) ── */}
            <div className="flex-1 flex flex-col justify-start lg:justify-center items-center px-4 pt-16 pb-10 sm:px-8 lg:px-12 xl:px-20 min-h-screen">
                <div className="w-full max-w-md mx-auto">

                    {/* Mobile Brand Header (< lg) */}
                    <div className="lg:hidden text-center mb-5">
                        <img
                            src="/images/logo/logo LeDHaK UNHAS.webp"
                            alt="Logo LeDHaK UNHAS"
                            className="w-16 h-16 mx-auto mb-2.5 object-contain drop-shadow-sm"
                        />
                        <span className="text-caption font-bold text-primary tracking-wider block">
                            LeDHaK UNHAS
                        </span>
                        <h1 className="text-h2 font-bold text-ink mt-0.5">Portal Terintegrasi</h1>
                        <p className="text-body-sm text-muted mt-0.5">
                            Lembaga Dialektika Haluan Kebangsaan
                        </p>
                    </div>

                    {/* Desktop Heading (>= lg) */}
                    <div className="hidden lg:block mb-6">
                        <h1 className="text-h1 font-bold text-ink tracking-tight">Selamat Datang Kembali</h1>
                        <p className="text-body-md text-muted mt-1.5">
                            Silakan masukkan kredensial akun Anda untuk mengakses panel admin.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border-base shadow-card">

                        {/* Status Flash Message (e.g. after password reset) */}
                        {status && (
                            <div className="mb-5 p-3.5 rounded-xl bg-status-ok-bg border border-status-ok/30 flex items-start gap-2.5 text-status-ok text-body-sm">
                                <span className="material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5">check_circle</span>
                                <span className="font-medium">{status}</span>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-body-sm font-semibold text-ink mb-1.5">
                                    Alamat Email
                                </label>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined text-[20px] text-muted/70 absolute left-3.5 pointer-events-none select-none">
                                        mail
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        autoFocus
                                        required
                                        placeholder="email@example.com"
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`w-full pl-11 pr-3.5 py-2.5 rounded-xl border bg-surface text-ink text-base transition-colors placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary ${
                                            errors.email
                                                ? 'border-status-err focus:border-status-err focus:ring-status-err/30'
                                                : 'border-border-base focus:border-primary'
                                        }`}
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="text-body-sm font-semibold text-ink">
                                        Kata Sandi
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-body-sm font-medium text-primary hover:text-primary-dark transition-colors"
                                        >
                                            Lupa kata sandi?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined text-[20px] text-muted/70 absolute left-3.5 pointer-events-none select-none">
                                        lock
                                    </span>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        required
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`w-full pl-11 pr-11 py-2.5 rounded-xl border bg-surface text-ink text-base transition-colors placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary ${
                                            errors.password
                                                ? 'border-status-err focus:border-status-err focus:ring-status-err/30'
                                                : 'border-border-base focus:border-primary'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                        className="absolute right-3 p-1 rounded-md text-muted hover:text-ink focus:outline-none focus:text-primary transition-colors select-none"
                                        tabIndex="-1"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="pt-0.5">
                                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="text-body-sm text-muted font-medium">
                                        Ingat saya di perangkat ini
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 px-4 rounded-xl text-base font-semibold text-white bg-primary hover:bg-primary-dark active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed select-none"
                                >
                                    {processing ? (
                                        <>
                                            <span className="material-symbols-outlined text-[20px] animate-spin">
                                                progress_activity
                                            </span>
                                            <span>Memverifikasi...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Masuk ke Panel Admin</span>
                                            <span className="material-symbols-outlined text-[20px]">
                                                arrow_forward
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Security Notice Note */}
                        <div className="mt-5 pt-4 border-t border-border-base flex items-start justify-center gap-2.5 text-xs text-muted/80">
                            <span className="material-symbols-outlined text-primary text-[17px] flex-shrink-0 mt-0.5 select-none">
                                verified_user
                            </span>
                            <p className="leading-snug text-left">
                                Akses terbatas khusus pengurus &amp; administrator UKM LeDHaK UNHAS.
                            </p>
                        </div>
                    </div>

                    {/* Mobile Copyright (< lg) */}
                    <div className="lg:hidden mt-5 text-center text-[11px] text-muted/60 leading-normal">
                        &copy; {new Date().getFullYear()} UKM LeDHaK UNHAS &bull; All rights reserved.
                    </div>

                </div>
            </div>
        </div>
    );
}
