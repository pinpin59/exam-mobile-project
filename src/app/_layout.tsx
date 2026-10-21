import "@/global.css";
import "@/i18n";

import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from "@expo-google-fonts/bricolage-grotesque";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { EventsProvider } from "@/contexts/EventsContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";

// Garde le splash screen tant que les polices et la session chargent
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!loaded && !error) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <EventsProvider>
          <RootStack />
        </EventsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootStack() {
  const { mode, colors } = useTheme();
  const { user, isLoading } = useAuth();

  // On cache le splash seulement quand on sait si l'utilisateur est connecté,
  // sinon l'écran de connexion clignoterait avant d'afficher les onglets
  useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) return null;

  return (
    // Partagé par les onglets ET le détail ; la position n'est demandée
    // qu'une fois connecté (enabled), pas dès l'écran de connexion
    <LocationProvider enabled={!!user}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* Connecté : accès aux onglets et au détail d'un événement */}
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
          {/* Hors des onglets : s'ouvre par-dessus, sans tab bar */}
          <Stack.Screen name="event/[id]" />
        </Stack.Protected>

        {/* Déconnecté : accès à login / signup uniquement.
            À la déconnexion, user devient null → renvoi automatique ici */}
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </LocationProvider>
  );
}
