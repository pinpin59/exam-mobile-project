import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { AppText } from "./AppText";

type AuthTab = "login" | "signup";

type Props = {
  value: AuthTab;
  onChange: (tab: AuthTab) => void;
};

// Onglets Connexion / Inscription en haut des écrans d'authentification
export function AuthTabs({ value, onChange }: Props) {
  const { t } = useTranslation();
  const tabs: { key: AuthTab; label: string }[] = [
    { key: "login", label: t("auth.tabLogin") },
    { key: "signup", label: t("auth.tabSignup") },
  ];

  return (
    <View className="flex-row rounded-md bg-surfaceAlt p-xs">
      {tabs.map((tab) => {
        const selected = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => !selected && onChange(tab.key)}
            className={`flex-1 items-center rounded-sm py-md ${selected ? "bg-surface" : ""}`}
          >
            <AppText
              variant="button"
              className={selected ? "text-text" : "text-textMuted"}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
