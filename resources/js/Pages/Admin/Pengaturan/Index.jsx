import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function Section({ title, icon, children }) {
    return (
        <div className="bg-surface rounded-xl border border-border-base shadow-card overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border-base bg-bg">
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

const inputClass = "w-full px-3 py-2.5 rounded-lg border border-border-base bg-bg text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-subtle";

export default function PengaturanIndex({ user, system_info, google_sheets_url }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('profil');

    const profileForm = useForm({ name: user?.name ?? '', email: user?.email ?? '' });
    const passwordForm = useForm({ current_password: '', password: '', password_confirmation: '' });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('admin.pengaturan.profile'));
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.post(route('admin.pengaturan.password'), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    const TABS = [
        { key: 'profil',    icon: 'person',   label: 'Profil Akun' },
        { key: 'keamanan',  icon: 'lock',     label: 'Keamanan' },
        { key: 'sistem',    icon: 'info',      label: 'Info Sistem' },
    ];

    return (
        <AdminLayout title="Pengaturan">
            <Head title="Pengaturan — LeDHaK" />

            <div className="max-w-4xl mx-auto space-y-5">
                {/* Header */}
                <div>
                    <h2 className="text-h1 text-ink">Pengaturan</h2>
                    <p className="text-body-sm text-muted mt-1">Kelola akun dan konfigurasi sistem.</p>
                </div>

                {/* Flash message */}
                {flash?.success && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-status-ok-bg border border-status-ok rounded-lg text-body-sm text-status-ok font-medium">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        {flash.success}
                    </div>
                )}

                {/* Tab Nav */}
                <div className="flex gap-1 bg-surface rounded-xl border border-border-base p-1 shadow-card w-fit">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                                activeTab === tab.key
                                    ? 'bg-primary text-on-primary shadow-card font-semibold'
                                    : 'text-muted hover:text-ink hover:bg-bg'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab: Profil ── */}
                {activeTab === 'profil' && (
                    <Section title="Profil Akun" icon="person">
                        <form onSubmit={submitProfile} className="space-y-4 max-w-md">
                            <FormField label="Nama Lengkap *" error={profileForm.errors.name}>
                                <input className={inputClass}
                                    value={profileForm.data.name}
                                    onChange={e => profileForm.setData('name', e.target.value)}
                                    required
                                />
                            </FormField>
                            <FormField label="Alamat Email *" error={profileForm.errors.email}>
                                <input className={inputClass} type="email"
                                    value={profileForm.data.email}
                                    onChange={e => profileForm.setData('email', e.target.value)}
                                    required
                                />
                            </FormField>
                            <div className="pt-2 flex items-center gap-3">
                                <button type="submit" disabled={profileForm.processing}
                                    className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
                                >
                                    {profileForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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
                        <form onSubmit={submitPassword} className="space-y-4 max-w-md">
                            <FormField label="Password Saat Ini *" error={passwordForm.errors.current_password}>
                                <input className={inputClass} type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={e => passwordForm.setData('current_password', e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                            </FormField>
                            <FormField label="Password Baru *" error={passwordForm.errors.password}>
                                <input className={inputClass} type="password"
                                    value={passwordForm.data.password}
                                    onChange={e => passwordForm.setData('password', e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <p className="text-label-caps text-subtle mt-1">Minimal 8 karakter.</p>
                            </FormField>
                            <FormField label="Konfirmasi Password Baru *" error={passwordForm.errors.password_confirmation}>
                                <input className={inputClass} type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                            </FormField>
                            <div className="pt-2 flex items-center gap-3">
                                <button type="submit" disabled={passwordForm.processing}
                                    className="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
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

                {/* ── Tab: Sistem ── */}
                {activeTab === 'sistem' && (
                    <div className="space-y-4">
                        <Section title="Statistik Sistem" icon="monitoring">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {[
                                    { label: 'Total Barang',       value: system_info?.total_items,  icon: 'inventory_2' },
                                    { label: 'Total Peminjaman',   value: system_info?.total_loans,  icon: 'handshake' },
                                    { label: 'Sirkulasi Aktif',    value: system_info?.active_loans, icon: 'sync_alt' },
                                ].map(stat => (
                                    <div key={stat.label} className="bg-bg rounded-xl p-4 border border-border-base text-center">
                                        <span className="material-symbols-outlined text-primary text-[24px] block mb-2">{stat.icon}</span>
                                        <p className="text-[28px] font-bold text-ink leading-none">{stat.value ?? 0}</p>
                                        <p className="text-label-md text-muted mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section title="Konfigurasi" icon="settings">
                            <div className="space-y-3 max-w-lg">
                                <div className="flex items-center justify-between py-3 border-b border-border-base">
                                    <div>
                                        <p className="text-body-sm font-semibold text-ink">Versi Laravel</p>
                                        <p className="text-label-md text-muted">Framework backend</p>
                                    </div>
                                    <span className="font-mono text-body-sm text-primary font-semibold bg-primary-soft px-3 py-1 rounded-lg">
                                        v{system_info?.laravel_version}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-border-base">
                                    <div>
                                        <p className="text-body-sm font-semibold text-ink">Versi PHP</p>
                                        <p className="text-label-md text-muted">Runtime server</p>
                                    </div>
                                    <span className="font-mono text-body-sm text-muted bg-bg-subtle px-3 py-1 rounded-lg">
                                        {system_info?.php_version}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between py-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-body-sm font-semibold text-ink">Google Apps Script URL</p>
                                        <p className="text-label-md text-muted">Untuk sinkronisasi Google Sheets</p>
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
        </AdminLayout>
    );
}
