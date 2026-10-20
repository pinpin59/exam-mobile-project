import { TextInput, View, type TextInputProps } from "react-native";

import { useTheme } from "@/theme/ThemeContext";
import { radius, type } from "@/theme/typography";

import { AppText } from "./AppText";

type Props = TextInputProps & {
  label: string;
  error?: string;
};

// Label + input + error msg
export function TextField({ label, error, style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <View className="gap-xs">
      <AppText variant="small" className="text-textMuted">
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={colors.textMuted}
        className={`border bg-surface px-lg py-md text-text ${
          error ? "border-danger" : "border-border focus:border-primary"
        }`}
        style={[type.body, style, { borderRadius: radius.md }]}
        {...rest}
      />
      {error && (
        <AppText variant="small" className="text-danger">
          {error}
        </AppText>
      )}
    </View>
  );
}
