import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'LeDHaK UNHAS';

createInertiaApp({
    title: (title) => {
        if (!title) return appName;
        const cleanTitle = title.replace(/—/g, '-').trim();
        if (cleanTitle.toLowerCase().includes(appName.toLowerCase())) {
            return cleanTitle;
        }
        return `${cleanTitle} | ${appName}`;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#630102',
    },
});
