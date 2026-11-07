import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 640 : true
    );
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 640px)');
        const handler = (e) => setIsDesktop(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isDesktop;
}

/** Variants untuk outer wrapper agar AnimatePresence menunggu exit animation selesai sebelum unmount */
const wrapperVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
    exit:    { opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
};

/** Variants untuk backdrop */
const backdropVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
    exit:    { opacity: 0, transition: { duration: 0.2,  ease: 'easeIn'  } },
};

/** Mobile: slide up dari bawah saat masuk, slide down ke bawah saat keluar */
const mobileVariants = {
    hidden:  { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } },
    exit:    { y: '100%', opacity: 0, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } },
};

/** Desktop: scale + fade dari tengah */
const desktopVariants = {
    hidden:  { scale: 0.95, opacity: 0, y: 8 },
    visible: { scale: 1,    opacity: 1, y: 0,  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } },
    exit:    { scale: 0.95, opacity: 0, y: 8, transition: { duration: 0.2,  ease: 'easeIn' } },
};

export default function Modal({ show, title, onClose, children, size = 'md' }) {
    const isDesktop = useIsDesktop();

    useEffect(() => {
        document.body.style.overflow = show ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [show]);

    const sizeClass    = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }[size] ?? 'max-w-lg';
    const panelVariants = isDesktop ? desktopVariants : mobileVariants;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="modal-root"
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                    variants={wrapperVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                        variants={backdropVariants}
                        onClick={onClose}
                    />

                    {/* Dialog panel */}
                    <motion.div
                        className={`relative w-full ${sizeClass} bg-surface shadow-2xl border-t sm:border border-border-base flex flex-col
                            rounded-t-3xl sm:rounded-2xl
                            max-h-[92dvh] sm:max-h-[88vh]
                            pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:pb-0
                        `}
                        variants={panelVariants}
                    >
                        {/* Mobile handle indicator */}
                        <div className="sm:hidden w-10 h-1 bg-border-strong/60 rounded-full mx-auto mt-3 -mb-1 flex-shrink-0" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border-base flex-shrink-0">
                            <h2 className="text-body-md sm:text-h3 text-ink font-semibold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-subtle hover:text-ink hover:bg-surface-mid transition-colors flex-shrink-0"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Body — scrollable, touch-friendly */}
                        <div
                            className="px-5 py-5 overflow-y-auto flex-1 overscroll-contain"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                        >
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
