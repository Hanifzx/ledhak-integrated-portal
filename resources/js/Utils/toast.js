/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LEDHAK TOAST — File konfigurasi terpusat (powered by Sonner)
 * ─────────────────────────────────────────────────────────────────────────────
 * Edit file ini untuk mengubah tampilan / perilaku semua toast di seluruh app.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { toast } from 'sonner';

// ── Helper functions — panggil ini di komponen Anda ─────────────────────────

/** Toast sukses — warna hijau */
export function toastSuccess(title, description) {
    toast.success(title, { description });
}

/** Toast error / gagal — warna merah */
export function toastError(title, description) {
    toast.error(title, { description });
}

/** Toast peringatan — warna kuning */
export function toastWarning(title, description) {
    toast.warning(title, { description });
}

/** Toast informasi — warna biru */
export function toastInfo(title, description) {
    toast.info(title, { description });
}

// ── Pesan standar per aksi (edit di sini untuk mengganti teks) ────────────────
export const TOAST_MESSAGES = {
    // Inventaris
    itemAdded:    { title: 'Barang ditambahkan', description: 'Item baru berhasil disimpan ke inventaris.' },
    itemUpdated:  { title: 'Barang diperbarui',  description: 'Perubahan data barang berhasil disimpan.' },
    itemDeleted:  { title: 'Barang dihapus',     description: 'Item telah dihapus dari inventaris.' },
    statusUpdated:{ title: 'Status diperbarui',  description: 'Status barang berhasil diubah.' },
    // Peminjaman
    loanAdded:    { title: 'Peminjaman dicatat',  description: 'Data peminjaman berhasil disimpan.' },
    loanReturned: { title: 'Barang dikembalikan', description: 'Status peminjaman diubah menjadi selesai.' },
    // Artikel
    articleDeleted: { title: 'Artikel dihapus', description: 'Artikel telah dihapus.' },
    // Pengaturan
    profileUpdated:  { title: 'Profil diperbarui',  description: 'Data profil berhasil disimpan.' },
    passwordUpdated: { title: 'Password diperbarui', description: 'Kata sandi berhasil diubah.' },
    // Generic
    saved:   { title: 'Tersimpan',        description: 'Perubahan berhasil disimpan.' },
    deleted: { title: 'Berhasil dihapus', description: null },
    failed:  { title: 'Gagal',            description: 'Terjadi kesalahan. Silakan coba lagi.' },
};

// ── Shortcut helpers — gunakan ini daripada mengakses TOAST_MESSAGES manual ──

/** Tampilkan toast sukses dari key TOAST_MESSAGES */
export function toastMsg(key) {
    const m = TOAST_MESSAGES[key];
    if (m) toastSuccess(m.title, m.description);
}

/** Tampilkan toast error standar "Gagal" */
export function toastFailed() {
    const m = TOAST_MESSAGES.failed;
    toastError(m.title, m.description);
}

