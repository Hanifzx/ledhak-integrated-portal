/**
 * Shared admin UI building blocks.
 * Menghilangkan duplikasi pattern yang berulang di halaman Inventaris,
 * Peminjaman, Artikel, dan Laporan.
 */

import { Link } from '@inertiajs/react';

// ── CSS class constants ────────────────────────────────────────────────────
export const INPUT_CLS =
    'w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink ' +
    'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface';

export const SELECT_CLS =
    'w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink ' +
    'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface';

// ── Breadcrumb ─────────────────────────────────────────────────────────────
/**
 * Breadcrumb / Eyebrow navigation di atas judul besar halaman.
 * @param {{ items: { label: string, href?: string, icon?: string }[] }} props
 */
export function Breadcrumb({ items = [] }) {
    if (!items || items.length === 0) return null;

    const firstIcon = items.find(i => i.icon)?.icon;

    return (
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 sm:gap-2 mb-2 text-body-sm text-muted select-none">
            {firstIcon && (
                <span className="material-symbols-outlined text-[17px] text-muted flex-shrink-0">
                    {firstIcon}
                </span>
            )}
            {items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                return (
                    <span key={idx} className="flex items-center gap-1.5 sm:gap-2">
                        {idx > 0 && <span className="text-border-strong font-normal select-none">/</span>}
                        {item.href && !isLast ? (
                            <Link href={item.href} className="hover:text-primary transition-colors font-medium">
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? "text-ink font-semibold" : "font-medium"}>
                                {item.label}
                            </span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}

// ── PageHeader ─────────────────────────────────────────────────────────────
/**
 * Header baris judul + subtitle + action button + breadcrumb.
 * @param {{ title: string, subtitle?: React.ReactNode, action?: React.ReactNode, breadcrumb?: { label: string, href?: string, icon?: string }[] }} props
 */
export function PageHeader({ title, subtitle, action, breadcrumb = [] }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <div>
                {breadcrumb && breadcrumb.length > 0 && (
                    <Breadcrumb items={breadcrumb} />
                )}
                <h2 className="text-h2 sm:text-h1 text-ink font-bold">{title}</h2>
                {subtitle && <p className="text-body-sm sm:text-body-md text-muted mt-1">{subtitle}</p>}
            </div>
            {action && <div className="flex-shrink-0 mt-1">{action}</div>}
        </div>
    );
}

// ── FilterBar ──────────────────────────────────────────────────────────────
/**
 * Tab filter pills horizontal.
 * @param {{ items: {label:string,value:string}[], activeValue: string, onSelect: (v:string)=>void }} props
 */
export function FilterBar({ items, activeValue, onSelect }) {
    return (
        <div className="flex gap-2 flex-wrap">
            {items.map(f => (
                <button
                    key={f.value}
                    onClick={() => onSelect(f.value)}
                    className={`px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors ${
                        activeValue === f.value
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface border border-border-base text-muted hover:border-primary hover:text-ink'
                    }`}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
}

// ── SearchInput ────────────────────────────────────────────────────────────
/**
 * Input pencarian dengan ikon search di kiri.
 * @param {{ value: string, onChange: (e)=>void, placeholder?: string }} props
 */
export function SearchInput({ value, onChange, placeholder = 'Cari...' }) {
    return (
        <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle text-[18px]">
                search
            </span>
            <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-base bg-surface text-body-md text-ink placeholder:text-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

// ── FormField ──────────────────────────────────────────────────────────────
/**
 * Wrapper label + children (input/select) + pesan error inertia.
 * @param {{ label: string, error?: string, required?: boolean, children: React.ReactNode }} props
 */
export function FormField({ label, error, required, children }) {
    return (
        <div>
            <label className="block text-label-md text-muted mb-1">
                {label}{required && ' *'}
            </label>
            {children}
            {error && <p className="text-label-md text-status-err mt-1">{error}</p>}
        </div>
    );
}

// ── FormActions ────────────────────────────────────────────────────────────
/**
 * Tombol Batal + Simpan standar di footer form modal.
 * @param {{ onCancel:()=>void, processing?:boolean, submitLabel?:string }} props
 */
export function FormActions({ onCancel, processing, submitLabel = 'Simpan' }) {
    return (
        <div className="flex justify-end gap-2 pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-body-sm text-muted border border-border-base hover:bg-bg transition-colors"
            >
                Batal
            </button>
            <button
                type="submit"
                disabled={processing}
                className="px-5 py-2 rounded-lg text-body-sm bg-primary text-on-primary font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
            >
                {processing ? 'Menyimpan...' : submitLabel}
            </button>
        </div>
    );
}
