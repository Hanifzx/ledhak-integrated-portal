import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader } from '@/Components/Admin/AdminUI';

export default function ArtikelForm({ article }) {
    const isEdit = !!article;

    const form = useForm({
        title: article?.title ?? '',
        content: article?.content ?? '',
        status: article?.status ?? 'Draft',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            form.put(route('admin.artikel.update', article.id));
        } else {
            form.post(route('admin.artikel.store'));
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Artikel' : 'Tulis Artikel'}>
            <Head title={`${isEdit ? 'Edit' : 'Tulis'} Artikel — LeDHaK`} />

            <div className="max-w-3xl mx-auto space-y-5">
                <PageHeader
                    breadcrumb={[
                        { icon: 'article', label: 'Artikel', href: route('admin.artikel.index') },
                        { label: isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru' }
                    ]}
                    title={isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                    subtitle={isEdit ? 'Perbarui konten artikel dan status publikasi.' : 'Tulis draf artikel baru untuk portal publik UKM LeDHaK.'}
                    action={
                        <Link
                            href={route('admin.artikel.index')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-base text-body-sm font-medium text-muted hover:text-ink hover:bg-surface-mid transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Kembali
                        </Link>
                    }
                />

                <form onSubmit={submit} className="bg-surface rounded-xl border border-border-base shadow-card p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-label-md text-muted mb-1.5 font-medium">Judul Artikel *</label>
                        <input
                            className="w-full px-4 py-3 rounded-lg border border-border-base text-h3 text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-primary bg-surface placeholder:text-subtle"
                            placeholder="Masukkan judul artikel..."
                            value={form.data.title}
                            onChange={e => form.setData('title', e.target.value)}
                            required
                        />
                        {form.errors.title && <p className="text-label-md text-status-err mt-1">{form.errors.title}</p>}
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-label-md text-muted mb-1.5 font-medium">Isi Artikel *</label>
                        <textarea
                            className="w-full px-4 py-3 rounded-lg border border-border-base text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary bg-surface resize-y min-h-[320px] placeholder:text-subtle"
                            placeholder="Tulis isi artikel di sini..."
                            value={form.data.content}
                            onChange={e => form.setData('content', e.target.value)}
                            required
                        />
                        {form.errors.content && <p className="text-label-md text-status-err mt-1">{form.errors.content}</p>}
                    </div>

                    {/* Status + Submit */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border-base">
                        <div className="flex items-center gap-3">
                            <label className="text-label-md text-muted font-medium">Status:</label>
                            <div className="flex rounded-lg overflow-hidden border border-border-base">
                                {['Draft', 'Published'].map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => form.setData('status', s)}
                                        className={`px-4 py-1.5 text-label-md font-semibold transition-colors ${
                                            form.data.status === s
                                                ? 'bg-primary text-on-primary'
                                                : 'bg-surface text-muted hover:bg-bg'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 sm:justify-end">
                            <Link
                                href={route('admin.artikel.index')}
                                className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-body-sm text-muted border border-border-base hover:bg-bg transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-body-sm bg-primary text-on-primary font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
                            >
                                {form.processing ? 'Menyimpan...' : isEdit ? 'Perbarui Artikel' : 'Simpan Artikel'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
