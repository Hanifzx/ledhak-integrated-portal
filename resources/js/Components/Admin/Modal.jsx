import { useEffect } from 'react';

export default function Modal({ show, title, onClose, children, size = 'md' }) {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [show]);

    if (!show) return null;

    const sizeClass = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }[size] ?? 'max-w-lg';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Dialog */}
            <div className={`relative w-full ${sizeClass} bg-surface rounded-xl shadow-card-hover border border-border-base`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-base">
                    <h2 className="text-h3 text-ink">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-subtle hover:text-ink hover:bg-surface-mid transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                {/* Body */}
                <div className="px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    );
}
