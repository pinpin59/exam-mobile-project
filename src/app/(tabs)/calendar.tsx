import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";
import { EmptyDay } from "@/components/EmptyDay";
import { EventCard } from "@/components/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventsContext";
import i18n, { useLanguage } from "@/i18n";
import { useTheme } from "@/theme/ThemeContext";
import { fonts, radius } from "@/theme/typography";
import { dateKey } from "@/utils/date";

/* ---------- Noms des mois et des jours du calendrier ---------- */
LocaleConfig.locales.fr = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avr.",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["D", "L", "M", "M", "J", "V", "S"],
  today: "Aujourd'hui",
};
LocaleConfig.locales.en = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["S", "M", "T", "W", "T", "F", "S"],
  today: "Today",
};

LocaleConfig.defaultLocale = i18n.language;
i18n.on("languageChanged", (lng) => {
  LocaleConfig.defaultLocale = lng;
});

export default function CalendarScreen() {
  const { t } = useTranslation();
  const { colors, mode } = useTheme();
  const language = useLanguage();
  const { user } = useAuth();
  const { events } = useEvents();

  const [selected, setSelected] = useState(dateKey(new Date()));

  // Point sous chaque jour qui a au moins un événement + jour sélectionné
  const markedDates: Record<string, { marked?: boolean; selected?: boolean }> =
    {};
  for (const e of events) markedDates[dateKey(e.startsAt)] = { marked: true };
  markedDates[selected] = { ...markedDates[selected], selected: true };

  // Événements du jour sélectionné, triés par heure
  const dayEvents = events
    .filter((e) => dateKey(e.startsAt) === selected)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  const calendarTheme = {
    calendarBackground: colors.surface,
    monthTextColor: colors.text,
    textMonthFontFamily: fonts.displaySemi,
    textMonthFontSize: 17,
    arrowColor: colors.text,
    textSectionTitleColor: colors.textMuted,
    textDayHeaderFontFamily: fonts.bold,
    textDayHeaderFontSize: 11,
    dayTextColor: colors.text,
    textDayFontFamily: fonts.regular,
    textDayFontSize: 14,
    textDisabledColor: colors.border,
    todayTextColor: colors.primary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: colors.onPrimary,
    dotColor: colors.accent,
    selectedDotColor: colors.onPrimary,
    // Contour autour d'aujourd'hui
    "stylesheet.day.basic": {
      today: {
        borderWidth: 1.5,
        borderColor: colors.primary,
        borderRadius: radius.sm,
      },
      selected: { backgroundColor: colors.primary, borderRadius: radius.sm },
    },
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <ScrollView contentContainerClassName="gap-md p-xl">
        <AppText variant="display" className="text-text">
          {t("tabs.calendar")}
        </AppText>

        <View className="overflow-hidden rounded-lg border border-border bg-surface py-xs">
          <Calendar
            // key : force le calendrier à se redessiner quand le thème ou la langue change
            key={`${mode}-${language}`}
            current={selected}
            firstDay={1} // semaine qui commence le lundi
            markedDates={markedDates}
            onDayPress={(day) => setSelected(day.dateString)}
            theme={calendarTheme}
            enableSwipeMonths
            renderArrow={(direction) => (
              <Ionicons
                name={direction === "left" ? "chevron-back" : "chevron-forward"}
                size={20}
                color={colors.text}
              />
            )}
          />
        </View>

        {/* Événements du jour choisi */}
        <AppText variant="caption" className="mt-sm text-textMuted"></AppText>

        {dayEvents.length > 0 ? (
          dayEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              showTime
              joined={!!user && event.participantIds.includes(user.id)}
              onPress={() =>
                router.push({
                  pathname: "/event/[id]",
                  params: { id: event.id },
                })
              }
            />
          ))
        ) : (
          <EmptyDay message={t("calendar.empty")} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
