import { useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Modal from '@/Components/Admin/Modal';
import { PageHeader } from '@/Components/Admin/AdminUI';
import { toastSuccess, toastError, toastInfo, TOAST_MESSAGES } from '@/Utils/toast';

const DEFAULT_PHOTO = '/images/assets/item_default.webp';
const STATUS_OPTIONS = ['Tersedia', 'Dipinjam', 'Perbaikan'];
const CATEGORY_OPTIONS = [
    'Spanduk & Banner', 'Elektronik & Sound', 'Alat Tulis & Kantor',
    'Perlengkapan Acara', 'Peralatan Fotografi', 'Lain-lain',
];

function cropToSquareBlob(file) {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const size = Math.min(img.width, img.height);
            const x = (img.width - size) / 2;
            const y = (img.height - size) / 2;
            const canvas = document.createElement('canvas');
            canvas.width = 500; canvas.height = 500;
            canvas.getContext('2d').drawImage(img, x, y, size, size, 0, 0, 500, 500);
            URL.revokeObjectURL(url);
            canvas.toBlob(resolve, 'image/jpeg', 0.88);
        };
        img.src = url;
    });
}

function PhotoInput({ preview, onFileChange, error }) {
    const inputRef = useRef();
    const handleChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 1024 * 1024) { alert('Ukuran file maksimal 1 MB'); e.target.value = ''; return; }
        const blob = await cropToSquareBlob(file);
        const cropped = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
        onFileChange(cropped, URL.createObjectURL(blob));
    };
    return (
        <div>
            <label className="block text-label-md text-muted mb-2">Foto Barang</label>
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border-base overflow-hidden bg-bg flex-shrink-0">
                    <img src={preview || DEFAULT_PHOTO} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <button type="button" onClick={() => inputRef.current.click()}
                        className="flex items-center gap-2 px-3 py-2 border border-border-base rounded-lg text-body-sm text-muted hover:bg-bg hover:border-primary transition-colors">
                        <span className="material-symbols-outlined text-[16px]">upload</span>
                        Pilih Foto
                    </button>
                    <p className="text-label-caps text-subtle mt-1.5">JPEG / PNG / WebP · maks 1 MB · otomatis crop 1:1</p>
                    {error && <p className="text-label-md text-status-err mt-1">{error}</p>}
                    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleChange} />
                </div>
            </div>
        </div>
    );
}

function QuickAddItemModal({ show, onClose }) {
    const [photoPreview, setPhotoPreview] = useState(null);
    const form = useForm({ name: '', item_code: '', category: '', status: 'Tersedia', description: '', photo: null });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route('admin.inventaris.store'), {
            forceFormData: true,
            onSuccess: () => {
                const m = TOAST_MESSAGES.itemAdded;
                toastSuccess(m.title, m.description);
                onClose();
                router.visit(route('admin.inventaris.index'));
            },
            onError: () => toastError(TOAST_MESSAGES.failed.title, TOAST_MESSAGES.failed.description),
        });
    };

    return (
        <Modal show={show} title="Tambah Barang Baru" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <PhotoInput
                    preview={photoPreview}
                    onFileChange={(file, preview) => { form.setData('photo', file); setPhotoPreview(preview); }}
                    error={form.errors.photo}
                />
                <div>
                    <label className="block text-label-md text-muted mb-1">Nama Barang *</label>
                    <input
                        className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
                        value={form.data.name} onChange={e => form.setData('name', e.target.value)} required
                    />
                    {form.errors.name && <p className="text-label-md text-status-err mt-1">{form.errors.name}</p>}
                </div>
                <div>
                    <label className="block text-label-md text-muted mb-1">Kode Barang (opsional)</label>
                    <input
                        className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface font-mono"
                        value={form.data.item_code} onChange={e => form.setData('item_code', e.target.value)}
                        placeholder="Auto-generate jika kosong"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-label-md text-muted mb-1">Kategori *</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
                            value={form.data.category} onChange={e => form.setData('category', e.target.value)} required
                        >
                            <option value="">Pilih kategori</option>
                            {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                        </select>
                        {form.errors.category && <p className="text-label-md text-status-err mt-1">{form.errors.category}</p>}
                    </div>
                    <div>
                        <label className="block text-label-md text-muted mb-1">Status *</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
                            value={form.data.status} onChange={e => form.setData('status', e.target.value)}
                        >
                            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-label-md text-muted mb-1">Deskripsi</label>
                    <textarea
                        className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface resize-none"
                        rows={3} value={form.data.description} onChange={e => form.setData('description', e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 rounded-lg text-body-sm text-muted border border-border-base hover:bg-bg transition-colors">
                        Batal
                    </button>
                    <button type="submit" disabled={form.processing}
                        className="px-5 py-2 rounded-lg text-body-sm bg-primary text-on-primary font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors">
                        {form.processing ? 'Menyimpan...' : 'Simpan & Lihat Inventaris'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

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

export default function Dashboard({ metrics, overdue_loans, recent_logs, draft_articles }) {
    const [showAddModal, setShowAddModal] = useState(false);

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
                            onClick={() => setShowAddModal(true)}
                            className="w-full py-3 px-4 bg-primary text-on-primary rounded-lg text-body-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">add_box</span>
                            Tambah Barang Baru
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
            <QuickAddItemModal show={showAddModal} onClose={() => setShowAddModal(false)} />
        </AdminLayout>
    );
}
