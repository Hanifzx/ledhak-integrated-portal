import forms from '@tailwindcss/forms';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
// NOTE: Color values come from CSS variables defined in resources/css/app.css
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Hanken Grotesk', 'sans-serif'],
            },
            fontSize: {
                'h1':          ['24px', { lineHeight: '32px',  letterSpacing: '-0.02em', fontWeight: '700' }],
                'h2':          ['20px', { lineHeight: '28px',  letterSpacing: '-0.01em', fontWeight: '700' }],
                'h3':          ['16px', { lineHeight: '24px',  fontWeight: '600' }],
                'body-md':     ['14px', { lineHeight: '21px',  fontWeight: '400' }],
                'body-sm':     ['13px', { lineHeight: '18px',  fontWeight: '400' }],
                'label-md':    ['12px', { lineHeight: '16px',  letterSpacing: '0.02em', fontWeight: '500' }],
                'label-caps':  ['11px', { lineHeight: '16px',  letterSpacing: '0.05em', fontWeight: '700' }],
            },
            spacing: {
                'xs': '4px',
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
            },
            colors: {
                'bg':           'var(--color-bg)',
                'bg-subtle':    'var(--color-bg-subtle)',
                'surface':      'var(--color-surface)',
                'surface-low':  'var(--color-surface-low)',
                'surface-mid':  'var(--color-surface-mid)',
                'border-base':  'var(--color-border)',
                'border-strong':'var(--color-border-strong)',
                'primary':      'var(--color-primary)',
                'primary-dark': 'var(--color-primary-dark)',
                'primary-soft': 'var(--color-primary-soft)',
                'on-primary':   'var(--color-on-primary)',
                'ink':          'var(--color-text)',
                'muted':        'var(--color-text-muted)',
                'subtle':       'var(--color-text-subtle)',
                'status-ok':    'var(--color-ok)',
                'status-ok-bg': 'var(--color-ok-bg)',
                'status-warn':  'var(--color-warn)',
                'status-warn-bg':'var(--color-warn-bg)',
                'status-err':   'var(--color-err)',
                'status-err-bg':'var(--color-err-bg)',
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                'lg': '0.5rem',
                'xl': '0.75rem',
                'full': '9999px',
            },
            boxShadow: {
                'card': '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                'card-hover': '0 4px 12px rgba(99,1,2,0.10)',
            },
        },
    },

    plugins: [forms, animate],
};
