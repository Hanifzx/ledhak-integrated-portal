import { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';

export default function CustomSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Pilih opsi...',
    searchable = false,
    className = '',
    required = false,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Normalize options to { value, label }
    const normalizedOptions = useMemo(() => {
        return options.map((opt) => {
            if (typeof opt === 'object' && opt !== null) {
                return { value: opt.value, label: opt.label ?? String(opt.value) };
            }
            return { value: opt, label: String(opt) };
        });
    }, [options]);

    // Selected option
    const selectedOption = useMemo(() => {
        return normalizedOptions.find((opt) => String(opt.value) === String(value));
    }, [normalizedOptions, value]);

    // Filtered options based on search
    const filteredOptions = useMemo(() => {
        if (!search.trim()) return normalizedOptions;
        const q = search.toLowerCase();
        return normalizedOptions.filter((opt) => opt.label.toLowerCase().includes(q));
    }, [normalizedOptions, search]);

    return (
        <div className={`relative ${className}`}>
            {required && (
                <input
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                    value={value || ''}
                    onChange={() => {}}
                    required
                />
            )}
            <Popover open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) setSearch('');
            }}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={`w-full px-3 py-2 rounded-lg border border-border-base bg-surface text-body-md text-left flex items-center justify-between transition-colors hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
                            !selectedOption ? 'text-muted' : 'text-ink font-medium'
                        }`}
                    >
                        <span className="truncate">
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <span
                            className={`material-symbols-outlined text-subtle text-[20px] flex-shrink-0 ml-2 transition-transform duration-200 ${
                                open ? 'rotate-180 text-primary' : ''
                            }`}
                        >
                            expand_more
                        </span>
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-1.5 z-[100] bg-surface bg-white shadow-xl rounded-xl border border-border-base flex flex-col max-h-64 overflow-hidden"
                    align="start"
                    sideOffset={4}
                    style={{ backgroundColor: 'white' }}
                >
                    {(searchable || normalizedOptions.length > 7) && (
                        <div className="p-1 pb-1.5 border-b border-border-base mb-1">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-subtle text-[16px]">
                                    search
                                </span>
                                <input
                                    type="text"
                                    className="w-full pl-7 pr-2 py-1 text-body-sm bg-bg rounded-md border border-border-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-ink placeholder:text-subtle"
                                    placeholder="Cari..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}
                    <div className="overflow-y-auto flex-1 overscroll-contain space-y-0.5">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                const isSelected = String(opt.value) === String(value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.value);
                                            setOpen(false);
                                            setSearch('');
                                        }}
                                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-body-sm text-left transition-colors ${
                                            isSelected
                                                ? 'bg-primary-soft text-primary font-semibold'
                                                : 'text-ink hover:bg-surface-mid'
                                        }`}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        {isSelected && (
                                            <span className="material-symbols-outlined text-primary text-[18px] ml-1 flex-shrink-0">
                                                check
                                            </span>
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <p className="px-3 py-2 text-label-md text-muted text-center">
                                Tidak ada opsi.
                            </p>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

