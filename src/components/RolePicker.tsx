import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import type { UserRole } from "@/types";

import { AppIcon } from "./AppIcon";
import { AppText } from "./AppText";

type Props = {
  value: UserRole;
  onChange: (role: UserRole) => void;
};

const roles: {
  value: UserRole;
  icon: ComponentProps<typeof Ionicons>["name"];
}[] = [
  { value: "user", icon: "person-outline" },
  { value: "volunteer", icon: "hand-left-outline" },
];

export function RolePicker({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View className="gap-xs">
      <AppText variant="small" className="text-textMuted">
        {t("auth.roleTitle")}
      </AppText>
      <View className="flex-row gap-md">
        {roles.map((role) => {
          const selected = role.value === value;
          return (
            <Pressable
              key={role.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(role.value)}
              className={`flex-1 gap-sm rounded-md border p-md ${
                selected
                  ? "border-primary bg-primarySoft"
                  : "border-border bg-surface"
              }`}
            >
              <AppIcon
                name={role.icon}
                color={selected ? "primary" : "textMuted"}
              />
              <AppText
                variant="heading"
                className={selected ? "text-primary" : "text-text"}
              >
                {t(`role.${role.value}`)}
              </AppText>
              <AppText variant="small" className="text-textMuted">
                {t(`role.${role.value}Hint`)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
