import { Pressable, type PressableProps } from 'react-native';

import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'accent' | 'danger';

const variants: Record<Variant, { box: string; label: string }> = {
  primary: { box: 'bg-primary', label: 'text-onPrimary' },
  secondary: { box: 'bg-surfaceAlt', label: 'text-text' },
  accent: { box: 'bg-accent', label: 'text-onAccent' },
  danger: { box: 'bg-dangerSoft', label: 'text-danger' },
};

type Props = Omit<PressableProps, 'children'> & { label: string; variant?: Variant };

export function Button({ label, variant = 'primary', disabled, ...rest }: Props) {
  const v = variants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={`items-center justify-center rounded-pill px-xl py-md active:opacity-80 ${v.box} ${disabled ? 'opacity-50' : ''}`}
      {...rest}>
      <AppText variant="button" className={v.label}>
        {label}
      </AppText>
    </Pressable>
  );
}
