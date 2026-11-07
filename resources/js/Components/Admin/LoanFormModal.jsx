import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Admin/Modal';
import ConfirmAction from '@/Components/Admin/ConfirmAction';
import CustomSelect from '@/Components/Admin/CustomSelect';
import DatePicker from '@/Components/Admin/DatePicker';
import { toastMsg, toastFailed } from '@/Utils/toast';

export default function LoanFormModal({ show, onClose, items_available = [], initialItemId = '' }) {
    const [showAlert, setShowAlert] = useState(false);
    const form = useForm({
        item_id: '',
        borrower_name: '',
        borrower_phone: '',
        loan_date: '',
        return_date: '',
    });

    useEffect(() => {
        if (show && initialItemId && !form.data.item_id) {
            form.setData('item_id', initialItemId);
        }
    }, [show, initialItemId]);

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.peminjaman.store'), {
            onSuccess: () => {
                toastMsg('loanAdded');
                form.reset();
                onClose();
            },
            onError: toastFailed,
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
                        <CustomSelect
                            value={form.data.item_id}
                            onChange={(val) => form.setData('item_id', val)}
                            options={items_available?.map((item) => ({
                                value: item.id,
                                label: `${item.item_code} — ${item.name}`,
                            })) || []}
                            placeholder="Pilih barang tersedia..."
                            searchable={true}
                            required
                        />
                        {form.errors.item_id && <p className="text-label-md text-status-err mt-1">{form.errors.item_id}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-label-md text-muted mb-1">Nama Peminjam *</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
                                value={form.data.borrower_name}
                                onChange={(e) => form.setData('borrower_name', e.target.value)}
                                placeholder="Masukkan nama"
                                required
                            />
                            {form.errors.borrower_name && <p className="text-label-md text-status-err mt-1">{form.errors.borrower_name}</p>}
                        </div>
                        <div>
                            <label className="block text-label-md text-muted mb-1">No. WhatsApp *</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
                                type="tel"
                                value={form.data.borrower_phone}
                                onChange={(e) => form.setData('borrower_phone', e.target.value)}
                                placeholder="08xxxxxx"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-label-md text-muted mb-1">Tanggal Pinjam *</label>
                            <DatePicker
                                value={form.data.loan_date}
                                onChange={(val) => form.setData('loan_date', val)}
                                placeholder="Pilih tanggal"
                            />
                            {form.errors.loan_date && <p className="text-label-md text-status-err mt-1">{form.errors.loan_date}</p>}
                        </div>
                        <div>
                            <label className="block text-label-md text-muted mb-1">Tanggal Kembali</label>
                            <DatePicker
                                value={form.data.return_date}
                                onChange={(val) => form.setData('return_date', val)}
                                placeholder="Pilih tanggal"
                            />
                            {form.errors.return_date && <p className="text-label-md text-status-err mt-1">{form.errors.return_date}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded-lg text-body-sm text-muted border border-border-base hover:bg-bg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
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

