import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            {links.map((link, i) => (
                link.url ? (
                    <Link
                        key={i}
                        href={link.url}
                        className={`px-3 py-1.5 rounded-lg text-body-sm transition-colors ${
                            link.active
                                ? 'bg-primary text-on-primary font-semibold'
                                : 'text-muted hover:bg-surface-mid'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg text-body-sm text-subtle cursor-not-allowed opacity-50"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
