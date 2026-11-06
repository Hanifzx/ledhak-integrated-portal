import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ConfirmAction({ 
    children, 
    onConfirm, 
    title = "Apakah Anda yakin?", 
    description = "Tindakan ini tidak dapat dibatalkan.", 
    confirmText = "Ya, lanjutkan", 
    cancelText = "Batal",
    variant = "destructive",
    open,
    onOpenChange
}) {
    // Menyesuaikan class warna berdasarkan varian (tema LeDHaK)
    const confirmButtonClass = variant === 'destructive' 
        ? "bg-status-err hover:bg-red-700 text-white" 
        : "bg-primary hover:bg-primary-dark text-on-primary";

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {children && (
                <AlertDialogTrigger asChild>
                    {children}
                </AlertDialogTrigger>
            )}
            <AlertDialogContent className="bg-surface border-border-base rounded-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-ink">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-border-base text-ink hover:bg-bg">{cancelText}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className={confirmButtonClass}>
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
