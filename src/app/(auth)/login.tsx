import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/components/AppIcon";
import { AppText } from "@/components/AppText";
import { AuthTabs } from "@/components/AuthTabs";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/theme/ThemeContext";
import { fonts, radius } from "@/theme/typography";
import type { Credentials } from "@/types";
import { validateLogin, type LoginErrors } from "@/utils/validation";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { login } = useAuth();

  const [form, setForm] = useState<Credentials>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Met à jour un champ et efface son erreur
  // update("email") renvoie la fonction à donner à onChangeText
  const update = (key: keyof Credentials) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setFormError(null);
  };

  const goToSignup = () => router.replace("/signup");

  const onSubmit = async () => {
    const found = validateLogin(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // erreurs de saisie : on n'appelle pas le service

    setIsSubmitting(true);
    try {
      await login(form);
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Remonte le contenu quand le clavier s'ouvre (iOS) */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center gap-lg p-xl"
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo + titre */}
          <AppIcon
            name="ticket-outline"
            size={26}
            color="onPrimary"
            background="primary"
            boxSize={56}
            radius={radius.lg}
          />
          <View className="gap-xs">
            <AppText variant="display">EventEase</AppText>
            <AppText variant="small" className="text-textMuted">
              {t("auth.appSubtitle")}
            </AppText>
          </View>

          <AuthTabs value="login" onChange={goToSignup} />

          {/* Error */}
          {formError && (
            <View className="flex-row items-center gap-sm rounded-md bg-dangerSoft p-md">
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={colors.danger}
              />
              <AppText variant="small" className="flex-1 text-danger">
                {formError}
              </AppText>
            </View>
          )}

          <TextField
            label={t("auth.email")}
            placeholder={t("auth.emailPlaceholder")}
            value={form.email}
            onChangeText={update("email")}
            error={errors.email && t(`auth.errors.${errors.email}`)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
          />
          <TextField
            label={t("auth.password")}
            placeholder={t("auth.passwordPlaceholder")}
            value={form.password}
            onChangeText={update("password")}
            error={errors.password && t(`auth.errors.${errors.password}`)}
            secureTextEntry
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />

          <Button
            label={isSubmitting ? "…" : t("auth.login")}
            disabled={isSubmitting}
            onPress={onSubmit}
          />

          <Pressable onPress={goToSignup} className="items-center py-xs">
            <AppText variant="small" className="text-textMuted">
              {t("auth.noAccountQuestion")}{" "}
              <AppText
                variant="small"
                className="text-primary"
                style={{ fontFamily: fonts.bold }}
              >
                {t("auth.createAccount")}
              </AppText>
            </AppText>
          </Pressable>

          <View className="flex-row items-center justify-center gap-xs">
            <Ionicons
              name="phone-portrait-outline"
              size={14}
              color={colors.textMuted}
            />
            <AppText
              variant="small"
              className="text-textMuted"
              style={{ fontSize: 12 }}
            >
              {t("auth.deviceNote")}
            </AppText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
