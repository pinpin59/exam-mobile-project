import { AppText } from "@/components/AppText";
import { Segmented } from "@/components/Segmented";
import { SettingsGroup } from "@/components/SettingsGroup";
import { SettingsRow } from "@/components/SettingsRow";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventsContext";
import { languages, setLanguage, useLanguage } from "@/i18n";
import { useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/typography";
import { useTranslation } from "react-i18next";
import { Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { mode, setPref, colors } = useTheme();
  const { user, logout } = useAuth();
  const { events } = useEvents();
  const language = useLanguage();

  const participations = user
    ? events.filter((e) => e.participantIds.includes(user.id)).length
    : 0;
  // À brancher quand EventItem aura un champ createdBy (l'organisateur)
  const created = 0;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 gap-lg p-xl">
        <AppText variant="display" className="text-text mb-5">
          {t("tabs.profile")}
        </AppText>
        {/* header */}
        {user && (
          <View className="items-center gap-xs pt-sm">
            <View
              className="mb-xs items-center justify-center bg-accentSoft"
              style={{ width: 72, height: 72, borderRadius: 36 }}
            >
              <AppText
                variant="display"
                className={mode === "dark" ? "text-accent" : "text-onAccent"}
                style={{ fontSize: 24, lineHeight: 30 }}
              >
                {getInitials(user.firstName, user.lastName)}
              </AppText>
            </View>
            <AppText variant="heading" style={{ fontSize: 19 }}>
              {user.firstName} {user.lastName}
            </AppText>
            <AppText variant="small" className="text-textMuted">
              {user.email}
            </AppText>
            <View className="mt-xs rounded-pill bg-primarySoft px-md py-xs">
              <AppText
                variant="small"
                className="text-primary"
                style={{ fontFamily: fonts.bold, fontSize: 12 }}
              >
                {t(`role.${user.role}`)}
              </AppText>
            </View>
          </View>
        )}

        {/* Statistiques */}
        <View className="flex-row gap-md">
          <StatTile
            label={t("profile.participations")}
            value={participations}
          />
          <StatTile label={t("profile.created")} value={created} />
        </View>
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

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-1 gap-xs rounded-lg border border-border bg-surface p-md">
      <AppText variant="caption" className="text-textMuted">
        {label}
      </AppText>
      <AppText
        variant="display"
        style={{ fontSize: 26, lineHeight: 32, fontVariant: ["tabular-nums"] }}
      >
        {value}
      </AppText>
    </View>
  );
}
