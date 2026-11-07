import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import LoanFormModal from '@/Components/Admin/LoanFormModal';
import { PageHeader } from '@/Components/Admin/AdminUI';
import { toastInfo } from '@/Utils/toast';

function MetricCard({ icon, label, value, sub, subClass = 'text-muted' }) {
    return (
        <div className="bg-surface rounded-xl border border-border-base shadow-card group relative overflow-hidden
            p-3 sm:p-5">
            {/* Decorative bg icon — hidden on very small screens to save space */}
            <div className="absolute -right-3 -top-3 opacity-[0.06] group-hover:scale-110 transition-transform duration-500 hidden sm:block">
                <span className="material-symbols-outlined text-[100px] text-ink">{icon}</span>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
                {/* Icon badge */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary-soft flex items-center justify-center mb-2 sm:mb-3">
                    <span className="material-symbols-outlined text-primary text-[16px] sm:text-[18px]">{icon}</span>
                </div>
                {/* Label */}
                <p className="text-[10px] sm:text-body-sm text-muted font-medium leading-tight mb-1 sm:mb-3 line-clamp-2">{label}</p>
                {/* Value */}
                <p className="text-2xl sm:text-[36px] font-bold text-ink leading-none mb-0.5 sm:mb-1">{value}</p>
                {/* Sub */}
                <p className={`text-[10px] sm:text-label-md font-medium leading-tight ${subClass}`}>{sub}</p>
            </div>
        </div>
    );
}

export default function Dashboard({ metrics, overdue_loans, recent_logs, draft_articles, items_available = [] }) {
    const [showLoanModal, setShowLoanModal] = useState(false);

    const handleArtikelUnavailable = (e) => {
        e?.preventDefault?.();
        toastInfo('Fitur Belum Tersedia', 'Fitur publikasi dan pengelolaan artikel saat ini masih dalam tahap pengembangan.');
    };

    return (
        <AdminLayout title="Beranda">
            <Head title="Dashboard" />

            <div className="max-w-6xl mx-auto space-y-5">
                {/* Page Header */}
                <PageHeader
                    breadcrumb={[
                        { icon: 'dashboard', label: 'Beranda' },
                        { label: 'Ringkasan' }
                    ]}
                    title="Selamat Datang, Admin!"
                    subtitle="Ringkasan operasional inventaris UKM LeDHaK UNHAS hari ini."
                />

                {/* Metric Cards — 3-col on all breakpoints, compact on mobile */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <MetricCard
                        icon="inventory_2"
                        label="Total Inventaris"
                        value={metrics?.total_items ?? 0}
                        sub={`${metrics?.available ?? 0} Tersedia`}
                    />
                    <MetricCard
                        icon="handshake"
                        label="Sirkulasi Aktif"
                        value={metrics?.borrowed ?? 0}
                        sub={metrics?.overdue > 0 ? `${metrics.overdue} Terlambat` : 'Semua Tepat Waktu'}
                        subClass={metrics?.overdue > 0 ? 'text-status-err' : 'text-status-ok'}
                    />
                    <MetricCard
                        icon="article"
                        label="Publikasi Artikel"
                        value={metrics?.articles_total ?? 0}
                        sub={`${metrics?.articles_draft ?? 0} Draft Menunggu`}
                    />
                </div>

                {/* Urgency + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                    {/* Overdue */}
                    <div className="lg:col-span-2 bg-surface rounded-xl border border-border-base p-5 shadow-card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-h3 text-ink flex items-center gap-2">
                                <span className="material-symbols-outlined text-status-err text-[20px]">warning</span>
                                Peringatan Terlambat
                            </h3>
                            <Link href={route('admin.peminjaman.index')} className="text-label-md text-primary hover:underline font-semibold">
                                Lihat Semua
                            </Link>
                        </div>
                        {overdue_loans?.length > 0 ? (
                            <div className="space-y-2">
                                {overdue_loans.map((loan) => (
                                    <div key={loan.id} className="flex items-center justify-between gap-2 p-3 bg-bg rounded-lg border-l-4 border-primary">
                                        <div className="min-w-0">
                                            <p className="text-body-sm font-semibold text-ink truncate">{loan.item?.name}</p>
                                            <p className="text-label-md text-muted truncate">Peminjam: {loan.borrower_name}</p>
                                        </div>
                                        <span className="text-label-caps font-bold text-status-err bg-status-err-bg px-2 py-0.5 rounded-full flex-shrink-0">
                                            Terlambat
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-8 text-muted">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-[32px] block mb-2 text-status-ok">check_circle</span>
                                    <p className="text-body-sm">Tidak ada peminjaman terlambat</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-surface rounded-xl border border-border-base p-5 shadow-card flex flex-col justify-center gap-3">
                        <h3 className="text-h3 text-ink text-center mb-2">Aksi Cepat</h3>
                        <button
                            type="button"
                            onClick={() => setShowLoanModal(true)}
                            className="w-full py-3 px-4 bg-primary text-on-primary rounded-lg text-body-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">handshake</span>
                            Catat Peminjaman
                        </button>
                        <button
                            type="button"
                            onClick={handleArtikelUnavailable}
                            className="w-full py-3 px-4 border-2 border-primary text-primary rounded-lg text-body-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-soft transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">edit_document</span>
                            Tulis Artikel Baru
                        </button>
                    </div>
                </div>

                {/* Log + Drafts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {/* Activity Log */}
                    <div className="bg-surface rounded-xl border border-border-base p-5 shadow-card">
                        <h3 className="text-h3 text-ink flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-muted text-[20px]">history</span>
                            Log Aktivitas Terbaru
                        </h3>
                        <div className="relative pl-4 border-l-2 border-border-base space-y-4">
                            {recent_logs?.length > 0 ? recent_logs.map((log) => (
                                <div key={log.id} className="relative">
                                    <div className="absolute w-2.5 h-2.5 bg-primary rounded-full -left-[21px] top-1.5 border-2 border-surface" />
                                    <p className="text-body-sm text-ink">
                                        <span className="font-semibold">{log.user?.name ?? 'Sistem'}</span>
                                        {' — '}{log.action}
                                        {log.item && <span className="italic"> ({log.item.name})</span>}
                                    </p>
                                    <p className="text-label-caps text-subtle mt-0.5">{log.notes}</p>
                                </div>
                            )) : (
                                <p className="text-body-sm text-muted">Belum ada aktivitas.</p>
                            )}
                        </div>
                    </div>

                    {/* Draft Articles */}
                    <div className="bg-surface rounded-xl border border-border-base p-5 shadow-card">
                        <h3 className="text-h3 text-ink flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-muted text-[20px]">draft</span>
                            Draft Artikel Terakhir
                        </h3>
                        <div className="space-y-3">
                            {draft_articles?.length > 0 ? draft_articles.map((art) => (
                                <div key={art.id} className="flex items-start justify-between p-3 bg-bg rounded-lg border border-border-base hover:border-primary transition-colors group">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-body-sm font-semibold text-ink truncate">{art.title}</p>
                                        <p className="text-label-md text-muted mt-0.5">Draft · {art.updated_at_diff}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleArtikelUnavailable}
                                        className="ml-3 p-1.5 text-subtle hover:text-primary rounded-lg hover:bg-primary-soft transition-colors flex-shrink-0"
                                        title="Fitur dalam tahap pengembangan"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                </div>
                            )) : (
                                <p className="text-body-sm text-muted">Tidak ada draft artikel.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <LoanFormModal
                show={showLoanModal}
                onClose={() => setShowLoanModal(false)}
                items_available={items_available}
            />
        </AdminLayout>
    );
}
