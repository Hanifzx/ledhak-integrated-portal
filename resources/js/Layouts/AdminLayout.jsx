import { useEffect, useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { Toaster } from '@/Components/ui/sonner';
import ConfirmAction from '@/Components/Admin/ConfirmAction';
import { toastSuccess, toastError, toastInfo } from '@/Utils/toast';

const navItems = [
    { routeName: 'dashboard',               icon: 'dashboard',   label: 'Beranda' },
    { routeName: 'admin.inventaris.index',  icon: 'inventory_2', label: 'Inventaris' },
    { routeName: 'admin.peminjaman.index',  icon: 'handshake',   label: 'Peminjaman' },
    { routeName: 'admin.laporan.index',     icon: 'history',     label: 'Laporan' },
    { routeName: 'admin.artikel.index',     icon: 'article',     label: 'Artikel' },
    { routeName: 'admin.pengaturan.index',  icon: 'settings',    label: 'Pengaturan' },
];

// Menu yang muncul di bottom nav mobile (5 item)
const bottomNavItems = [
    { routeName: 'dashboard',               icon: 'dashboard',   label: 'Beranda' },
    { routeName: 'admin.inventaris.index',  icon: 'inventory_2', label: 'Inventaris' },
    { routeName: 'admin.peminjaman.index',  icon: 'handshake',   label: 'Peminjaman' },
    { routeName: 'admin.laporan.index',     icon: 'history',     label: 'Laporan' },
    { routeName: 'admin.pengaturan.index',  icon: 'settings',    label: 'Pengaturan' },
];



function BottomNavItem({ routeName, icon, label }) {
    const { url } = usePage();

    // route() returns full URL, strip origin to get path only
    let path = '/';
    try {
        const full = route(routeName);
        path = full.replace(window.location.origin, '');
    } catch (_) {}

    // Active: current url starts with path (handles nested routes)
    // For dashboard specifically, match exactly to avoid "/" matching everything
    const isActive = path === '/'
        ? url === '/'
        : url === path || url.startsWith(path + '/') || url.startsWith(path + '?');

    return (
        <Link
            href={path}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 select-none active:opacity-10 transition-opacity"
        >
            {/* Icon — merah saat aktif, abu saat tidak aktif */}
            <span
                className={`material-symbols-outlined text-[24px] transition-all duration-150 ${
                    isActive ? 'text-primary' : 'text-muted'
                }`}
                style={{
                    fontVariationSettings: isActive
                        ? "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24"
                        : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                }}
            >
                {icon}
            </span>

            {/* Label */}
            <span
                className={`text-[10px] leading-none font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-primary' : 'text-muted'
                }`}
            >
                {label}
            </span>
        </Link>
    );
}

function SidebarNavLink({ routeName, icon, label, onClick }) {
    const { url } = usePage();
    let href = '/';
    try { href = route(routeName); } catch (_) {}
    const path = href.replace(window.location.origin, '');
    const isActive = path === '/'
        ? url === '/'
        : url === path || url.startsWith(path + '/') || url.startsWith(path + '?');

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-body-sm transition-colors duration-150 ${
                isActive
                    ? 'bg-surface text-primary font-bold shadow-sm'
                    : 'text-white hover:bg-white/15 font-medium'
            }`}
        >
            <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-white'}`}>{icon}</span>
            <span className={isActive ? 'text-primary font-bold' : 'text-white'}>{label}</span>
        </Link>
    );
}


export default function AdminLayout({ children, title = '' }) {
    const { auth, flash } = usePage().props;
    const { post } = useForm();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    // Auto-display flash messages from Laravel controllers
    useEffect(() => {
        if (flash?.success) toastSuccess(flash.success);
        if (flash?.error)   toastError(flash.error);
        if (flash?.info)    toastInfo(flash.info);
    }, [flash]);

    // Close sidebar on route change
    const { url } = usePage();
    useEffect(() => {
        setSidebarOpen(false);
    }, [url]);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'));
    };

    const SidebarContent = ({ onLinkClick }) => (
        <>
            {/* Brand */}
            <div className="px-6 pt-5 pb-4 border-b-2 border-white/30 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <img
                        src="/images/logo/logo LeDHaK UNHAS.webp"
                        alt="Logo LeDHaK UNHAS"
                        className="w-11 h-11 lg:w-12 lg:h-12 object-contain flex-shrink-0 drop-shadow-sm"
                    />
                    <div className="flex flex-col justify-center">
                        <p className="text-body-md lg:text-h3 text-white leading-none font-bold tracking-tight">LeDHaK UNHAS</p>
                        <p className="text-label-caps text-white mt-1 leading-none font-medium">Inventory Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {navItems.map((item) => (
                    <SidebarNavLink key={item.routeName} {...item} onClick={onLinkClick} />
                ))}
            </nav>

            {/* User + Logout */}
            <div className="px-4 py-4 border-t-2 border-white/30 flex-shrink-0">
                <div className="flex items-center gap-3 px-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-[18px]">person</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-body-sm font-semibold text-white truncate">{auth?.user?.name ?? 'Admin'}</p>
                        <p className="text-label-caps text-white truncate mt-0.5 font-medium">{auth?.user?.email ?? ''}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setLogoutConfirmOpen(true)}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-body-sm text-white hover:bg-white/15 transition-colors font-medium"
                >
                    <span className="material-symbols-outlined text-[18px] text-white">logout</span>
                    Keluar
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-bg">

            {/* ── DESKTOP SIDEBAR (lg+) ── */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] bg-primary border-r border-primary-dark flex-col z-50 rounded-tr-2xl rounded-br-3xl">
                <SidebarContent onLinkClick={() => {}} />
            </aside>

            {/* ── MOBILE SIDEBAR OVERLAY ── */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setSidebarOpen(false)}
                    />
                    {/* Drawer */}
                    <aside className="relative w-[280px] max-w-[85vw] h-full bg-primary flex flex-col shadow-2xl animate-slide-in-left rounded-tr-2xl rounded-br-3xl">
                        {/* Close button */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                            aria-label="Tutup menu"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                        <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
                    </aside>
                </div>
            )}

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
                {/* Page content — extra bottom padding on mobile so bottom nav doesn't cover content */}
                <main className="flex-1 p-4 lg:p-6 lg:pb-6" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 5rem)' }}>
                    {children}
                </main>
            </div>

            {/* ── MOBILE BOTTOM NAV (hidden on lg+) ── */}
            <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border-base flex items-stretch" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
                <div className="flex items-stretch w-full h-[60px]">
                    {bottomNavItems.map((item) => (
                        <BottomNavItem key={item.routeName} {...item} />
                    ))}
                </div>
            </nav>

            <ConfirmAction
                open={logoutConfirmOpen}
                onOpenChange={setLogoutConfirmOpen}
                onConfirm={() => {
                    setLogoutConfirmOpen(false);
                    post(route('logout'));
                }}
                title="Keluar dari Akun?"
                description="Anda akan keluar dari sesi admin portal inventaris LeDHaK UNHAS."
                confirmText="Ya, Keluar"
                cancelText="Batal"
                variant="destructive"
            />

            <Toaster />
        </div>
    );
}
