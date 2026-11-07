import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-8 sm:px-6">
            <div className="mb-6 text-center">
                <Link href="/" className="inline-flex flex-col items-center gap-2.5 group">
                    <img
                        src="/images/logo/logo LeDHaK UNHAS.webp"
                        alt="Logo LeDHaK UNHAS"
                        className="w-16 h-16 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="text-center">
                        <p className="text-body-md font-bold text-ink leading-tight">LeDHaK UNHAS</p>
                        <p className="text-label-caps text-muted font-medium mt-0.5">Portal Terintegrasi</p>
                    </div>
                </Link>
            </div>

            <div className="w-full max-w-md overflow-hidden bg-surface px-6 py-7 sm:px-8 sm:py-8 shadow-card border border-border-base rounded-2xl">
                {children}
            </div>

            <p className="text-label text-muted mt-6 text-center">
                &copy; {new Date().getFullYear()} UKM LeDHaK UNHAS &bull; All rights reserved.
            </p>
        </div>
    );
}
