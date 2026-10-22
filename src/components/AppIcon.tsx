import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Pressable } from "react-native";

import type { ColorName } from "@/theme/colors";
import { useTheme } from "@/theme/ThemeContext";

type Props = {
  name: ComponentProps<typeof Ionicons>["name"];
  size?: number;
  color?: ColorName;
  background?: ColorName;
  border?: ColorName;
  boxSize?: number;
  radius?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function AppIcon({
  name,
  size = 20,
  color = "text",
  background,
  border,
  boxSize = size * 2,
  radius = 12,
  onPress,
  accessibilityLabel,
}: Props) {
  const { colors } = useTheme();
  const icon = <Ionicons name={name} size={size} color={colors[color]} />;
  const hasBox = !!(background || border);

  // Icône seule et pas cliquable : rien à envelopper
  if (!hasBox && !onPress) return icon;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8} // agrandit la zone tactile autour des petites icônes
      className="items-center justify-center self-start active:opacity-70"
      style={
        hasBox
          ? {
              width: boxSize,
              height: boxSize,
              borderRadius: radius,
              backgroundColor: background ? colors[background] : undefined,
              borderWidth: border ? 1 : 0,
              borderColor: border ? colors[border] : undefined,
            }
          : undefined
      }
    >
      {icon}
    </Pressable>
  );
}
