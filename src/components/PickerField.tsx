import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";

import { useTheme } from "@/theme/ThemeContext";
import { radius } from "@/theme/typography";

import { AppText } from "./AppText";

type Props = {
  label: string;
  value: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  active?: boolean; // sélecteur ouvert : bordure en couleur
  error?: string;
  onPress: () => void;
};

// Ressemble à un TextField, mais on ne tape rien : un appui ouvre un sélecteur
export function PickerField({
  label,
  value,
  icon,
  active,
  error,
  onPress,
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="gap-xs">
      <AppText variant="small" className="text-textMuted">
        {label}
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label} : ${value}`}
        onPress={onPress}
        className={`flex-row items-center gap-sm border bg-surface px-lg py-md active:opacity-70 ${
          error ? "border-danger" : active ? "border-primary" : "border-border"
        }`}
        style={{ borderRadius: radius.md }}
      >
        <Ionicons name={icon} size={18} color={colors.textMuted} />
        <AppText className="text-text">{value}</AppText>
      </Pressable>
      {error && (
        <AppText variant="small" className="text-danger">
          {error}
        </AppText>
      )}
    </View>
  );
}
