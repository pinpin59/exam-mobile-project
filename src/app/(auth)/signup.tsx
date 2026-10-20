import { AppIcon } from "@/components/AppIcon";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { RolePicker } from "@/components/RolePicker";
import { TextField } from "@/components/TextField";
import { useAuth } from "@/contexts/AuthContext";
import { radius } from "@/theme/typography";
import type { UserRole } from "@/types";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete = !!(firstName && lastName && email && password && role);

  // Comme pour le login : une fois inscrit, user est rempli et
  // le Stack.Protected affiche les onglets tout seul
  const onSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signUp({ firstName, lastName, email, password, role });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Formulaire long : sur iOS, le ScrollView gère lui-même le clavier
          (il fait défiler jusqu'au champ actif). Pas de "padding" ici,
          sinon l'espace du clavier serait ajouté deux fois */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={undefined}>
        <ScrollView
          contentContainerClassName="flex-grow justify-center gap-xl p-xl"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <AppIcon
            name="arrow-back"
            size={22}
            color="onPrimary"
            background="text"
            boxSize={44}
            radius={radius.md}
            onPress={() => router.replace("/login")}
            accessibilityLabel={t("auth.backToLogin")}
          />
          <AppText variant="display">{t("auth.signupTitle")}</AppText>

          <View className="gap-lg">
            <TextField
              label={t("auth.firstName")}
              value={firstName}
              onChangeText={setFirstName}
              autoComplete="given-name"
            />
            <TextField
              label={t("auth.lastName")}
              value={lastName}
              onChangeText={setLastName}
              autoComplete="family-name"
            />
            <TextField
              label={t("auth.email")}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />
            <TextField
              label={t("auth.password")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />
            <RolePicker value={role} onChange={setRole} />
            {error && <AppText className="text-danger">{error}</AppText>}
          </View>

          <Button
            label={isSubmitting ? "…" : t("auth.signup")}
            disabled={isSubmitting || !isComplete}
            onPress={onSubmit}
          />

          <Link href="/login" replace>
            <AppText className="text-primary">{t("auth.haveAccount")}</AppText>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
