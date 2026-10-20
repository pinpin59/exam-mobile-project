import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";

export default function ProfileScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 gap-sm p-xl">
        <AppText variant="display" className="text-text">
          {t("tabs.profile")}
        </AppText>
      </View>
    </SafeAreaView>
  );
}
