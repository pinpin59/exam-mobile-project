import { Stack } from "expo-router";

import { useTheme } from "@/theme/ThemeContext";

// L'écran de connexion est le premier affiché dans ce groupe
export const unstable_settings = { initialRouteName: "login" };

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
