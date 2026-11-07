import { Toaster as Sonner } from 'sonner';

function Toaster(props) {
    return (
        <Sonner
            position="top-center"
            richColors
            closeButton
            toastOptions={{
                classNames: {
                    toast: 'font-sans',
                    closeButton: '!left-auto !right-0 !translate-x-[35%] !translate-y-[-35%]',
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
