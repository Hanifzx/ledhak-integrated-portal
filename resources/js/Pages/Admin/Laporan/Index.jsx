import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import { PageHeader } from '@/Components/Admin/AdminUI';

// Action type → warna dot
const ACTION_COLOR = (action) => {
    if (!action) return 'bg-border-strong';
    if (action.includes('ditambahkan') || action.includes('dikembalikan')) return 'bg-status-ok';
    if (action.includes('dipinjam'))                                        return 'bg-status-err';
    if (action.includes('Status'))                                          return 'bg-status-warn';
    if (action.includes('diperbarui') || action.includes('dihapus'))       return 'bg-subtle';
    return 'bg-primary';
};

export default function LaporanIndex({ logs, filters, total }) {
    const { config } = usePage().props;
    const [search, setSearch]       = useState(filters?.search ?? '');
    const [dateFrom, setDateFrom]   = useState(filters?.date_from ?? '');
    const [dateTo, setDateTo]       = useState(filters?.date_to ?? '');

    const applyFilter = () => {
        router.get(
            route('admin.laporan.index'),
            { search, date_from: dateFrom, date_to: dateTo },
            { preserveState: true, replace: true }
        );
    };

    const resetFilter = () => {
        setSearch(''); setDateFrom(''); setDateTo('');
        router.get(route('admin.laporan.index'), {}, { replace: true });
    };

    return (
        <AdminLayout title="Laporan">
            <Head title="Laporan — LeDHaK" />

            <div className="max-w-5xl mx-auto space-y-5">
                <PageHeader
                    breadcrumb={[
                        { icon: 'history', label: 'Laporan' },
                        { label: 'Log Aktivitas' }
                    ]}
                    title="Log Aktivitas"
                    subtitle={
                        <>Rekam jejak lengkap seluruh perubahan inventaris · <span className="font-semibold text-ink">{total}</span> total log</>
                    }
                    action={
                        <a
                            href={config?.google_sheets_view_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0f9d58] text-white rounded-lg text-body-sm font-semibold hover:bg-[#0b8043] transition-colors shadow-sm flex-shrink-0"
                        >
                            <span className="material-symbols-outlined text-[18px]">table_chart</span>
                            Buka Google Sheets
                        </a>
                    }
                />

                {/* Filter Bar */}
                <div className="bg-surface rounded-xl border border-border-base p-4 shadow-card">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                        <div className="flex-1 min-w-0">
                            <label className="block text-body-sm font-semibold text-ink mb-1">Cari</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle text-[18px]">search</span>
                                <input
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-border-base bg-surface text-body-md text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Aksi, item, atau pengguna..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && applyFilter()}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:flex gap-3">
                            <div>
                                <label className="block text-body-sm font-semibold text-ink mb-1">Dari Tanggal</label>
                                <input type="date"
                                    className="w-full sm:w-auto px-3 py-2 rounded-lg border border-border-base bg-surface text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-body-sm font-semibold text-ink mb-1">Sampai Tanggal</label>
                                <input type="date"
                                    className="w-full sm:w-auto px-3 py-2 rounded-lg border border-border-base bg-surface text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={dateTo} onChange={e => setDateTo(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={applyFilter}
                                className="flex-1 sm:flex-none px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark transition-colors">
                                Filter
                            </button>
                            <button onClick={resetFilter}
                                className="flex-1 sm:flex-none px-4 py-2 border border-border-base bg-surface text-muted rounded-lg text-body-sm hover:border-border-strong hover:text-ink transition-colors">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Timeline Log */}
                <div className="bg-surface rounded-xl border border-border-base shadow-card p-6">
                    {logs?.data?.length > 0 ? (
                        <div className="relative pl-5 border-l-2 border-border-base space-y-5">
                            {logs.data.map((log) => (
                                <div key={log.id} className="relative group">
                                    {/* Timeline dot */}
                                    <div className={`absolute w-3 h-3 rounded-full -left-[27px] top-1.5 border-2 border-surface ${ACTION_COLOR(log.action)}`} />

                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-body-sm font-semibold text-ink">
                                                {log.action}
                                                {log.item && (
                                                    <span className="ml-1 font-normal text-muted">
                                                        · <span className="font-medium text-primary">{log.item.name}</span>
                                                        {' '}
                                                        <span className="font-mono text-label-caps text-subtle">({log.item.item_code})</span>
                                                    </span>
                                                )}
                                            </p>
                                            {log.notes && (
                                                <p className="text-label-md text-muted mt-0.5">{log.notes}</p>
                                            )}
                                            <p className="text-label-caps text-subtle mt-1">
                                                oleh <span className="font-semibold">{log.user?.name ?? 'Sistem'}</span>
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-label-md text-muted whitespace-nowrap">{log.created_at}</p>
                                            <p className="text-label-caps text-subtle">{log.created_at_diff}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-muted">
                            <span className="material-symbols-outlined text-[48px] text-border-base mb-3">history</span>
                            <p className="text-body-md font-medium">Tidak ada log aktivitas</p>
                            <p className="text-body-sm text-subtle mt-1">Coba ubah filter pencarian</p>
                        </div>
                    )}
                </div>

                <Pagination links={logs?.links} />
            </div>
        </AdminLayout>
    );
}
