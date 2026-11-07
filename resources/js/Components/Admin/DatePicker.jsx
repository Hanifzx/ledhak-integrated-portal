import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Calendar } from '@/Components/ui/calendar';

export default function DatePicker({ value, onChange, placeholder = "Pilih tanggal", className = "" }) {
    const [open, setOpen] = useState(false);
    const date = value ? parseISO(value) : undefined;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={`w-full px-2.5 sm:px-3 py-2 rounded-lg border border-border-base bg-surface text-body-sm sm:text-body-md text-left flex items-center justify-between transition-colors hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
                        !date ? 'text-muted' : 'text-ink font-medium'
                    } ${className}`}
                >
                    <span className="truncate">
                        {date ? format(date, "d MMM yyyy", { locale: id }) : placeholder}
                    </span>
                    <span className="material-symbols-outlined text-subtle text-[16px] sm:text-[18px] flex-shrink-0 ml-1.5 sm:ml-2">
                        calendar_today
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0 z-[100] bg-surface bg-white shadow-xl rounded-xl border border-border-base"
                align="start"
                style={{ backgroundColor: 'white' }}
            >
                <Calendar
                    className="bg-surface bg-white p-3 rounded-xl"
                    style={{ backgroundColor: 'white' }}
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                        onChange(d ? format(d, "yyyy-MM-dd") : '');
                        setOpen(false);
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

