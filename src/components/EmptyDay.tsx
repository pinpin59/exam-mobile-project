import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";

import { useTheme } from "@/theme/ThemeContext";

import { AppText } from "./AppText";

// Encadré en pointillés affiché quand un jour n'a aucun événement
export function EmptyDay({ message }: { message: string }) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center gap-md rounded-lg border border-border bg-surface p-lg"
      style={{ borderStyle: "dashed" }}
    >
      <Ionicons name="calendar-clear-outline" size={22} color={colors.textMuted} />
      <AppText variant="small" className="flex-1 text-textMuted">
        {message}
      </AppText>
    </View>
  );
}
