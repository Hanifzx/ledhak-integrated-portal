/**
 * Shared admin UI building blocks.
 * Menghilangkan duplikasi pattern yang berulang di halaman Inventaris,
 * Peminjaman, Artikel, dan Laporan.
 */

// ── CSS class constants ────────────────────────────────────────────────────
export const INPUT_CLS =
    'w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink ' +
    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface';

export const SELECT_CLS =
    'w-full px-3 py-2 rounded-lg border border-border-base text-body-md text-ink ' +
    'focus:outline-none focus:ring-2 focus:ring-primary bg-surface';

// ── PageHeader ─────────────────────────────────────────────────────────────
/**
 * Header baris judul + subtitle + action button (selalu flex-row, button di kanan).
 * @param {{ title: string, subtitle?: string, action?: React.ReactNode }} props
 */
export function PageHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div>
                <h2 className="text-h2 sm:text-h1 text-ink">{title}</h2>
                {subtitle && <p className="text-body-sm text-muted mt-1">{subtitle}</p>}
            </div>
            {action}
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
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-base bg-surface text-body-md text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary"
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
