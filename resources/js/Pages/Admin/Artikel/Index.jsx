import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmAction from '@/Components/Admin/ConfirmAction';
import { PageHeader, SearchInput, FilterBar } from '@/Components/Admin/AdminUI';
import { useDebounce } from '@/Utils/debounce';
import { toastMsg, toastFailed } from '@/Utils/toast';

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
            onSuccess: () => toastMsg('articleDeleted'),
            onError: toastFailed,
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
                <PageHeader
                    title="Manajemen Artikel"
                    subtitle={`${articles?.total ?? 0} total artikel`}
                    action={
                        <Link
                            href={route('admin.artikel.create')}
                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-dark transition-colors shadow-card"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Tulis Artikel
                        </Link>
                    }
                />

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <SearchInput
                        value={searchVal}
                        onChange={handleSearchChange}
                        placeholder="Cari judul artikel..."
                    />
                    <FilterBar
                        items={FILTER_LABELS}
                        activeValue={activeFilter}
                        onSelect={applyFilter}
                    />
                </div>

                {/* === MOBILE CARD LIST === */}
                <div className="sm:hidden space-y-3">
                    {articles?.data?.length > 0 ? articles.data.map((article) => (
                        <div key={article.id} className="bg-surface rounded-xl border border-border-base shadow-card p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="min-w-0 flex-1">
                                    <p className="text-body-sm font-semibold text-ink">{article.title}</p>
                                    <p className="text-label-caps text-subtle mt-0.5 truncate">/{article.slug}</p>
                                </div>
                                <StatusBadge status={article.status} />
                            </div>
                            <p className="text-label-md text-muted mb-3">{article.updated_at_diff ?? article.updated_at}</p>
                            <div className="flex gap-2">
                                <Link
                                    href={route('admin.artikel.edit', article.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-label-md text-primary border border-primary rounded-lg hover:bg-primary-soft transition-colors font-medium"
                                >
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                    Edit
                                </Link>
                                <ConfirmAction
                                    onConfirm={() => handleDelete(article)}
                                    title="Hapus Artikel"
                                    description={`Hapus artikel "${article.title}"? Tindakan ini tidak bisa dibatalkan.`}
                                >
                                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-label-md text-status-err border border-status-err-bg rounded-lg hover:bg-status-err-bg transition-colors font-medium">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                        Hapus
                                    </button>
                                </ConfirmAction>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-surface rounded-xl border border-border-base p-12 text-center text-muted">
                            <span className="material-symbols-outlined text-[36px] block mb-2 text-border-base">article</span>
                            Belum ada artikel
                        </div>
                    )}
                </div>

                {/* === DESKTOP TABLE === */}
                <div className="hidden sm:block bg-surface rounded-xl border border-border-base shadow-card overflow-x-auto">
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
