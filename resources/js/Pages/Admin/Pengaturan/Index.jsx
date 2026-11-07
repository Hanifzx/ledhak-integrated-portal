import { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/Admin/AdminUI';
import Modal from '@/Components/Admin/Modal';
import ConfirmAction from '@/Components/Admin/ConfirmAction';
import { toastSuccess, toastError, TOAST_MESSAGES } from '@/Utils/toast';

function Section({ title, icon, children }) {
    return (
        <div className="bg-surface rounded-xl border border-border-base shadow-card overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border-base bg-surface">
                <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
                </div>
                <h3 className="text-h3 text-ink">{title}</h3>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function FormField({ label, error, children }) {
    return (
        <div>
            <label className="block text-label-md text-muted mb-1.5 font-medium">{label}</label>
            {children}
            {error && <p className="text-label-md text-status-err mt-1">{error}</p>}
        </div>
    );
}

function GithubIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
    );
}

function InstagramIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
    );
}

const DEVELOPERS = [
    {
        name: 'Muh. Hanif Nurmahdin',
        batch: 'LeDHaK XIII',
        position: 'Kadiv Media dan Publikasi 2026',
        role: 'Frontend Developer',
        socials: [
            { label: '@mhnief', href: 'https://www.instagram.com/mhnief/', type: 'instagram' },
            { label: 'Hanifzx', href: 'https://github.com/Hanifzx', type: 'github' },
        ],
    },
    {
        name: 'Haris',
        batch: 'LeDHaK XIII',
        position: 'Kabid Pengelolaan Divisi SDW 2026',
        role: 'Backend Developer',
        socials: [
            { label: '@_hrsamr', href: 'https://www.instagram.com/_hrsamr/', type: 'instagram' },
            { label: 'Haris2512', href: 'https://github.com/Haris2512', type: 'github' },
        ],
    },
];

const inputClass = "w-full px-3 py-2.5 rounded-lg border border-border-base bg-surface text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-subtle/50";

function PasswordInput({ value, onChange, autoComplete, required, placeholder }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative w-full">
            <input
                className={`${inputClass} pr-10`}
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                required={required}
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-subtle hover:text-ink focus:outline-none"
                tabIndex="-1"
            >
                <span className="material-symbols-outlined text-[20px]">
                    {show ? 'visibility_off' : 'visibility'}
                </span>
            </button>
        </div>
    );
}

/** Helper untuk memvalidasi syarat password: min 8 karakter serta kombinasi huruf dan angka */
const checkPasswordRequirements = (pwd = '') => {
    return pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
};

const getPasswordError = (pwd = '') => {
    if (!pwd) return 'Password wajib diisi.';
    if (pwd.length < 8) return 'Password minimal 8 karakter.';
    if (!/[a-zA-Z]/.test(pwd) || !/[0-9]/.test(pwd)) {
        return 'Password harus terdiri dari kombinasi huruf dan angka.';
    }
    return null;
};

/** Modal tambah akun admin baru */
function AddAdminModal({ show, onClose }) {
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    const isPasswordValid = checkPasswordRequirements(form.data.password);

    const handleFieldChange = (field, value) => {
        form.setData(field, value);
        if (form.errors[field]) {
            form.clearErrors(field);
        }
        if (field === 'password' && form.errors.password_confirmation && form.data.password_confirmation && value === form.data.password_confirmation) {
            form.clearErrors('password_confirmation');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        form.clearErrors();

        const errors = {};
        if (!form.data.name.trim()) {
            errors.name = 'Nama lengkap admin wajib diisi.';
        }
        if (!form.data.email.trim()) {
            errors.email = 'Alamat email wajib diisi.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.data.email)) {
            errors.email = 'Format alamat email tidak valid.';
        }

        const pwdErr = getPasswordError(form.data.password);
        if (pwdErr) {
            errors.password = pwdErr;
        }

        if (!form.data.password_confirmation) {
            errors.password_confirmation = 'Konfirmasi password wajib diisi.';
        } else if (form.data.password !== form.data.password_confirmation) {
            errors.password_confirmation = 'Konfirmasi password tidak cocok.';
        }

        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            form.setError(errors);
            return;
        }

        form.post(route('admin.pengaturan.admin.store'), {
            onSuccess: () => {
                toastSuccess('Akun admin berhasil dibuat');
                form.reset();
                onClose();
            },
            onError: () => toastError('Gagal membuat akun', 'Periksa kembali data yang diisi.'),
        });
    };

    const handleClose = () => {
        form.reset();
        form.clearErrors();
        onClose();
    };

    return (
        <Modal show={show} title="Tambah Akun Admin" onClose={handleClose} size="sm">
            <form onSubmit={submit} noValidate className="space-y-4">
                <FormField label="Nama Lengkap *" error={form.errors.name}>
                    <input
                        className={inputClass}
                        value={form.data.name}
                        onChange={e => handleFieldChange('name', e.target.value)}
                        placeholder="Nama admin..."
                    />
                </FormField>
                <FormField label="Alamat Email *" error={form.errors.email}>
                    <input
                        className={inputClass}
                        type="email"
                        value={form.data.email}
                        onChange={e => handleFieldChange('email', e.target.value)}
                        placeholder="email@example.com"
                    />
                </FormField>
                <FormField label="Password *" error={form.errors.password}>
                    <PasswordInput
                        value={form.data.password}
                        onChange={e => handleFieldChange('password', e.target.value)}
                        autoComplete="new-password"
                        placeholder="Minimal 8 karakter"
                    />
                    <div className="mt-1 flex items-center gap-1 text-label-caps">
                        {isPasswordValid ? (
                            <span className="text-status-ok flex items-center gap-1 font-semibold">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Minimal 8 karakter serta kombinasi huruf dan angka terpenuhi
                            </span>
                        ) : (
                            <span className="text-subtle">Minimal 8 karakter, kombinasi huruf dan angka</span>
                        )}
                    </div>
                </FormField>
                <FormField label="Konfirmasi Password *" error={form.errors.password_confirmation}>
                    <PasswordInput
                        value={form.data.password_confirmation}
                        onChange={e => handleFieldChange('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        placeholder="Ulangi password"
                    />
                    {form.data.password_confirmation && (
                        <div className="mt-1 flex items-center gap-1 text-label-caps">
                            {form.data.password === form.data.password_confirmation ? (
                                <span className="text-status-ok flex items-center gap-1 font-semibold">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                    Password konfirmasi cocok
                                </span>
                            ) : (
                                <span className="text-status-err flex items-center gap-1 font-semibold">
                                    <span className="material-symbols-outlined text-[14px]">cancel</span>
                                    Password konfirmasi belum cocok
                                </span>
                            )}
                        </div>
                    )}
                </FormField>
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors cursor-pointer"
                    >
                        {form.processing ? 'Membuat...' : 'Buat Akun Admin'}
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2.5 rounded-lg border border-border-base text-body-sm font-medium text-muted hover:text-ink hover:bg-surface-mid transition-colors"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </Modal>
    );
}

/** Modal reset password admin lain */
function ResetPasswordModal({ show, admin, onClose }) {
    const form = useForm({ password: '', password_confirmation: '' });

    const isPasswordValid = checkPasswordRequirements(form.data.password);

    const handleFieldChange = (field, value) => {
        form.setData(field, value);
        if (form.errors[field]) {
            form.clearErrors(field);
        }
        if (field === 'password' && form.errors.password_confirmation && form.data.password_confirmation && value === form.data.password_confirmation) {
            form.clearErrors('password_confirmation');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        form.clearErrors();

        const errors = {};
        const pwdErr = getPasswordError(form.data.password);
        if (pwdErr) {
            errors.password = pwdErr;
        }

        if (!form.data.password_confirmation) {
            errors.password_confirmation = 'Konfirmasi password baru wajib diisi.';
        } else if (form.data.password !== form.data.password_confirmation) {
            errors.password_confirmation = 'Konfirmasi password baru tidak cocok.';
        }

        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            form.setError(errors);
            return;
        }

        form.post(route('admin.pengaturan.admin.reset-password', admin?.id), {
            onSuccess: () => {
                toastSuccess('Password berhasil direset');
                form.reset();
                onClose();
            },
            onError: () => toastError('Gagal mereset password'),
        });
    };

    const handleClose = () => {
        form.reset();
        form.clearErrors();
        onClose();
    };

    return (
        <Modal show={show} title="Reset Password Admin" onClose={handleClose} size="sm">
            <div className="mb-4 p-3 bg-surface rounded-lg border border-border-base">
                <p className="text-label-md text-muted">Reset password untuk:</p>
                <p className="text-body-sm font-semibold text-ink mt-0.5">{admin?.name}</p>
                <p className="text-label-md text-subtle">{admin?.email}</p>
            </div>
            <form onSubmit={submit} noValidate className="space-y-4">
                <FormField label="Password Baru *" error={form.errors.password}>
                    <PasswordInput
                        value={form.data.password}
                        onChange={e => handleFieldChange('password', e.target.value)}
                        autoComplete="new-password"
                        placeholder="Minimal 8 karakter"
                    />
                    <div className="mt-1 flex items-center gap-1 text-label-caps">
                        {isPasswordValid ? (
                            <span className="text-status-ok flex items-center gap-1 font-semibold">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Minimal 8 karakter serta kombinasi huruf dan angka terpenuhi
                            </span>
                        ) : (
                            <span className="text-subtle">Minimal 8 karakter, kombinasi huruf dan angka</span>
                        )}
                    </div>
                </FormField>
                <FormField label="Konfirmasi Password Baru *" error={form.errors.password_confirmation}>
                    <PasswordInput
                        value={form.data.password_confirmation}
                        onChange={e => handleFieldChange('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        placeholder="Ulangi password baru"
                    />
                    {form.data.password_confirmation && (
                        <div className="mt-1 flex items-center gap-1 text-label-caps">
                            {form.data.password === form.data.password_confirmation ? (
                                <span className="text-status-ok flex items-center gap-1 font-semibold">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                    Password konfirmasi cocok
                                </span>
                            ) : (
                                <span className="text-status-err flex items-center gap-1 font-semibold">
                                    <span className="material-symbols-outlined text-[14px]">cancel</span>
                                    Password konfirmasi belum cocok
                                </span>
                            )}
                        </div>
                    )}
                </FormField>
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors cursor-pointer"
                    >
                        {form.processing ? 'Mereset...' : 'Reset Password'}
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2.5 rounded-lg border border-border-base text-body-sm font-medium text-muted hover:text-ink hover:bg-surface-mid transition-colors"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default function PengaturanIndex({ user, system_info, google_sheets_url, admins = [] }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('profil');

    // State manajemen admin
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [adminToReset, setAdminToReset] = useState(null);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const profileForm = useForm({ name: user?.name ?? '', email: user?.email ?? '' });
    const passwordForm = useForm({ password: '', password_confirmation: '' });
    const deleteForm = useForm({});

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('admin.pengaturan.profile'), {
            onSuccess: () => {
                const m = TOAST_MESSAGES.profileUpdated;
                toastSuccess(m.title, m.description);
            },
            onError: () => toastError(TOAST_MESSAGES.failed.title, TOAST_MESSAGES.failed.description),
        });
    };

    const handlePasswordFormChange = (field, value) => {
        passwordForm.setData(field, value);
        if (passwordForm.errors[field]) {
            passwordForm.clearErrors(field);
        }
        if (field === 'password' && passwordForm.errors.password_confirmation && passwordForm.data.password_confirmation && value === passwordForm.data.password_confirmation) {
            passwordForm.clearErrors('password_confirmation');
        }
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.clearErrors();

        const errors = {};
        const pwdErr = getPasswordError(passwordForm.data.password);
        if (pwdErr) {
            errors.password = pwdErr;
        }

        if (!passwordForm.data.password_confirmation) {
            errors.password_confirmation = 'Konfirmasi password baru wajib diisi.';
        } else if (passwordForm.data.password !== passwordForm.data.password_confirmation) {
            errors.password_confirmation = 'Konfirmasi password baru tidak cocok.';
        }

        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            passwordForm.setError(errors);
            return;
        }

        passwordForm.post(route('admin.pengaturan.password'), {
            onSuccess: () => {
                const m = TOAST_MESSAGES.passwordUpdated;
                toastSuccess(m.title, m.description);
                passwordForm.reset();
            },
            onError: () => toastError(TOAST_MESSAGES.failed.title, TOAST_MESSAGES.failed.description),
        });
    };

    const handleDeleteAdmin = () => {
        if (!adminToDelete || isDeleting) return;
        setIsDeleting(true);
        deleteForm.delete(route('admin.pengaturan.admin.destroy', adminToDelete.id), {
            onSuccess: () => {
                toastSuccess(`Akun "${adminToDelete.name}" telah dihapus`);
                setAdminToDelete(null);
            },
            onError: () => toastError('Gagal menghapus akun admin'),
            onFinish: () => setIsDeleting(false),
        });
    };

    const TABS = [
        { key: 'profil',    icon: 'person',         label: 'Profil Akun' },
        { key: 'keamanan',  icon: 'lock',            label: 'Keamanan' },
        { key: 'admin',     icon: 'manage_accounts', label: 'Manajemen Admin' },
        { key: 'sistem',    icon: 'info',            label: 'Tentang Portal' },
    ];

    const TAB_LABELS = {
        profil:   'Profil Akun',
        keamanan: 'Keamanan Akun',
        admin:    'Manajemen Admin',
        sistem:   'Tentang Portal',
    };

    return (
        <AdminLayout title="Pengaturan">
            <Head title="Pengaturan" />

            <div className="max-w-4xl mx-auto space-y-5">
                <PageHeader
                    breadcrumb={[
                        { icon: 'settings', label: 'Pengaturan' },
                        { label: TAB_LABELS[activeTab] || 'Profil Akun' }
                    ]}
                    title="Pengaturan"
                    subtitle="Kelola akun dan konfigurasi sistem."
                />

                {/* Flash message */}
                {flash?.success && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-status-ok-bg border border-status-ok rounded-lg text-body-sm text-status-ok font-medium">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        {flash.success}
                    </div>
                )}

                {/* Tab Nav — Mobile: 4 kolom pas tanpa scroll horizontal (teks di bawah ikon). Desktop: w-fit (lebar pas dengan konten) */}
                <div className="bg-surface rounded-xl border border-border-base p-1 shadow-card w-full sm:w-fit">
                    <div className="grid grid-cols-4 sm:flex gap-1">
                        {TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-4 rounded-lg text-center sm:text-left transition-colors ${
                                    activeTab === tab.key
                                        ? 'bg-primary text-on-primary shadow-card font-semibold'
                                        : 'text-muted hover:text-ink hover:bg-bg'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px] sm:text-[17px] flex-shrink-0">
                                    {tab.icon}
                                </span>
                                <span className="text-[10px] sm:text-body-sm leading-tight font-medium sm:whitespace-nowrap">
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Tab: Profil ── */}
                {activeTab === 'profil' && (
                    <Section title="Profil Akun" icon="person">
                        <form onSubmit={submitProfile} className="space-y-4 max-w-md">
                            <FormField label="Nama Lengkap *" error={profileForm.errors.name}>
                                <input className={inputClass}
                                    value={profileForm.data.name}
                                    onChange={e => {
                                        profileForm.setData('name', e.target.value);
                                        if (profileForm.errors.name) profileForm.clearErrors('name');
                                    }}
                                    required
                                />
                            </FormField>
                            <FormField label="Alamat Email *" error={profileForm.errors.email}>
                                <input className={inputClass} type="email"
                                    value={profileForm.data.email}
                                    onChange={e => {
                                        profileForm.setData('email', e.target.value);
                                        if (profileForm.errors.email) profileForm.clearErrors('email');
                                    }}
                                    required
                                />
                            </FormField>
                            <div className="pt-2 flex items-center gap-2.5 sm:gap-3 flex-wrap">
                                <button type="submit" disabled={profileForm.processing}
                                    className="px-4 sm:px-5 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors shadow-card"
                                >
                                    {profileForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 rounded-lg text-body-sm font-semibold text-status-err border border-status-err-bg hover:bg-status-err-bg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    Keluar dari Akun
                                </button>
                                {profileForm.recentlySuccessful && (
                                    <p className="text-body-sm text-status-ok font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                        Disimpan!
                                    </p>
                                )}
                            </div>
                        </form>
                    </Section>
                )}

                {/* ── Tab: Keamanan ── */}
                {activeTab === 'keamanan' && (
                    <Section title="Ganti Password" icon="lock">
                        <form onSubmit={submitPassword} noValidate className="space-y-4 max-w-md">
                            <FormField label="Password Baru *" error={passwordForm.errors.password}>
                                <PasswordInput
                                    value={passwordForm.data.password}
                                    onChange={e => handlePasswordFormChange('password', e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Minimal 8 karakter"
                                />
                                <div className="mt-1 flex items-center gap-1 text-label-caps">
                                    {checkPasswordRequirements(passwordForm.data.password) ? (
                                        <span className="text-status-ok flex items-center gap-1 font-semibold">
                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                            Minimal 8 karakter serta kombinasi huruf dan angka terpenuhi
                                        </span>
                                    ) : (
                                        <span className="text-subtle">Minimal 8 karakter, kombinasi huruf dan angka</span>
                                    )}
                                </div>
                            </FormField>
                            <FormField label="Konfirmasi Password Baru *" error={passwordForm.errors.password_confirmation}>
                                <PasswordInput
                                    value={passwordForm.data.password_confirmation}
                                    onChange={e => handlePasswordFormChange('password_confirmation', e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Ulangi password baru"
                                />
                                {passwordForm.data.password_confirmation && (
                                    <div className="mt-1 flex items-center gap-1 text-label-caps">
                                        {passwordForm.data.password === passwordForm.data.password_confirmation ? (
                                            <span className="text-status-ok flex items-center gap-1 font-semibold">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                Password konfirmasi cocok
                                            </span>
                                        ) : (
                                            <span className="text-status-err flex items-center gap-1 font-semibold">
                                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                                Password konfirmasi belum cocok
                                            </span>
                                        )}
                                    </div>
                                )}
                            </FormField>
                            <div className="pt-2 flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark cursor-pointer shadow-card disabled:opacity-60 transition-colors"
                                >
                                    {passwordForm.processing ? 'Menyimpan...' : 'Perbarui Password'}
                                </button>
                                {passwordForm.recentlySuccessful && (
                                    <p className="text-body-sm text-status-ok font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                        Password diperbarui!
                                    </p>
                                )}
                            </div>
                        </form>
                    </Section>
                )}

                {/* ── Tab: Manajemen Admin ── */}
                {activeTab === 'admin' && (
                    <Section title="Manajemen Admin" icon="manage_accounts">
                        <div className="space-y-4">
                            {/* Header baris */}
                            <div className="flex items-center justify-between">
                                <p className="text-body-sm text-muted">
                                    <span className="font-semibold text-ink">{admins.length}</span> akun admin terdaftar
                                </p>
                                <button
                                    onClick={() => setShowAddAdmin(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                                    Tambah Admin
                                </button>
                            </div>

                            {/* Daftar kartu admin */}
                            <div className="space-y-2">
                                {admins.map(admin => (
                                    <div
                                        key={admin.id}
                                        className="flex items-center gap-3 p-4 rounded-xl border border-border-base bg-surface hover:bg-surface-mid transition-colors shadow-xs"
                                    >
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-body-sm font-semibold text-ink truncate">{admin.name}</p>
                                                {admin.is_self && (
                                                    <span className="text-label-caps bg-primary-soft text-primary px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                                                        Anda
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-label-md text-subtle truncate">{admin.email}</p>
                                            <p className="text-label-caps text-subtle mt-0.5">Bergabung {admin.created_at}</p>
                                        </div>

                                        {/* Action buttons — hanya untuk bukan akun sendiri */}
                                        {!admin.is_self && (
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => setAdminToReset(admin)}
                                                    title="Reset Password"
                                                    className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary-soft transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                                                </button>
                                                <button
                                                    onClick={() => setAdminToDelete(admin)}
                                                    title="Hapus Akun"
                                                    className="p-2 rounded-lg text-muted hover:text-status-err hover:bg-status-err-bg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Info proteksi */}
                            <div className="flex items-start gap-2 p-3 bg-surface rounded-lg border border-border-base">
                                <span className="material-symbols-outlined text-muted text-[16px] mt-0.5 flex-shrink-0">info</span>
                                <p className="text-label-md text-muted">
                                    Akun Anda tidak dapat dihapus oleh sesama admin, dan sistem akan mencegah penghapusan jika hanya tersisa 1 admin aktif.
                                </p>
                            </div>
                        </div>
                    </Section>
                )}

                {/* ── Tab: Tentang Portal / Sistem ── */}
                {activeTab === 'sistem' && (
                    <div className="space-y-5">
                        {/* Tim Pengembang */}
                        <Section title="Tim Pengembang" icon="group">
                            <div className="space-y-3">
                                <p className="text-body-sm text-muted">
                                    Portal Terintegrasi UKM LeDHaK UNHAS dikembangkan dan dikelola oleh:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    {DEVELOPERS.map(dev => (
                                        <div
                                            key={dev.name}
                                            className="p-4 sm:p-5 rounded-xl border border-border-base bg-surface flex flex-col justify-between gap-3.5 hover:border-primary/40 transition-colors shadow-sm"
                                        >
                                            <div className="flex items-start gap-3.5">
                                                <div className="w-11 h-11 rounded-full bg-primary-soft text-primary font-bold text-body-md flex items-center justify-center flex-shrink-0 shadow-sm">
                                                    {dev.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-body-sm sm:text-body-md font-bold text-ink">
                                                        {dev.name} <span className="text-border-strong font-semibold mx-1.5 select-none">|</span> {dev.batch}
                                                    </p>
                                                    <p className="text-body-sm text-ink font-medium mt-1">
                                                        {dev.position}
                                                    </p>
                                                    <p className="text-label-md text-primary font-semibold mt-0.5 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[15px]">code</span>
                                                        {dev.role}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-3 border-t border-border-base flex-wrap">
                                                {dev.socials.map(soc => (
                                                    <a
                                                        key={soc.href}
                                                        href={soc.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-base bg-surface text-label-md font-medium text-ink hover:text-primary hover:border-primary transition-colors shadow-xs"
                                                    >
                                                        {soc.type === 'github' ? (
                                                            <GithubIcon className="w-3.5 h-3.5 text-ink flex-shrink-0" />
                                                        ) : (
                                                            <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C] flex-shrink-0" />
                                                        )}
                                                        <span>{soc.label}</span>
                                                        <span className="material-symbols-outlined text-[13px] text-muted">arrow_outward</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* Informasi Project & Coding */}
                        <Section title="Informasi Project" icon="code">
                            <div className="space-y-4">
                                <p className="text-body-sm text-muted">
                                    Arsitektur dan teknologi yang mendasari sistem informasi dan operasional portal:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3.5 rounded-xl border border-border-base bg-surface shadow-xs">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
                                            <p className="text-label-caps text-primary font-bold">Backend Framework</p>
                                        </div>
                                        <p className="text-body-sm font-semibold text-ink">Laravel 11</p>
                                        <p className="text-label-md text-subtle mt-0.5">Eloquent ORM, Route Model Binding, Soft Deletes, Activity Logs</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl border border-border-base bg-surface shadow-xs">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-primary text-[18px]">devices</span>
                                            <p className="text-label-caps text-primary font-bold">Frontend Stack</p>
                                        </div>
                                        <p className="text-body-sm font-semibold text-ink">React 18 + Inertia.js v2</p>
                                        <p className="text-label-md text-subtle mt-0.5">Tailwind CSS v3, Radix UI Primitives, Material Symbols</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl border border-border-base bg-surface shadow-xs">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-primary text-[18px]">database</span>
                                            <p className="text-label-caps text-primary font-bold">Database & Cloud Storage</p>
                                        </div>
                                        <p className="text-body-sm font-semibold text-ink">MySQL / TiDB Cloud</p>
                                        <p className="text-label-md text-subtle mt-0.5">Database terenkripsi SSL, relasi multi-tabel, asset URL resolver</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl border border-border-base bg-surface shadow-xs">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-primary text-[18px]">sync</span>
                                            <p className="text-label-caps text-primary font-bold">Integrasi Eksternal</p>
                                        </div>
                                        <p className="text-body-sm font-semibold text-ink">Google Apps Script Webhook</p>
                                        <p className="text-label-md text-subtle mt-0.5">Otomasi sinkronisasi sirkulasi peminjaman ke Google Sheets</p>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Konfigurasi Lingkungan */}
                        <Section title="Konfigurasi Lingkungan" icon="settings">
                            <div className="space-y-3 max-w-lg">
                                <div className="flex items-center justify-between py-2.5 border-b border-border-base">
                                    <div>
                                        <p className="text-body-sm font-semibold text-ink">Application Version</p>
                                        <p className="text-label-md text-muted">LeDHaK Inventory Portal</p>
                                    </div>
                                    <span className="font-mono text-body-sm text-ink font-medium bg-surface border border-border-base px-3 py-1 rounded-lg">
                                        v1.0
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2.5 border-b border-border-base">
                                    <div>
                                        <p className="text-body-sm font-semibold text-ink">Versi Laravel</p>
                                        <p className="text-label-md text-muted">Framework backend</p>
                                    </div>
                                    <span className="font-mono text-body-sm text-ink font-medium bg-surface border border-border-base px-3 py-1 rounded-lg">
                                        v{system_info?.laravel_version}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2.5 border-b border-border-base">
                                    <div>
                                        <p className="text-body-sm font-semibold text-ink">Versi PHP</p>
                                        <p className="text-label-md text-muted">Runtime server</p>
                                    </div>
                                    <span className="font-mono text-body-sm text-ink font-medium bg-surface border border-border-base px-3 py-1 rounded-lg">
                                        {system_info?.php_version}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between py-2.5">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-body-sm font-semibold text-ink">Google Sheets Sync</p>
                                        <p className="text-label-md text-muted">Otomasi sinkronisasi sirkulasi peminjaman</p>
                                    </div>
                                    <span className={`ml-3 text-label-caps px-2.5 py-1 rounded-full font-bold flex-shrink-0 ${
                                        google_sheets_url
                                            ? 'bg-status-ok-bg text-status-ok'
                                            : 'bg-status-warn-bg text-status-warn'
                                    }`}>
                                        {google_sheets_url ? 'Terhubung' : 'Belum dikonfigurasi'}
                                    </span>
                                </div>
                                {!google_sheets_url && (
                                    <div className="p-3 bg-status-warn-bg rounded-lg border-l-4 border-status-warn">
                                        <p className="text-label-md text-status-warn font-medium">
                                            Set <code className="font-mono">GOOGLE_APPS_SCRIPT_URL</code> di file <code className="font-mono">.env</code> untuk mengaktifkan sinkronisasi Google Sheets.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Section>
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            <AddAdminModal show={showAddAdmin} onClose={() => setShowAddAdmin(false)} />
            <ResetPasswordModal
                show={!!adminToReset}
                admin={adminToReset}
                onClose={() => setAdminToReset(null)}
            />
            <ConfirmAction
                open={!!adminToDelete}
                onOpenChange={(isOpen) => {
                    if (!isOpen) setAdminToDelete(null);
                }}
                onConfirm={handleDeleteAdmin}
                title={adminToDelete ? `Hapus akun "${adminToDelete.name}"?` : 'Hapus Akun Admin?'}
                description="Tindakan ini tidak dapat dibatalkan. Akun admin ini akan dihapus permanen dari sistem."
                confirmText={isDeleting ? 'Menghapus...' : 'Ya, Hapus Akun'}
                cancelText="Batal"
                variant="destructive"
            />
            <ConfirmAction
                open={showLogoutConfirm}
                onOpenChange={setShowLogoutConfirm}
                onConfirm={() => {
                    setShowLogoutConfirm(false);
                    router.post(route('logout'));
                }}
                title="Keluar dari Akun?"
                description="Anda akan keluar dari sesi admin portal inventaris LeDHaK UNHAS."
                confirmText="Ya, Keluar"
                cancelText="Batal"
                variant="destructive"
            />
        </AdminLayout>
    );
}
