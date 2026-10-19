// Les couleurs pointent vers des variables CSS posées par ThemeProvider
// (src/theme/ThemeContext.tsx) : `bg-surface` suit donc le thème clair/sombre
// sans avoir à écrire de variante `dark:`.
const colorKeys = [
  'background', 'surface', 'surfaceAlt', 'text', 'textMuted', 'border',
  'primary', 'onPrimary', 'primarySoft', 'accent', 'onAccent', 'accentSoft',
  'danger', 'dangerSoft',
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: Object.fromEntries(
        colorKeys.map((k) => [k, `rgb(var(--color-${k}) / <alpha-value>)`]),
      ),
      fontFamily: {
        display: ['BricolageGrotesque_700Bold'],
        'display-semi': ['BricolageGrotesque_600SemiBold'],
        sans: ['DMSans_400Regular'],
        medium: ['DMSans_500Medium'],
        bold: ['DMSans_700Bold'],
      },
      spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', xxl: '32px' },
      borderRadius: { sm: '8px', md: '12px', lg: '16px', xl: '24px', pill: '999px' },
    },
  },
  plugins: [],
};
