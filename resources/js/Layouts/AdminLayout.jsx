import { Link, usePage, useForm } from '@inertiajs/react';
import { GooeyToaster } from 'goey-toast';

const navItems = [
    { routeName: 'dashboard',               icon: 'dashboard',   label: 'Beranda' },
    { routeName: 'admin.inventaris.index',  icon: 'inventory_2', label: 'Inventaris' },
    { routeName: 'admin.peminjaman.index',  icon: 'handshake',   label: 'Peminjaman' },
    { routeName: 'admin.laporan.index',     icon: 'history',     label: 'Laporan' },
    { routeName: 'admin.artikel.index',     icon: 'article',     label: 'Artikel' },
    { routeName: 'admin.pengaturan.index',  icon: 'settings',    label: 'Pengaturan' },
];

function NavLink({ routeName, icon, label }) {
    const { url } = usePage();
    const href = route(routeName);
    const isActive = url.startsWith(href.replace(window.location.origin, ''));

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-body-sm font-medium transition-colors duration-150 ${
                isActive
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'text-muted hover:bg-surface-mid hover:text-ink'
            }`}
        >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            {label}
        </Link>
    );
}

export default function AdminLayout({ children, title = '' }) {
    const { auth } = usePage().props;
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'));
    };

    return (
        <div className="flex min-h-screen bg-bg">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-[260px] bg-surface border-r border-border-base flex flex-col z-50">
                {/* Brand */}
                <div className="px-6 pt-6 pb-4 border-b border-border-base">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-on-primary text-[18px]">inventory_2</span>
                        </div>
                        <div>
                            <p className="text-h3 text-ink leading-none">LeDHaK</p>
                            <p className="text-label-caps text-muted mt-0.5">Inventory Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink key={item.routeName} {...item} />
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="px-4 py-4 border-t border-border-base">
                    <div className="flex items-center gap-3 px-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-surface-mid flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-muted text-[18px]">person</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-body-sm font-semibold text-ink truncate">{auth?.user?.name ?? 'Admin'}</p>
                            <p className="text-label-caps text-subtle truncate">{auth?.user?.email ?? ''}</p>
                        </div>
                    </div>
                    <form onSubmit={handleLogout}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-body-sm text-muted hover:bg-status-err-bg hover:text-status-err transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Keluar
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
                {/* Top header */}
                <header className="sticky top-0 z-40 bg-surface border-b border-border-base h-14 flex items-center justify-between px-6">
                    <h1 className="text-h3 text-ink">{title}</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-label-md text-muted">
                            {auth?.user?.name ?? 'Admin'} &nbsp;·&nbsp; UKM LeDHaK UNHAS
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
            <GooeyToaster position="bottom-right" />
        </div>
    );
}
