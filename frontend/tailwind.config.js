// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // Add ALL paths where you use Tailwind classes
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        // Add these additional paths to be safe
        "./public/**/*.{html,js}",
        "./src/**/*.{html,js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            // Ensure default colors are available
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                black: '#000',
                white: '#fff',
                gray: {
                    50: '#f9f9f9',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
                yellow: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                // Add other colors as needed
            }
        },
    },
    purge: {
        enabled: false
    },
    plugins: [],
}