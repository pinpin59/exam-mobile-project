import { AppText } from "@/components/AppText";
import { Segmented } from "@/components/Segmented";
import { SettingsGroup } from "@/components/SettingsGroup";
import { SettingsRow } from "@/components/SettingsRow";
import { useAuth } from "@/contexts/AuthContext";
import { languages, setLanguage, useLanguage } from "@/i18n";
import { useTheme } from "@/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { mode, setPref, colors } = useTheme();
  const { logout } = useAuth();
  const language = useLanguage();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 gap-sm p-xl">
        <AppText variant="display" className="text-text mb-5">
          {t("tabs.profile")}
        </AppText>
        <SettingsGroup>
          <SettingsRow
            icon="moon-outline"
            label={t("settings.dark")}
            right={
              <Switch
                value={mode === "dark"}
                onValueChange={(on) => setPref(on ? "dark" : "light")}
                trackColor={{ true: colors.primary, false: colors.border }}
                ios_backgroundColor={colors.border}
              />
            }
          />
          <SettingsRow icon="log-out-outline" label="Localisation" />
          <SettingsRow
            icon="language-outline"
            label={t("settings.language")}
            right={
              <Segmented
                options={languages.map((l) => ({
                  value: l,
                  label: l.toUpperCase(),
                }))}
                value={language}
                onChange={setLanguage}
              />
            }
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingsRow
            icon="log-out-outline"
            label="Se déconnecter"
            danger
            onPress={logout}
          />
        </SettingsGroup>
      </View>
    </SafeAreaView>
  );
}
