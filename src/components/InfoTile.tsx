import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { View } from "react-native";

import type { ColorName } from "@/theme/colors";
import { useTheme } from "@/theme/ThemeContext";

import { AppText } from "./AppText";

type Props = {
  label: string; // « MÉTÉO »
  icon: ComponentProps<typeof Ionicons>["name"];
  iconColor?: ColorName; // couleur de la palette
  value: string; // « 16°C »
  hint?: string; // « Ensoleillé »
};

// Tuile d'information : libellé, icône + grande valeur, petit texte
export function InfoTile({ label, icon, iconColor = "primary", value, hint }: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 gap-xs rounded-lg border border-border bg-surface px-md py-md">
      <AppText variant="caption" className="text-textMuted">
        {label}
      </AppText>
      <View className="flex-row items-center gap-sm">
        <Ionicons name={icon} size={20} color={colors[iconColor]} />
        <AppText variant="title" className="text-text">
          {value}
        </AppText>
      </View>
      {hint && (
        <AppText variant="small" className="text-textMuted">
          {hint}
        </AppText>
      )}
    </View>
  );
}
