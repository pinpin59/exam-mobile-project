import AsyncStorage from '@react-native-async-storage/async-storage';
import { vars } from 'nativewind';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme, View } from 'react-native';

import { palette, type ColorMode, type Colors } from './colors';

const KEY = '@eventease/theme';

export type ThemePref = ColorMode | 'system';

type ThemeContextValue = {
  mode: ColorMode;
  pref: ThemePref;
  setPref: (pref: ThemePref) => void;
  colors: Colors;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// '#0D6E5F' -> '13 110 95' : format attendu par `rgb(var(--x) / <alpha-value>)`
const toRgbChannels = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

// Variables CSS lues par les classes NativeWind (voir tailwind.config.js)
const cssVars = Object.fromEntries(
  (Object.keys(palette) as ColorMode[]).map((mode) => [
    mode,
    vars(
      Object.fromEntries(
        Object.entries(palette[mode]).map(([k, v]) => [`--color-${k}`, toRgbChannels(v)]),
      ),
    ),
  ]),
) as Record<ColorMode, ReturnType<typeof vars>>;

const isPref = (v: string | null): v is ThemePref =>
  v === 'light' || v === 'dark' || v === 'system';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [pref, setPref] = useState<ThemePref>('system');

  // Relit la préférence enregistrée au démarrage
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (isPref(v)) setPref(v);
    });
  }, []);

  const changePref = (v: ThemePref) => {
    setPref(v);
    AsyncStorage.setItem(KEY, v);
  };

  const mode: ColorMode = pref === 'system' ? (system === 'dark' ? 'dark' : 'light') : pref;
  const value = { mode, pref, setPref: changePref, colors: palette[mode] };

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, cssVars[mode]]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit être utilisé dans un <ThemeProvider>');
  return ctx;
}
