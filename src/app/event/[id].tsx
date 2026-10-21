import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { HeroButton } from "@/components/HeroButton";
import { InfoTile } from "@/components/InfoTile";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventsContext";
import { useLocation } from "@/contexts/LocationContext";
import { useEventsWeather } from "@/hooks/useEventsWeather";
import { useLanguage } from "@/i18n";
import type { Weather } from "@/services/weather";
import { useTheme } from "@/theme/ThemeContext";
import { formatTime } from "@/utils/date";
import { distanceKm } from "@/utils/distance";

type WeatherKey =
  | "sunny"
  | "partlySunny"
  | "cloudy"
  | "snow"
  | "storm"
  | "rainy";

// Icône météo → clé de traduction du libellé (« Ensoleillé »…)
const weatherLabel: Partial<Record<Weather["icon"], WeatherKey>> = {
  "sunny-outline": "sunny",
  "partly-sunny-outline": "partlySunny",
  "cloudy-outline": "cloudy",
  "snow-outline": "snow",
  "thunderstorm-outline": "storm",
  "rainy-outline": "rainy",
};

// Couleurs des pastilles de participants (classes de la palette)
const dotColors = ["bg-primarySoft", "bg-accentSoft", "bg-surfaceAlt"];

// Écran de détail : /event/e3 → id = "e3"
export default function EventDetailScreen() {
  const { t } = useTranslation();
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const language = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, join, leave, deleteEvent } = useEvents();
  const { user } = useAuth();
  const { position } = useLocation();
  const weatherById = useEventsWeather();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <View className="flex-1 p-xl" style={{ paddingTop: insets.top }}>
        <AppText className="text-text">{t("event.notFound")}</AppText>
      </View>
    );
  }

  const joined = !!user && event.participantIds.includes(user.id);
  // Seul le créateur de l'événement peut le modifier ou le supprimer
  const isOwner = user?.id === event.createdBy;
  const weather = weatherById[event.id];
  const distance = position ? distanceKm(position, event) : null;
  const participants = event.participantIds.length;

  // "samedi 24 octobre" → "Samedi 24 octobre"
  const longDate = new Date(event.startsAt).toLocaleDateString(language, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const dateLabel = longDate.charAt(0).toUpperCase() + longDate.slice(1);

  const toggleJoin = async () => {
    setIsSubmitting(true);
    try {
      await (joined ? leave(event.id) : join(event.id));
    } finally {
      setIsSubmitting(false);
    }
  };

  // confirmation avant de supprimer
  const onToggleDelete = () => {
    Alert.alert(t("event.deleteTitle"), t("event.deleteMessage"), [
      { text: t("event.cancel"), style: "cancel" },
      {
        text: t("event.delete"),
        style: "destructive",
        onPress: async () => {
          router.back();
          try {
            await deleteEvent(event.id);
          } catch (e) {
            Alert.alert(t("event.deleteError"), (e as Error).message);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Barre d'état lisible sur le bandeau primary */}
      <StatusBar style={mode === "dark" ? "dark" : "light"} />

      <ScrollView
        contentContainerClassName="flex-grow gap-lg"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Bandeau : remonte sous la barre d'état (paddingTop = hauteur de l'encoche) */}
        <View
          className="gap-md bg-primary px-xl pb-xl"
          style={{ paddingTop: insets.top + 8 }}
        >
          <View className="flex-row items-center justify-between">
            <HeroButton
              icon="chevron-back"
              onPress={() => router.back()}
              accessibilityLabel={t("event.back")}
            />
            {isOwner && (
              <View className="flex-row gap-sm">
                <HeroButton
                  icon="pencil-outline"
                  onPress={() =>
                    router.push({
                      pathname: "/event/edit/[id]",
                      params: { id: event.id },
                    })
                  }
                />
                <HeroButton icon="trash-outline" onPress={onToggleDelete} />
              </View>
            )}
          </View>

          <AppText variant="caption" className="text-onPrimary opacity-85">
            {t(`category.${event.category}`)}
          </AppText>
          <AppText variant="title" className="text-onPrimary">
            {event.name}
          </AppText>

          <View className="gap-xs opacity-90">
            <View className="flex-row items-center gap-sm">
              <Ionicons
                name="time-outline"
                size={15}
                color={colors.onPrimary}
              />
              <AppText variant="small" className="text-onPrimary">
                {dateLabel} · {formatTime(event.startsAt)}
              </AppText>
            </View>
            <View className="flex-row items-center gap-sm">
              <Ionicons
                name="location-outline"
                size={15}
                color={colors.onPrimary}
              />
              <AppText variant="small" className="text-onPrimary">
                {event.location}
              </AppText>
            </View>
          </View>
        </View>

        {/* Tuiles météo / distance */}
        <View className="flex-row gap-md px-xl">
          <InfoTile
            label={t("event.weather")}
            icon={weather?.icon ?? "cloud-offline-outline"}
            iconColor="accent"
            value={weather ? `${weather.temp}°C` : "—"}
            hint={
              weather
                ? t(`weather.${weatherLabel[weather.icon] ?? "cloudy"}`)
                : t("weather.unavailable")
            }
          />
          <InfoTile
            label={t("event.distance")}
            icon="navigate-outline"
            iconColor="primary"
            value={
              distance != null
                ? `${distance.toFixed(1).replace(".", ",")} km`
                : "—"
            }
            hint={t("event.fromYou")}
          />
        </View>

        {/* Description */}
        <AppText className="px-xl text-text">{event.description}</AppText>

        {/* Participants : jusqu'à 3 pastilles */}
        <View className="flex-row items-center gap-sm px-xl">
          {participants > 0 && (
            <View className="flex-row">
              {dotColors.slice(0, participants).map((bg, i) => (
                <View
                  key={bg}
                  className={`h-7 w-7 rounded-pill border-2 border-background ${bg} ${i > 0 ? "-ml-2" : ""}`}
                />
              ))}
            </View>
          )}
          <AppText variant="small" className="text-textMuted">
            {t("event.participants", { count: participants })}
          </AppText>
        </View>

        {/* Bouton join */}
        <View className="mt-auto gap-sm px-xl">
          <Button
            label={joined ? t("event.joinedButton") : t("event.join")}
            icon={joined ? "checkmark" : "add"}
            variant={joined ? "accent" : "primary"}
            disabled={isSubmitting}
            onPress={toggleJoin}
          />
          {joined && (
            <AppText variant="small" className="text-center text-textMuted">
              {t("event.cancelHint")}
            </AppText>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
