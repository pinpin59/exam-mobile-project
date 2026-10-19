import { Text, type TextProps } from 'react-native';

import { type, type TypeVariant } from '@/theme/typography';

type Props = TextProps & { variant?: TypeVariant; className?: string };

// Texte de base : la typo vient de theme/typography, la couleur d'une classe NativeWind
export function AppText({ variant = 'body', className = 'text-text', style, ...rest }: Props) {
  return <Text className={className} style={[type[variant], style]} {...rest} />;
}
