import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Modal from '@/Components/Admin/Modal';
import Pagination from '@/Components/Admin/Pagination';

const STATUS_OPTIONS = ['Tersedia', 'Dipinjam', 'Perbaikan'];
const CATEGORY_OPTIONS = [
    'Spanduk & Banner', 'Elektronik & Sound', 'Alat Tulis & Kantor',
    'Perlengkapan Acara', 'Peralatan Fotografi', 'Lain-lain',
];

function ItemForm({ form, onSubmit, onClose, title }) {
    return (
        <Modal show title={title} onClose={onClose}>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-label-md text-muted mb-1">Nama Barang *</label>
                    <input
                        className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface"
                        value={form.data.name}
                        onChange={e => form.setData('name', e.target.value)}
                        required
                    />
                    {form.errors.name && <p className="text-label-md text-status-err mt-1">{form.errors.name}</p>}
                </div>
                <div>
                    <label className="block text-label-md text-muted mb-1">Kode Barang (opsional)</label>
                    <input
                        className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface font-mono"
                        value={form.data.item_code}
                        onChange={e => form.setData('item_code', e.target.value)}
                        placeholder="Auto-generate jika kosong"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-label-md text-muted mb-1">Kategori *</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                            value={form.data.category}
                            onChange={e => form.setData('category', e.target.value)}
                            required
                        >
                            <option value="">Pilih kategori</option>
                            {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                        </select>
                        {form.errors.category && <p className="text-label-md text-status-err mt-1">{form.errors.category}</p>}
                    </div>
                    <div>
                        <label className="block text-label-md text-muted mb-1">Status *</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                            value={form.data.status}
                            onChange={e => form.setData('status', e.target.value)}
                        >
                            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-label-md text-muted mb-1">Deskripsi</label>
                    <textarea
                        className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface resize-none"
                        rows={3}
                        value={form.data.description}
                        onChange={e => form.setData('description', e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-body-sm text-muted border border-border-base hover:bg-bg transition-colors">
                        Batal
                    </button>
                    <button type="submit" disabled={form.processing}
                        className="px-5 py-2 rounded-lg text-body-sm bg-primary text-on-primary font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
                    >
                        {form.processing ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function StatusModal({ item, onClose }) {
    const form = useForm({ status: item?.status ?? 'Tersedia', notes: '' });
    const submit = (e) => {
        e.preventDefault();
        form.patch(route('admin.inventaris.status', item.id), { onSuccess: onClose });
    };
    return (
        <Modal show title="Ubah Status Barang" onClose={onClose} size="sm">
            <form onSubmit={submit} className="space-y-4">
                <p className="text-body-sm text-muted">Barang: <span className="font-semibold text-ink">{item?.name}</span></p>
                <div>
                    <label className="block text-label-md text-muted mb-1">Status Baru *</label>
                    <select
                        className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                        value={form.data.status}
                        onChange={e => form.setData('status', e.target.value)}
                    >
                        {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-label-md text-muted mb-1">Catatan</label>
                    <input
                        className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                        value={form.data.notes}
                        onChange={e => form.setData('notes', e.target.value)}
                        placeholder="Alasan perubahan status..."
                    />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-body-sm text-muted border border-border-base hover:bg-bg transition-colors">Batal</button>
                    <button type="submit" disabled={form.processing}
                        className="px-5 py-2 rounded-lg text-body-sm bg-primary text-on-primary font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
                    >
                        {form.processing ? 'Menyimpan...' : 'Update Status'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

const FILTER_LABELS = ['Semua', 'Tersedia', 'Dipinjam', 'Perbaikan'];

export default function InventarisIndex({ items, filters }) {
    const [modal, setModal] = useState(null); // null | { type: 'add' | 'edit' | 'status' | 'delete', item? }

    const addForm = useForm({ name: '', item_code: '', category: '', status: 'Tersedia', description: '' });
    const editForm = useForm({ name: '', item_code: '', category: '', status: 'Tersedia', description: '' });

    const openEdit = (item) => {
        editForm.setData({ name: item.name, item_code: item.item_code, category: item.category, status: item.status, description: item.description ?? '' });
        setModal({ type: 'edit', item });
    };

    const handleAdd = (e) => {
        e.preventDefault();
        addForm.post(route('admin.inventaris.store'), {
            onSuccess: () => { addForm.reset(); setModal(null); },
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editForm.put(route('admin.inventaris.update', modal.item.id), {
            onSuccess: () => setModal(null),
        });
    };

    const handleDelete = (item) => {
        if (!confirm(`Hapus "${item.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        router.delete(route('admin.inventaris.destroy', item.id));
    };

    const applyFilter = (status) => {
        router.get(route('admin.inventaris.index'), { status: status === 'Semua' ? '' : status, search: filters?.search ?? '' }, { preserveState: true, replace: true });
    };

    const applySearch = (e) => {
        router.get(route('admin.inventaris.index'), { search: e.target.value, status: filters?.status ?? '' }, { preserveState: true, replace: true });
    };

    const activeFilter = filters?.status || 'Semua';

    return (
        <AdminLayout title="Inventaris">
            <Head title="Inventaris — LeDHaK" />

            <div className="max-w-6xl mx-auto space-y-5">
                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-h1 text-ink">Daftar Barang</h2>
                        <p className="text-body-sm text-muted mt-1">
                            {items?.total ?? 0} total aset inventaris
                        </p>
                    </div>
                    <button
                        onClick={() => setModal({ type: 'add' })}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark transition-colors shadow-card"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Tambah Barang
                    </button>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle text-[18px]">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-base bg-surface text-body-md text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Cari kode atau nama barang..."
                            defaultValue={filters?.search ?? ''}
                            onChange={applySearch}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {FILTER_LABELS.map(f => (
                            <button
                                key={f}
                                onClick={() => applyFilter(f)}
                                className={`px-4 py-2 rounded-full text-label-md font-semibold transition-colors ${
                                    activeFilter === f || (f === 'Semua' && !filters?.status)
                                        ? 'bg-primary text-on-primary'
                                        : 'bg-surface border border-border-base text-muted hover:bg-bg'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Item Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items?.data?.length > 0 ? items.data.map((item) => (
                        <div key={item.id} className="bg-surface rounded-xl border border-border-base shadow-card hover:shadow-card-hover hover:border-primary transition-all group">
                            <div className="p-4 flex gap-4 items-start">
                                <div className="w-16 h-16 rounded-lg bg-bg flex items-center justify-center flex-shrink-0 overflow-hidden border border-border-base">
                                    {item.photo_path ? (
                                        <img src={`/storage/${item.photo_path}`} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-subtle text-[28px]">inventory_2</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className="text-label-caps text-subtle font-mono">{item.item_code}</p>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    <h3 className="text-body-md font-semibold text-ink truncate group-hover:text-primary transition-colors">{item.name}</h3>
                                    <p className="text-label-md text-muted">{item.category}</p>
                                </div>
                            </div>
                            <div className="border-t border-border-base px-4 py-2.5 flex gap-2 justify-end">
                                <button onClick={() => setModal({ type: 'status', item })} className="text-label-md text-primary border border-primary px-3 py-1 rounded-lg hover:bg-primary-soft transition-colors font-medium">
                                    Ubah Status
                                </button>
                                <button onClick={() => openEdit(item)} className="text-label-md text-muted border border-border-base px-3 py-1 rounded-lg hover:bg-bg transition-colors font-medium">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(item)} className="text-label-md text-status-err border border-status-err-bg px-3 py-1 rounded-lg hover:bg-status-err-bg transition-colors font-medium">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-3 flex flex-col items-center justify-center py-16 text-muted">
                            <span className="material-symbols-outlined text-[48px] text-border-base mb-3">inventory_2</span>
                            <p className="text-body-md font-medium">Tidak ada barang ditemukan</p>
                            <p className="text-body-sm text-subtle mt-1">Coba ubah filter atau tambah barang baru</p>
                        </div>
                    )}
                </div>

                <Pagination links={items?.links} />
            </div>

            {/* Modals */}
            {modal?.type === 'add' && (
                <ItemForm form={addForm} onSubmit={handleAdd} onClose={() => setModal(null)} title="Tambah Barang Baru" />
            )}
            {modal?.type === 'edit' && (
                <ItemForm form={editForm} onSubmit={handleEdit} onClose={() => setModal(null)} title="Edit Barang" />
            )}
            {modal?.type === 'status' && (
                <StatusModal item={modal.item} onClose={() => setModal(null)} />
            )}
        </AdminLayout>
    );
}
