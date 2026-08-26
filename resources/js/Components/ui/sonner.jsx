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
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
