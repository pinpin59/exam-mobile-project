import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Segmented } from '@/components/Segmented';
import { languages, setLanguage, type Language } from '@/i18n';
import { useTheme, type ThemePref } from '@/theme/ThemeContext';

// Écran de test : polices, couleurs NativeWind, thème clair/sombre et traductions
export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { pref, setPref } = useTheme();
  const [joined, setJoined] = useState(false);

  const themeOptions: { value: ThemePref; label: string }[] = [
    { value: 'light', label: t('settings.light') },
    { value: 'dark', label: t('settings.dark') },
    { value: 'system', label: t('settings.system') },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerClassName="gap-xl p-xl">
        <View className="gap-sm">
          <AppText variant="caption" className="text-primary">
            {t('home.eyebrow')}
          </AppText>
          <AppText variant="display">{t('home.title')}</AppText>
          <AppText className="text-textMuted">{t('home.subtitle')}</AppText>
        </View>

        <View
          className={`gap-lg rounded-lg border p-lg ${joined ? 'border-accent bg-accentSoft' : 'border-border bg-surface'}`}>
          <AppText variant="heading">{joined ? t('home.joined') : 'Meetup React Native'}</AppText>
          <Button
            label={joined ? t('home.cancel') : t('home.cta')}
            variant={joined ? 'danger' : 'primary'}
            onPress={() => setJoined((j) => !j)}
          />
        </View>

        <View className="gap-sm">
          <AppText variant="caption" className="text-textMuted">
            {t('settings.theme')}
          </AppText>
          <Segmented options={themeOptions} value={pref} onChange={setPref} />
        </View>

        <View className="gap-sm">
          <AppText variant="caption" className="text-textMuted">
            {t('settings.language')}
          </AppText>
          <Segmented
            options={languages.map((l) => ({ value: l, label: l.toUpperCase() }))}
            value={i18n.language as Language}
            onChange={setLanguage}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
