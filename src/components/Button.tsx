import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Pressable, type PressableProps } from "react-native";

import type { ColorName } from "@/theme/colors";
import { useTheme } from "@/theme/ThemeContext";
import { radius } from "@/theme/typography";

import { AppText } from "./AppText";

type Variant = "primary" | "secondary" | "accent" | "danger";

// icon : couleur de la palette pour l'icône (les icônes n'acceptent pas className)
const variants: Record<
  Variant,
  { box: string; label: string; icon: ColorName }
> = {
  primary: { box: "bg-primary", label: "text-onPrimary", icon: "onPrimary" },
  secondary: { box: "bg-surfaceAlt", label: "text-text", icon: "text" },
  accent: { box: "bg-accent", label: "text-onAccent", icon: "onAccent" },
  danger: { box: "bg-dangerSoft", label: "text-danger", icon: "danger" },
};

type Props = Omit<PressableProps, "children"> & {
  label?: string;
  variant?: Variant;
  icon?: ComponentProps<typeof Ionicons>["name"]; // optionnel, affiché avant le texte
};

export function Button({
  label,
  variant = "primary",
  icon,
  disabled,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const v = variants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      // Sans label (icône seule) : bouton carré, padding égal sur les 4 côtés
      className={`flex-row items-center justify-center gap-sm active:opacity-80 ${label ? "px-xl py-lg" : "p-md"} ${v.box} ${disabled ? "opacity-50" : ""}`}
      style={{ borderRadius: radius.md }}
      {...rest}
    >
      {icon && <Ionicons name={icon} size={label ? 18 : 22} color={colors[v.icon]} />}
      {label && (
        <AppText variant="button" className={v.label}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}
