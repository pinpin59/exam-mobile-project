import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/typography";

// sf = icône iOS (SF Symbols), md = icône Android (Material Symbols)
export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  // Fond des écrans : sans ça, chaque onglet a un fond blanc natif, même en mode sombre
  const contentStyle = { backgroundColor: colors.background };

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      tintColor={colors.primary}
      iconColor={{ default: colors.textMuted, selected: colors.primary }}
      indicatorColor={colors.primarySoft}
      labelStyle={{
        default: { color: colors.textMuted, fontFamily: fonts.medium },
        selected: { color: colors.primary, fontFamily: fonts.medium },
      }}
    >
      <NativeTabs.Trigger name="index" contentStyle={contentStyle}>
        <NativeTabs.Trigger.Icon sf="ticket" md="confirmation_number" />
        <NativeTabs.Trigger.Label>{t("tabs.events")}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendar" contentStyle={contentStyle}>
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
        <NativeTabs.Trigger.Label>
          {t("tabs.calendar")}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile" contentStyle={contentStyle}>
        <NativeTabs.Trigger.Icon sf="person" md="person" />
        <NativeTabs.Trigger.Label>{t("tabs.profile")}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
