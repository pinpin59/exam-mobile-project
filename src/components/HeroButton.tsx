import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Pressable } from "react-native";

import { useTheme } from "@/theme/ThemeContext";

type Props = {
  icon: ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
  accessibilityLabel?: string;
};

// Bouton carré semi-transparent, posé sur un fond primary (bandeau du détail).
// bg-onPrimary/15 : la couleur onPrimary à 15 % d'opacité → s'adapte au thème
// (blanc translucide en clair, vert très foncé translucide en sombre)
export function HeroButton({ icon, onPress, accessibilityLabel }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      className="h-10 w-10 items-center justify-center rounded-md bg-onPrimary/15 active:opacity-70"
    >
      <Ionicons name={icon} size={18} color={colors.onPrimary} />
    </Pressable>
  );
}
