import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, View } from "react-native";

import { useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/typography";

import { AppText } from "./AppText";

type Props = {
  icon: ComponentProps<typeof Ionicons>["name"]; // nom d'icône Ionicons, ex : "moon-outline"
  label: string;
  right?: ReactNode; // élément affiché à droite (Switch, chevron, valeur…)
  onPress?: () => void;
  danger?: boolean;
};

/**
 * Ligne de réglage : icône + libellé + élément optionnel à droite.
 * danger : affiche la ligne en rouge (déconnexion).
 * Sans onPress, la ligne n'est pas cliquable (ex. ligne avec un Switch).
 */
export function SettingsRow({
  icon,
  label,
  right,
  onPress,
  danger = false,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      // min-h-[44px] : zone tactile minimale recommandée
      className="min-h-[44px] flex-row items-center gap-md px-md py-md active:bg-surfaceAlt"
    >
      <View className="h-[40px] w-[40px] items-center justify-center rounded-sm bg-surfaceAlt">
        {/* Les icônes n'acceptent pas className : couleur passée via useTheme */}
        <Ionicons
          name={icon}
          size={24}
          color={danger ? colors.danger : colors.text}
        />
      </View>
      <AppText
        className={`flex-1 ${danger ? "text-danger" : "text-text"}`}
        style={danger ? { fontFamily: fonts.bold } : undefined}
      >
        {label}
      </AppText>
      {right}
    </Pressable>
  );
}
