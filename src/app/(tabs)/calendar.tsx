import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";

export default function CalendarScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 gap-sm p-xl">
        <AppText variant="display">{t("tabs.calendar")}</AppText>
      </View>
    </SafeAreaView>
  );
}
