const STATUS_MAP = {
    'Tersedia':  { bg: 'bg-status-ok-bg',   text: 'text-status-ok',   label: 'Tersedia' },
    'Dipinjam':  { bg: 'bg-status-err-bg',  text: 'text-status-err',  label: 'Dipinjam' },
    'Perbaikan': { bg: 'bg-status-warn-bg', text: 'text-status-warn', label: 'Perbaikan' },
    'Hilang':    { bg: 'bg-surface-mid',    text: 'text-ink',         label: 'Hilang' },
    'Active':    { bg: 'bg-status-err-bg',  text: 'text-status-err',  label: 'Aktif' },
    'Returned':  { bg: 'bg-status-ok-bg',   text: 'text-status-ok',   label: 'Dikembalikan' },
    'Overdue':   { bg: 'bg-status-err-bg',  text: 'text-status-err',  label: 'Terlambat' },
    'Published': { bg: 'bg-status-ok-bg',   text: 'text-status-ok',   label: 'Published' },
    'Draft':     { bg: 'bg-status-warn-bg', text: 'text-status-warn', label: 'Draft' },
};

export default function StatusBadge({ status }) {
    const cfg = STATUS_MAP[status] ?? { bg: 'bg-surface-mid', text: 'text-muted', label: status };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-caps font-bold ${cfg.bg} ${cfg.text} whitespace-nowrap`}>
            {cfg.label}
        </span>
    );
}
