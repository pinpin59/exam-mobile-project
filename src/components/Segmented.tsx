import { Pressable, View } from 'react-native';

import { AppText } from './AppText';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

// Groupe de chips : une seule sélectionnée à la fois
export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View className="flex-row gap-sm">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(o.value)}
            className={`rounded-pill border px-lg py-sm ${selected ? 'border-primary bg-primarySoft' : 'border-border bg-surfaceAlt'}`}>
            <AppText variant="small" className={selected ? 'text-primary' : 'text-textMuted'}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
