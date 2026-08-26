import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Pagination from '@/Components/Admin/Pagination';
import { useDebounce } from '@/Utils/debounce';
import { toastSuccess, toastError, TOAST_MESSAGES } from '@/Utils/toast';
import ConfirmAction from '@/Components/Admin/ConfirmAction';

const FILTER_LABELS = [
    { label: 'Semua', value: '' },
    { label: 'Published', value: 'Published' },
    { label: 'Draft', value: 'Draft' },
];

export default function ArtikelIndex({ articles, filters }) {
    const [searchVal, setSearchVal] = useState(filters?.search ?? '');

    const debouncedSearch = useDebounce((val) => {
        router.get(route('admin.artikel.index'), { search: val, status: filters?.status ?? '' }, { preserveState: true, replace: true });
    }, 350);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchVal(val);
        debouncedSearch(val);
    };

    const handleDelete = (article) => {
        router.delete(route('admin.artikel.destroy', article.id), {
            onSuccess: () => {
                const m = TOAST_MESSAGES.articleDeleted;
                toastSuccess(m.title, m.description);
            },
            onError: () => toastError(TOAST_MESSAGES.failed.title, TOAST_MESSAGES.failed.description),
        });
    };

    const applyFilter = (value) => {
        router.get(route('admin.artikel.index'), { status: value, search: filters?.search ?? '' }, { preserveState: true, replace: true });
    };

    const activeFilter = filters?.status ?? '';

    return (
        <AdminLayout title="Artikel">
            <Head title="Artikel — LeDHaK" />

            <div className="max-w-6xl mx-auto space-y-5">
                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-h1 text-ink">Manajemen Artikel</h2>
                        <p className="text-body-sm text-muted mt-1">{articles?.total ?? 0} total artikel</p>
                    </div>
                    <Link
                        href={route('admin.artikel.create')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark transition-colors shadow-card"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Tulis Artikel
                    </Link>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle text-[18px]">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-base bg-surface text-body-md text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Cari judul artikel..."
                            value={searchVal}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex gap-2">
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
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-border-base bg-bg">
                                <th className="py-3 px-5 text-label-caps text-muted text-left">Judul</th>
                                <th className="py-3 px-5 text-label-caps text-muted text-left w-32">Status</th>
                                <th className="py-3 px-5 text-label-caps text-muted text-left w-36">Terakhir Diperbarui</th>
                                <th className="py-3 px-5 text-label-caps text-muted text-right w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base">
                            {articles?.data?.length > 0 ? articles.data.map((article) => (
                                <tr key={article.id} className="hover:bg-bg transition-colors group">
                                    <td className="py-3 px-5">
                                        <p className="text-body-sm font-semibold text-ink group-hover:text-primary transition-colors">{article.title}</p>
                                        <p className="text-label-md text-subtle mt-0.5">/{article.slug}</p>
                                    </td>
                                    <td className="py-3 px-5">
                                        <StatusBadge status={article.status} />
                                    </td>
                                    <td className="py-3 px-5 text-body-sm text-muted">
                                        {article.updated_at_diff ?? article.updated_at}
                                    </td>
                                    <td className="py-3 px-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={route('admin.artikel.edit', article.id)}
                                                className="p-1.5 text-subtle hover:text-primary hover:bg-primary-soft rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </Link>
                                            <ConfirmAction
                                                onConfirm={() => handleDelete(article)}
                                                title="Hapus Artikel"
                                                description={`Hapus artikel "${article.title}"? Tindakan ini tidak bisa dibatalkan.`}
                                            >
                                                <button className="p-1.5 text-subtle hover:text-status-err hover:bg-status-err-bg rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </ConfirmAction>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-muted">
                                        <span className="material-symbols-outlined text-[36px] block mb-2 text-border-base">article</span>
                                        Belum ada artikel
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={articles?.links} />
            </div>
        </AdminLayout>
    );
}
