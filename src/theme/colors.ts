// Palette EventEase : mêmes clés en clair et en sombre
export const palette = {
  light: {
    background: '#F5F6F2', // Fond d'écran
    surface: '#FFFFFF', // Cartes, champs, tab bar
    surfaceAlt: '#ECEEE8', // Chips, recherche, bouton secondaire
    text: '#15201C', // Texte principal
    textMuted: '#5B6862', // Texte secondaire, libellés
    border: '#DDE1DA', // Bordures, séparateurs
    primary: '#0D6E5F', // Boutons, onglet actif, liens
    onPrimary: '#FFFFFF', // Texte sur primary
    primarySoft: '#D8EEE8', // Chip sélectionnée, focus
    accent: '#F2A93B', // État « participé »
    onAccent: '#2A1B00', // Texte sur accent
    accentSoft: '#FCEBCF', // Talon de billet participé
    danger: '#C2412D', // Supprimer, déconnexion
    dangerSoft: '#F8DDD7', // Fond d'alerte
  },
  dark: {
    background: '#0E1412',
    surface: '#161E1B',
    surfaceAlt: '#1F2925',
    text: '#E9EFEC',
    textMuted: '#9AA8A2',
    border: '#2B3632',
    primary: '#4CC3AA',
    onPrimary: '#04201A',
    primarySoft: '#173A33',
    accent: '#F5B95A',
    onAccent: '#2A1B00',
    accentSoft: '#3A2C14',
    danger: '#F07A64',
    dangerSoft: '#3B1E19',
  },
} as const;

export type ColorMode = keyof typeof palette;
export type ColorName = keyof typeof palette.light;
export type Colors = Record<ColorName, string>;
