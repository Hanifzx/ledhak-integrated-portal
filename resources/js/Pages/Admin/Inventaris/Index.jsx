import { useState, useRef } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Modal from '@/Components/Admin/Modal';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmAction from '@/Components/Admin/ConfirmAction';
import { PageHeader, SearchInput } from '@/Components/Admin/AdminUI';
import { useDebounce } from '@/Utils/debounce';
import { toastMsg, toastFailed } from '@/Utils/toast';

const DEFAULT_PHOTO = '/images/assets/item_default.webp';
// Status untuk dropdown tambah/edit barang baru
const STATUS_OPTIONS = ['Tersedia', 'Perbaikan'];
// Status modal untuk barang TIDAK sedang dipinjam
const STATUS_MODAL_OPTIONS = ['Tersedia', 'Perbaikan', 'Hilang'];
// Status modal khusus barang yang SEDANG dipinjam (skenario hilang/rusak saat dipinjam)
const STATUS_MODAL_DIPINJAM_OPTIONS = ['Hilang', 'Perbaikan'];
const CATEGORY_OPTIONS = [
    'Spanduk & Banner', 'Elektronik & Sound', 'Alat Tulis & Kantor',
    'Perlengkapan Acara', 'Peralatan Fotografi', 'Lain-lain',
];

/** Crop image file to 1:1 square via canvas, return a Blob */
function cropToSquareBlob(file) {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const size = Math.min(img.width, img.height);
            const x = (img.width - size) / 2;
            const y = (img.height - size) / 2;
            const canvas = document.createElement('canvas');
            canvas.width = 500;
            canvas.height = 500;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, x, y, size, size, 0, 0, 500, 500);
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
        if (file.size > 1024 * 1024) {
            alert('Ukuran file maksimal 1 MB');
            e.target.value = '';
            return;
        }
        const blob = await cropToSquareBlob(file);
        const cropped = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
        onFileChange(cropped, URL.createObjectURL(blob));
    };

    return (
        <div>
            <label className="block text-label-md text-muted mb-2">Foto Barang</label>
            <div className="flex items-center gap-4">
                {/* Preview 1:1 */}
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border-base overflow-hidden bg-bg flex-shrink-0">
                    <img
                        src={preview || DEFAULT_PHOTO}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <button
                        type="button"
                        onClick={() => inputRef.current.click()}
                        className="flex items-center gap-2 px-3 py-2 border border-border-base rounded-lg text-body-sm text-muted hover:bg-bg hover:border-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-[16px]">upload</span>
                        Pilih Foto
                    </button>
                    <p className="text-label-caps text-subtle mt-1.5">JPEG / PNG / WebP · maks 1 MB · otomatis crop 1:1</p>
                    {error && <p className="text-label-md text-status-err mt-1">{error}</p>}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
}

function ItemForm({ form, onPhotoChange, photoPreview, onSubmit, onClose, title }) {
    const [showAlert, setShowAlert] = useState(false);

    const handleClose = () => {
        if (form.isDirty) {
            setShowAlert(true);
        } else {
            onClose();
        }
    };

    return (
        <>
            <Modal show title={title} onClose={handleClose}>
                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Photo */}
                    <PhotoInput
                        preview={photoPreview}
                        onFileChange={onPhotoChange}
                        error={form.errors.photo}
                    />
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
                        <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg text-body-sm text-muted border border-border-base hover:bg-bg transition-colors">
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
            <ConfirmAction
                open={showAlert}
                onOpenChange={setShowAlert}
                onConfirm={onClose}
                title="Tutup Form?"
                description="Ada perubahan yang belum disimpan. Yakin ingin menutup? Perubahan Anda akan hilang."
                confirmText="Tutup & Buang Perubahan"
                cancelText="Kembali ke Form"
                variant="destructive"
            />
        </>
    );
}

function StatusModal({ item, onClose }) {
    const isDipinjam = item?.status === 'Dipinjam';
    const options = isDipinjam ? STATUS_MODAL_DIPINJAM_OPTIONS : STATUS_MODAL_OPTIONS;
    const form = useForm({ status: isDipinjam ? 'Hilang' : (item?.status ?? 'Tersedia'), notes: '' });
    const [showAlert, setShowAlert] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        form.patch(route('admin.inventaris.status', item.id), {
            onSuccess: () => {
                const m = TOAST_MESSAGES.statusUpdated;
                toastSuccess(m.title, m.description);
                onClose();
            },
            onError: () => toastError(TOAST_MESSAGES.failed.title, TOAST_MESSAGES.failed.description),
        });
    };

    const handleClose = () => {
        if (form.isDirty) {
            setShowAlert(true);
        } else {
            onClose();
        }
    };

    return (
        <>
            <Modal show title="Ubah Status Barang" onClose={handleClose} size="sm">
                <form onSubmit={submit} className="space-y-4">
                    <p className="text-body-sm text-muted">Barang: <span className="font-semibold text-ink">{item?.name}</span></p>

                    {/* Peringatan khusus jika barang sedang dipinjam */}
                    {isDipinjam && (
                        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-status-warn-bg border border-status-warn border-opacity-30">
                            <span className="material-symbols-outlined text-status-warn text-[18px] mt-0.5">warning</span>
                            <p className="text-label-md text-status-warn leading-relaxed">
                                Barang ini sedang dipinjam. Mengubah status berarti Anda mengonfirmasi kejadian saat proses peminjaman (misalnya barang hilang atau rusak).
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-label-md text-muted mb-1">Status Baru *</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                            value={form.data.status}
                            onChange={e => form.setData('status', e.target.value)}
                        >
                            {options.map(s => <option key={s}>{s}</option>)}
                        </select>
                        {form.errors.status && <p className="text-label-md text-status-err mt-1">{form.errors.status}</p>}
                    </div>
                    <div>
                        <label className="block text-label-md text-muted mb-1">
                            Catatan {isDipinjam && <span className="text-status-err">*</span>}
                        </label>
                        <input
                            className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                            value={form.data.notes}
                            onChange={e => form.setData('notes', e.target.value)}
                            placeholder={isDipinjam ? 'Wajib: jelaskan kejadian yang terjadi...' : 'Alasan perubahan status...'}
                            required={isDipinjam}
                        />
                        {form.errors.notes && <p className="text-label-md text-status-err mt-1">{form.errors.notes}</p>}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg text-body-sm text-muted border border-border-base hover:bg-bg transition-colors">Batal</button>
                        <button type="submit" disabled={form.processing}
                            className="px-5 py-2 rounded-lg text-body-sm bg-primary text-on-primary font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
                        >
                            {form.processing ? 'Menyimpan...' : 'Simpan Status'}
                        </button>
                    </div>
                </form>
            </Modal>
            <ConfirmAction
                open={showAlert}
                onOpenChange={setShowAlert}
                onConfirm={onClose}
                title="Batal Ubah Status?"
                description="Ada perubahan yang belum disimpan. Yakin ingin menutup?"
                confirmText="Tutup & Buang Perubahan"
                cancelText="Kembali"
                variant="destructive"
            />
        </>
    );
}

function DetailModal({ item, onClose }) {
    if (!item) return null;
    
    return (
        <Modal show title="Detail Barang" onClose={onClose} size="md">
            <div className="space-y-5">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                    {/* Item Photo */}
                    <div className="w-full sm:w-32 h-40 sm:h-32 rounded-xl border border-border-base bg-bg overflow-hidden flex-shrink-0">
                        <img 
                            src={item.photo_url || DEFAULT_PHOTO} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Item Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-label-caps text-primary font-mono bg-primary-soft px-2 py-0.5 rounded">{item.item_code}</p>
                            <StatusBadge status={item.status} />
                        </div>
                        <h3 className="text-h2 text-ink mt-2 mb-1">{item.name}</h3>
                        <p className="text-body-sm text-subtle">{item.category}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border-base">
                    <div>
                        <h4 className="text-label-sm text-muted mb-2">Deskripsi Barang</h4>
                        <p className="text-body-md text-ink whitespace-pre-wrap">
                            {item.description || <span className="text-subtle italic">Tidak ada deskripsi.</span>}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-label-sm text-muted mb-2">QR Code</h4>
                        {item.qr_code_url ? (
                            <div className="flex flex-col items-start gap-3">
                                <div className="p-2 bg-white border border-border-base rounded-xl inline-block shadow-sm">
                                    <img src={item.qr_code_url} alt="QR Code" className="w-32 h-32" />
                                </div>
                                <a 
                                    href={route('admin.inventaris.download-qr', item.id)} 
                                    className="flex items-center gap-2 text-label-md text-primary hover:text-primary-dark transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    Unduh QR Code
                                </a>
                            </div>
                        ) : (
                            <p className="text-body-sm text-subtle italic">QR Code belum digenerate.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg text-body-sm bg-surface text-ink border border-border-base hover:bg-bg transition-colors font-semibold">
                        Tutup
                    </button>
                </div>
            </div>
        </Modal>
    );
}

const FILTER_LABELS = ['Semua', 'Tersedia', 'Dipinjam', 'Perbaikan', 'Hilang'];

export default function InventarisIndex({ items, filters }) {
    const [modal, setModal] = useState(null);
    const [addPhotoPreview, setAddPhotoPreview] = useState(null);
    const [editPhotoPreview, setEditPhotoPreview] = useState(null);

    const addForm = useForm({ name: '', category: '', status: 'Tersedia', description: '', photo: null });
    const editForm = useForm({ name: '', category: '', status: 'Tersedia', description: '', photo: null, _method: 'PUT' });

    const openEdit = (item) => {
        editForm.setData({ name: item.name, category: item.category, status: item.status, description: item.description ?? '', photo: null, _method: 'PUT' });
        setEditPhotoPreview(item.photo_url || null);
        setModal({ type: 'edit', item });
    };

    const handleAdd = (e) => {
        e.preventDefault();
        addForm.post(route('admin.inventaris.store'), {
            onSuccess: () => { toastMsg('itemAdded'); addForm.reset(); setAddPhotoPreview(null); setModal(null); },
            onError: toastFailed,
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editForm.post(route('admin.inventaris.update', modal.item.id), {
            onSuccess: () => { toastMsg('itemUpdated'); setModal(null); },
            onError: toastFailed,
        });
    };

    const handleDelete = (item) => {
        router.delete(route('admin.inventaris.destroy', item.id), {
            onSuccess: () => toastMsg('itemDeleted'),
            onError: toastFailed,
        });
    };

    const applyFilter = (status) => {
        router.get(route('admin.inventaris.index'), { status: status === 'Semua' ? '' : status, search: filters?.search ?? '' }, { preserveState: true, replace: true });
    };
    const [searchVal, setSearchVal] = useState(filters?.search ?? '');

    const debouncedSearch = useDebounce((val) => {
        router.get(route('admin.inventaris.index'), { search: val, status: filters?.status ?? '' }, { preserveState: true, replace: true });
    }, 350);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchVal(val);
        debouncedSearch(val);
    };

    const activeFilter = filters?.status || 'Semua';

    return (
        <AdminLayout title="Inventaris">
            <Head title="Inventaris — LeDHaK" />

            <div className="max-w-6xl mx-auto space-y-5">
                <PageHeader
                    title="Daftar Barang"
                    subtitle={`${items?.total ?? 0} total aset inventaris`}
                    action={
                        <button
                            onClick={() => setModal({ type: 'add' })}
                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark transition-colors shadow-card"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Tambah Barang
                        </button>
                    }
                />

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <SearchInput
                        value={searchVal}
                        onChange={handleSearchChange}
                        placeholder="Cari kode atau nama barang..."
                    />
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
                        <div 
                            key={item.id} 
                            onClick={() => setModal({ type: 'detail', item })}
                            className="bg-surface rounded-xl border border-border-base shadow-card hover:shadow-card-hover hover:border-primary transition-all group cursor-pointer"
                        >
                            <div className="p-4 flex gap-4 items-start">
                                <div className="w-16 h-16 rounded-lg bg-bg flex-shrink-0 overflow-hidden border border-border-base">
                                    <img
                                        src={item.photo_url || DEFAULT_PHOTO}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
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
                            <div className="border-t border-border-base px-4 py-2.5 flex gap-2 justify-end" onClick={e => e.stopPropagation()}>
                                {/* Semua item bisa ubah status, termasuk Dipinjam (skenario hilang/rusak saat dipinjam) */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); setModal({ type: 'status', item }); }}
                                    className="text-label-md text-primary border border-primary px-3 py-1 rounded-lg hover:bg-primary-soft transition-colors font-medium"
                                >
                                    Ubah Status
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="flex items-center justify-center text-muted border border-border-base p-1.5 rounded-lg hover:bg-bg transition-colors" title="Edit">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <ConfirmAction 
                                    onConfirm={() => handleDelete(item)} 
                                    title={`Hapus "${item.name}"?`} 
                                    description="Tindakan ini tidak bisa dibatalkan."
                                >
                                    <button onClick={(e) => e.stopPropagation()} className="flex items-center justify-center text-status-err border border-status-err-bg p-1.5 rounded-lg hover:bg-status-err-bg transition-colors" title="Hapus">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </ConfirmAction>
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
                <ItemForm
                    form={addForm}
                    photoPreview={addPhotoPreview}
                    onPhotoChange={(file, preview) => { addForm.setData('photo', file); setAddPhotoPreview(preview); }}
                    onSubmit={handleAdd}
                    onClose={() => { setModal(null); setAddPhotoPreview(null); addForm.reset(); }}
                    title="Tambah Barang Baru"
                />
            )}
            {modal?.type === 'edit' && (
                <ItemForm
                    form={editForm}
                    photoPreview={editPhotoPreview}
                    onPhotoChange={(file, preview) => { editForm.setData('photo', file); setEditPhotoPreview(preview); }}
                    onSubmit={handleEdit}
                    onClose={() => setModal(null)}
                    title="Edit Barang"
                />
            )}
            {modal?.type === 'status' && (
                <StatusModal item={modal.item} onClose={() => setModal(null)} />
            )}
            {modal?.type === 'detail' && (
                <DetailModal item={modal.item} onClose={() => setModal(null)} />
            )}
        </AdminLayout>
    );
}
