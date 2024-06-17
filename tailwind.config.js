import colors from 'tailwindcss/colors';
import { createThemes } from 'tw-colors';

const config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        'node_modules/preline/dist/*.js',
        './src/**/*.{js,jsx,ts,tsx}',
        './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
    ],

    darkMode: ['class'],

    theme: {
        container: {
            center: true,
            padding: '1rem',
        },

        fontFamily: {
            sans: ['Be Vietnam Pro', 'sans-serif'],
            handrawn: ['Delicious Handrawn', 'cursive'],
        },

        extend: {
            colors: {
                primary: {
                    50: '#F1F9EC',
                    100: '#E0F2D4',
                    200: '#C1E4A9',
                    300: '#A2D77F',
                    400: '#83CA54',
                    500: '#67B137',
                    600: '#528C2C',
                    700: '#3E6921',
                    800: '#294616',
                    900: '#15230B',
                    950: '#0B1306',
                    DEFAULT: '#67B137',
                },
            },
            keyframes: {
                overlayShow: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                contentShow: {
                    from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
                    to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
                },
                'caret-blink': {
                    '0%,70%,100%': { opacity: '1' },
                    '20%,50%': { opacity: '0' },
                },
            },
            animation: {
                overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                'caret-blink': 'caret-blink 1.25s ease-out infinite',
            },
            spacing: {
                15: '60px',
                18: '72px',
            },

            zIndex: {
                60: '60',
                70: '70',
            },
        },
    },

    plugins: [
        require('preline/plugin'),
        require('./custom.plugin'),
        createThemes(
            {
                light: {
                    default: colors.slate,
                    primary: {
                        50: '#F1F9EC',
                        100: '#E0F2D4',
                        200: '#C1E4A9',
                        300: '#A2D77F',
                        400: '#83CA54',
                        500: '#67B137',
                        600: '#528C2C',
                        700: '#3E6921',
                        800: '#294616',
                        900: '#15230B',
                        950: '#0B1306',
                        DEFAULT: '#67B137',
                    },
                },

                dark: {
                    default: {
                        50: '#020617',
                        100: '#0f172a',
                        200: '#1e293b',
                        300: '#334155',
                        400: '#475569',
                        500: '#64748b',
                        600: '#94a3b8',
                        700: '#cbd5e1',
                        800: '#e2e8f0',
                        900: '#f1f5f9',
                        950: '#f8fafc',
                    },
                    primary: {
                        50: '#F1F9EC',
                        100: '#E0F2D4',
                        200: '#C1E4A9',
                        300: '#A2D77F',
                        400: '#83CA54',
                        500: '#67B137',
                        600: '#528C2C',
                        700: '#3E6921',
                        800: '#294616',
                        900: '#15230B',
                        950: '#0B1306',
                        DEFAULT: '#67B137',
                    },
                },
            },
            {
                defaultTheme: 'light',
            }
        ),
    ],
};
export default config;
