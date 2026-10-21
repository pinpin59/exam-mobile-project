import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { useLanguage } from "@/i18n";
import { useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/typography";
import type { EventItem } from "@/types";
import { dayNumber, formatTime, monthShort } from "@/utils/date";

import { AppText } from "./AppText";

const STUB_WIDTH = 60; // largeur du talon daté
const NOTCH = 16; // diamètre des encoches du billet

type IconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
  event: EventItem;
  joined?: boolean; // l'utilisateur participe → talon orangé + badge
  weather?: { icon: IconName; temp: number }; // optionnel
  distanceKm?: number; // optionnel, ex : 2.4
  showTime?: boolean; // talon : heure au lieu de la date (vue Calendrier)
  onPress?: () => void; // ouverture du détail
};

/**
 * Carte d'événement en forme de billet.
 * Les tailles précises (talon, encoches, polices) sont en style :
 * les valeurs entre crochets ne s'appliquent pas dans ce projet.
 */
export function EventCard({
  event,
  joined = false,
  weather,
  distanceKm,
  showTime = false,
  onPress,
}: Props) {
  const { t } = useTranslation();
  const language = useLanguage();
  const day = dayNumber(event.startsAt);
  const month = monthShort(event.startsAt, language);
  // showTime : le talon affiche l'heure au lieu de la date (le jour est déjà affiché au-dessus)
  const stubTop = showTime ? formatTime(event.startsAt) : day;
  const stubBottom = showTime ? "" : month;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${event.name}, ${day} ${month}`}
      // overflow-hidden : coupe les encoches en demi-cercles
      className="flex-row overflow-hidden rounded-lg border border-border bg-surface active:opacity-85"
      style={{ minHeight: 92 }}
    >
      <TicketStub top={stubTop} bottom={stubBottom} small={showTime} joined={joined} />
      <Perforation />

      <View className="flex-1 px-md" style={{ paddingVertical: 10, gap: 3 }}>
        <View className="flex-row items-center justify-between">
          <AppText
            className="text-primary"
            style={{ fontFamily: fonts.bold, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" }}
          >
            {t(`category.${event.category}`)}
          </AppText>
          {joined && <JoinedBadge />}
        </View>

        <AppText
          numberOfLines={2}
          style={{ fontFamily: fonts.displaySemi, fontSize: 16, lineHeight: 20 }}
        >
          {event.name}
        </AppText>

        <AppText variant="small" className="text-textMuted" numberOfLines={1}>
          {formatTime(event.startsAt)} · {event.location}
        </AppText>

        {(weather || distanceKm != null) && (
          <View className="mt-xs flex-row" style={{ gap: 6 }}>
            {weather && <InfoChip icon={weather.icon} label={`${weather.temp}°`} />}
            {distanceKm != null && (
              <InfoChip
                icon="location-outline"
                label={`${distanceKm.toFixed(1).replace(".", ",")} km`}
              />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

/* ---------- Sous-composants ---------- */

// Talon gauche : jour + mois
// top : jour ("30") ou heure ("9:00") ; bottom : mois ("OCT") ou vide
// small : texte plus petit pour l'heure, plus large que le jour
function TicketStub({
  top,
  bottom,
  small,
  joined,
}: {
  top: string;
  bottom: string;
  small: boolean;
  joined: boolean;
}) {
  return (
    <View
      className={`items-center justify-center ${joined ? "bg-accentSoft" : ""}`}
      style={{ width: STUB_WIDTH, paddingVertical: 10 }}
    >
      <AppText
        style={{
          fontFamily: fonts.display,
          fontSize: small ? 17 : 24,
          lineHeight: small ? 20 : 26,
          fontVariant: ["tabular-nums"],
        }}
      >
        {top}
      </AppText>
      {bottom !== "" && (
        <AppText
          className="text-textMuted"
          style={{ fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.2 }}
        >
          {bottom}
        </AppText>
      )}
    </View>
  );
}

// Ligne pointillée + 2 encoches (à moitié masquées par overflow-hidden)
function Perforation() {
  const notch = {
    position: "absolute" as const,
    left: STUB_WIDTH - NOTCH / 2 + 0.75,
    width: NOTCH,
    height: NOTCH,
    borderRadius: NOTCH / 2,
    borderWidth: 1,
  };

  return (
    <>
      <View
        className="justify-evenly"
        style={{ width: 1.5, paddingVertical: NOTCH / 2 + 2 }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <View key={i} className="bg-border" style={{ width: 1.5, height: 4, borderRadius: 1 }} />
        ))}
      </View>
      {/* Encoches : couleur du fond d'écran pour donner l'effet « trou » */}
      <View className="border-border bg-background" style={{ ...notch, top: -NOTCH / 2 - 1 }} />
      <View className="border-border bg-background" style={{ ...notch, bottom: -NOTCH / 2 - 1 }} />
    </>
  );
}

// Badge « Participé »
function JoinedBadge() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center rounded-pill bg-accent"
      style={{ gap: 3, paddingHorizontal: 8, paddingVertical: 2 }}
    >
      <Ionicons name="checkmark" size={11} color={colors.onAccent} />
      <AppText className="text-onAccent" style={{ fontFamily: fonts.bold, fontSize: 10.5 }}>
        {t("event.joinedBadge")}
      </AppText>
    </View>
  );
}

// Pastille d'info (météo, distance)
function InfoChip({ icon, label }: { icon: IconName; label: string }) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center gap-xs rounded-pill bg-surfaceAlt"
      style={{ paddingHorizontal: 8, paddingVertical: 3 }}
    >
      <Ionicons name={icon} size={12} color={colors.text} />
      <AppText style={{ fontFamily: fonts.medium, fontSize: 11 }}>{label}</AppText>
    </View>
  );
}
