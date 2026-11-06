import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';

/* ─────────────── Status config ─────────────── */
const STATUS_CONFIG = {
    'Tersedia': {
        pill: 'bg-[#DCFCE7] text-[#166534] border-[#bbf7d0]',
        dot:  'bg-[#166534]',
        icon: 'check_circle',
        actionBg: 'bg-primary hover:bg-primary-dark',
    },
    'Dipinjam': {
        pill: 'bg-[#FEE2E2] text-[#991B1B] border-[#fecaca]',
        dot:  'bg-[#991B1B]',
        icon: 'schedule',
        actionBg: 'bg-[#166534] hover:bg-[#14532d]',
    },
    'Perbaikan': {
        pill: 'bg-[#FEF3C7] text-[#92400E] border-[#fde68a]',
        dot:  'bg-[#92400E]',
        icon: 'build',
        actionBg: null,
    },
    'Hilang': {
        pill: 'bg-[#FEE2E2] text-[#991B1B] border-[#fecaca]',
        dot:  'bg-[#991B1B]',
        icon: 'help',
        actionBg: null,
    },
};

const DEFAULT_PHOTO = '/images/assets/item_default.webp';

function Divider() {
    return <div className="h-px bg-border-base" />;
}

function InfoRow({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2.5">
            <span className="text-label-md text-subtle uppercase tracking-widest flex-shrink-0">{label}</span>
            <span className="text-body-md text-ink font-medium text-right">{value}</span>
        </div>
    );
}

export default function ItemDetail({ item, hash }) {
    const { auth } = usePage().props;
    const isAdminLoggedIn = auth && auth.user;
    const statusCfg = STATUS_CONFIG[item.status] ?? {
        pill: 'bg-surface-mid text-muted border-border-base',
        dot:  'bg-muted',
        icon: 'info',
        actionBg: null,
    };

    /* ── Shared: action buttons ── */
    const ActionZone = () => (
        isAdminLoggedIn ? (
            <div className="space-y-3">
                {item.status === 'Tersedia' && (
                    <Link
                        href={route('admin.peminjaman.index', { scan_action: 'loan', item_id: item.id })}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-on-primary rounded-xl text-body-md font-bold hover:bg-primary-dark active:scale-[.98] transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        Proses Peminjaman
                    </Link>
                )}
                {item.status === 'Dipinjam' && item.active_loan_id && (
                    <Link
                        href={route('admin.peminjaman.index', { scan_action: 'return', loan_id: item.active_loan_id })}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#166534] text-white rounded-xl text-body-md font-bold hover:bg-[#14532d] active:scale-[.98] transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        Konfirmasi Pengembalian
                    </Link>
                )}
                {(item.status === 'Perbaikan' || item.status === 'Hilang') && (
                    <div className="w-full flex items-center justify-center gap-2 py-3.5 bg-surface-mid text-subtle rounded-xl text-body-md font-medium border border-border-base">
                        <span className="material-symbols-outlined text-[20px]">{statusCfg.icon}</span>
                        Barang tidak dapat dipinjam
                    </div>
                )}
            </div>
        ) : (
            <div className="text-center pt-1">
                <Link
                    href={route('login.redirect', { redirect: route('public.item.show', { hash }) })}
                    className="inline-flex items-center gap-1.5 text-body-sm text-primary font-medium hover:underline underline-offset-4 transition-colors"
                >
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    Login sebagai pengurus
                </Link>
            </div>
        )
    );

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            <Head title={`${item.name} — LeDHaK`} />

            {/* ══════════════════════════════════════
                MOBILE  (<sm): full-screen vertical
                DESKTOP (≥sm): centered landscape card
                ══════════════════════════════════════ */}

            {/* ── MOBILE layout ── */}
            <div className="flex flex-col flex-1 sm:hidden">
                {/* Header */}
                <header className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border-base">
                    <img src="/images/logo/logo LeDHaK UNHAS.webp" alt="Logo LeDHaK" className="w-6 h-6 object-contain flex-shrink-0" />
                    <span className="text-label-md font-semibold text-muted tracking-wide uppercase">Inventaris LeDHaK UNHAS</span>
                </header>

                {/* Photo hero */}
                <div className="relative w-full aspect-square bg-surface-mid overflow-hidden flex-shrink-0">
                    <img src={item.photo_url || DEFAULT_PHOTO} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-md font-semibold border ${statusCfg.pill} shadow-sm backdrop-blur-sm`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusCfg.dot}`} />
                            {item.status}
                        </span>
                    </div>
                </div>

                {/* Info panel */}
                <div className="flex-1 bg-surface">
                    <div className="px-5 pt-6 pb-4">
                        <p className="text-label-caps text-primary uppercase tracking-widest mb-1">{item.category}</p>
                        <h1 className="text-h1 text-ink leading-tight">{item.name}</h1>
                        <p className="mt-1 font-mono text-body-sm text-subtle">{item.item_code}</p>
                    </div>
                    <Divider />
                    <div className="px-5 divide-y divide-border-base">
                        <InfoRow label="Kategori" value={item.category} />
                        <InfoRow label="Status"   value={item.status} />
                        {item.description && (
                            <div className="py-4">
                                <p className="text-label-caps text-subtle uppercase tracking-widest mb-2">Deskripsi</p>
                                <p className="text-body-md text-muted whitespace-pre-wrap leading-relaxed">{item.description}</p>
                            </div>
                        )}
                    </div>
                    <Divider />
                    <div className="px-5 py-5"><ActionZone /></div>
                </div>

                {/* Footer */}
                <div className="bg-surface border-t border-border-base px-5 py-4 text-center">
                    <p className="text-label-sm text-subtle">Portal Terintegrasi UKM LeDHaK UNHAS</p>
                </div>
            </div>

            {/* ── DESKTOP layout: landscape split card ── */}
            <div className="hidden sm:flex flex-1 items-center justify-center p-8">
                <div className="w-full max-w-3xl bg-surface rounded-2xl shadow-card border border-border-base overflow-hidden flex flex-col">

                    {/* Top header bar */}
                    <header className="flex items-center gap-2 px-5 py-3 border-b border-border-base">
                        <img src="/images/logo/logo LeDHaK UNHAS.webp" alt="Logo LeDHaK" className="w-5 h-5 object-contain flex-shrink-0" />
                        <span className="text-label-md font-semibold text-muted tracking-wide uppercase">Inventaris LeDHaK UNHAS</span>
                    </header>

                    {/* Split body: left = photo, right = info */}
                    <div className="flex flex-1 min-h-0">

                        {/* Left: photo */}
                        <div className="relative w-72 flex-shrink-0 bg-surface-mid overflow-hidden">
                            <img
                                src={item.photo_url || DEFAULT_PHOTO}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Bottom scrim + status */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-md font-semibold border ${statusCfg.pill} shadow-sm backdrop-blur-sm`}>
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusCfg.dot}`} />
                                    {item.status}
                                </span>
                            </div>
                        </div>

                        {/* Right: info */}
                        <div className="flex-1 flex flex-col border-l border-border-base min-w-0">

                            {/* Identity block */}
                            <div className="px-6 pt-6 pb-4">
                                <p className="text-label-caps text-primary uppercase tracking-widest mb-1">{item.category}</p>
                                <h1 className="text-h2 text-ink leading-snug">{item.name}</h1>
                                <p className="mt-1 font-mono text-body-sm text-subtle">{item.item_code}</p>
                            </div>

                            <Divider />

                            {/* Attribute rows */}
                            <div className="px-6 divide-y divide-border-base">
                                <InfoRow label="Kategori" value={item.category} />
                                <InfoRow label="Status"   value={item.status} />
                                {item.description && (
                                    <div className="py-3">
                                        <p className="text-label-caps text-subtle uppercase tracking-widest mb-1.5">Deskripsi</p>
                                        <p className="text-body-sm text-muted whitespace-pre-wrap leading-relaxed line-clamp-4">
                                            {item.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Spacer pushes action to bottom */}
                            <div className="flex-1" />

                            <Divider />

                            {/* Action zone */}
                            <div className="px-6 py-5"><ActionZone /></div>
                        </div>
                    </div>

                    {/* Bottom footer bar */}
                    <div className="border-t border-border-base px-5 py-3 text-center">
                        <p className="text-label-sm text-subtle">Portal Terintegrasi UKM LeDHaK UNHAS</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
