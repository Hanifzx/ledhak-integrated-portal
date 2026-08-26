import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Modal from '@/Components/Admin/Modal';
import Pagination from '@/Components/Admin/Pagination';
import { useDebounce } from '@/Utils/debounce';
import { toastSuccess, toastError, TOAST_MESSAGES } from '@/Utils/toast';
import ConfirmAction from '@/Components/Admin/ConfirmAction';

const FILTER_LABELS = [
    { label: 'Semua', value: '' },
    { label: 'Aktif', value: 'Active' },
    { label: 'Terlambat', value: 'Overdue' },
    { label: 'Dikembalikan', value: 'Returned' },
];

function LoanForm({ show, onClose, items_available }) {
    const [showAlert, setShowAlert] = useState(false);
    const form = useForm({
        item_id: '',
        borrower_name: '',
        borrower_phone: '',
        loan_date: '',
        return_date: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.peminjaman.store'), {
            onSuccess: () => {
                const m = TOAST_MESSAGES.loanAdded;
                toastSuccess(m.title, m.description);
                form.reset(); onClose();
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
            <Modal show={show} title="Catat Peminjaman Baru" onClose={handleClose} size="lg">
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-label-md text-muted mb-1">Barang *</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                            value={form.data.item_id}
                            onChange={e => form.setData('item_id', e.target.value)}
                            required
                        >
                            <option value="">Pilih barang tersedia...</option>
                            {items_available?.map(item => (
                                <option key={item.id} value={item.id}>{item.item_code} — {item.name}</option>
                            ))}
                        </select>
                        {form.errors.item_id && <p className="text-label-md text-status-err mt-1">{form.errors.item_id}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-label-md text-muted mb-1">Nama Peminjam *</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                                value={form.data.borrower_name}
                                onChange={e => form.setData('borrower_name', e.target.value)}
                                required
                            />
                            {form.errors.borrower_name && <p className="text-label-md text-status-err mt-1">{form.errors.borrower_name}</p>}
                        </div>
                        <div>
                            <label className="block text-label-md text-muted mb-1">No. WhatsApp *</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                                type="tel"
                                value={form.data.borrower_phone}
                                onChange={e => form.setData('borrower_phone', e.target.value)}
                                placeholder="0812xxxx"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-label-md text-muted mb-1">Tanggal Pinjam *</label>
                            <input type="date"
                                className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                                value={form.data.loan_date}
                                onChange={e => form.setData('loan_date', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-label-md text-muted mb-1">Tanggal Kembali</label>
                            <input type="date"
                                className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                                value={form.data.return_date}
                                onChange={e => form.setData('return_date', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg text-body-sm text-muted border border-border-base hover:bg-bg transition-colors">Batal</button>
                        <button type="submit" disabled={form.processing}
                            className="px-5 py-2 rounded-lg text-body-sm bg-primary text-on-primary font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
                        >
                            {form.processing ? 'Menyimpan...' : 'Catat Peminjaman'}
                        </button>
                    </div>
                </form>
            </Modal>
            <ConfirmAction
                open={showAlert}
                onOpenChange={setShowAlert}
                onConfirm={onClose}
                title="Batal Peminjaman?"
                description="Ada perubahan yang belum disimpan. Yakin ingin menutup form peminjaman?"
                confirmText="Tutup & Buang Perubahan"
                cancelText="Kembali"
                variant="destructive"
            />
        </>
    );
}

export default function PeminjamanIndex({ loans, filters, items_available }) {
    const [showLoanForm, setShowLoanForm] = useState(false);
    const [searchVal, setSearchVal] = useState(filters?.search ?? '');

    const handleReturn = (loan) => {
        router.post(route('admin.peminjaman.return', loan.id), {}, {
            onSuccess: () => {
                const m = TOAST_MESSAGES.loanReturned;
                toastSuccess(m.title, m.description);
            },
            onError: () => toastError(TOAST_MESSAGES.failed.title, TOAST_MESSAGES.failed.description),
        });
    };

    const applyFilter = (value) => {
        router.get(route('admin.peminjaman.index'), { status: value, search: filters?.search ?? '' }, { preserveState: true, replace: true });
    };

    const debouncedSearch = useDebounce((val) => {
        router.get(route('admin.peminjaman.index'), { search: val, status: filters?.status ?? '' }, { preserveState: true, replace: true });
    }, 350);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchVal(val);
        debouncedSearch(val);
    };

    const activeFilter = filters?.status ?? '';

    return (
        <AdminLayout title="Peminjaman">
            <Head title="Peminjaman — LeDHaK" />

            <div className="max-w-6xl mx-auto space-y-5">
                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-h1 text-ink">Riwayat Peminjaman</h2>
                        <p className="text-body-sm text-muted mt-1">Pantau log sirkulasi barang inventaris.</p>
                    </div>
                    <button
                        onClick={() => setShowLoanForm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark transition-colors shadow-card"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Catat Peminjaman
                    </button>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle text-[18px]">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-base bg-surface text-body-md text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Cari barang atau peminjam..."
                            value={searchVal}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {FILTER_LABELS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => applyFilter(f.value)}
                                className={`px-4 py-2 rounded-full text-label-md font-semibold transition-colors ${
                                    activeFilter === f.value
                                        ? 'bg-primary text-on-primary'
                                        : 'bg-surface border border-border-base text-muted hover:bg-bg'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-surface rounded-xl border border-border-base shadow-card overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse">
                        <thead>
                            <tr className="border-b border-border-base bg-bg">
                                <th className="py-3 px-4 text-label-caps text-muted text-left w-10">No</th>
                                <th className="py-3 px-4 text-label-caps text-muted text-left">Item Barang</th>
                                <th className="py-3 px-4 text-label-caps text-muted text-left">Peminjam</th>
                                <th className="py-3 px-4 text-label-caps text-muted text-left">Tanggal</th>
                                <th className="py-3 px-4 text-label-caps text-muted text-left">Status</th>
                                <th className="py-3 px-4 text-label-caps text-muted text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base">
                            {loans?.data?.length > 0 ? loans.data.map((loan, idx) => {
                                const isOverdue = loan.status === 'Active' && loan.return_date && new Date(loan.return_date) < new Date();
                                const displayStatus = isOverdue ? 'Overdue' : loan.status;

                                return (
                                    <tr key={loan.id} className="hover:bg-bg transition-colors group">
                                        <td className="py-3 px-4 text-label-md text-subtle text-center">
                                            {(loans.current_page - 1) * loans.per_page + idx + 1}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-bg flex items-center justify-center flex-shrink-0 border border-border-base">
                                                    <span className="material-symbols-outlined text-subtle text-[16px]">inventory_2</span>
                                                </div>
                                                <div>
                                                    <p className="text-body-sm font-semibold text-ink">{loan.item?.name}</p>
                                                    <p className="text-label-caps text-subtle font-mono">{loan.item?.item_code}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-body-sm font-semibold text-ink">{loan.borrower_name}</p>
                                            <p className="text-label-md text-muted">{loan.borrower_phone}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-body-sm text-ink">{loan.loan_date}</p>
                                            <p className={`text-label-md ${isOverdue ? 'text-status-err font-semibold' : 'text-muted'}`}>
                                                Kembali: {loan.return_date ?? '—'}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <StatusBadge status={displayStatus} />
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {loan.status === 'Active' && (
                                                <ConfirmAction
                                                    onConfirm={() => handleReturn(loan)}
                                                    title="Konfirmasi Pengembalian"
                                                    description={`Selesaikan peminjaman barang "${loan.item?.name}" oleh ${loan.borrower_name}?`}
                                                    confirmText="Selesaikan"
                                                    variant="default"
                                                >
                                                    <button className="text-label-md text-primary border border-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-on-primary transition-colors font-semibold">
                                                        Selesaikan
                                                    </button>
                                                </ConfirmAction>
                                            )}
                                            {loan.status === 'Returned' && (
                                                <span className="text-label-md text-status-ok font-medium">Dikembalikan</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-muted">
                                        <span className="material-symbols-outlined text-[36px] block mb-2 text-border-base">handshake</span>
                                        Tidak ada data peminjaman
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={loans?.links} />
            </div>

            <LoanForm
                show={showLoanForm}
                onClose={() => setShowLoanForm(false)}
                items_available={items_available}
            />
        </AdminLayout>
    );
}
