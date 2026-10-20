import { Children, Fragment, type ReactNode } from "react";
import { View } from "react-native";

export function SettingsGroup({ children }: { children: ReactNode }) {
  const rows = Children.toArray(children);
  return (
    <View className="overflow-hidden rounded-lg border border-border bg-surface">
      {rows.map((row, i) => (
        <Fragment key={i}>
          {i > 0 && <View className="h-px bg-border" />}
          {row}
        </Fragment>
      ))}
    </View>
  );
}
