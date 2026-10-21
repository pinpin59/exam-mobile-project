import { useLocation } from "@/contexts/LocationContext";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";
import { EventCard } from "@/components/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventsContext";
import { useEventsWeather } from "@/hooks/useEventsWeather";
import { distanceKm } from "@/utils/distance";

export default function EventsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { events } = useEvents();
  const { position } = useLocation();
  const weatherById = useEventsWeather();

  const now = new Date();
  const upcomingEvents = events
    .filter((e) => new Date(e.startsAt) > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <AppText variant="display" className="px-xl text-text pt-xl">
        {t("tabs.events")}
      </AppText>
      <ScrollView contentContainerClassName="gap-md p-xl">
        {upcomingEvents.map((eventItem) => (
          <EventCard
            key={eventItem.id}
            distanceKm={position ? distanceKm(position, eventItem) : undefined}
            weather={weatherById[eventItem.id]}
            event={eventItem}
            joined={!!user && eventItem.participantIds.includes(user.id)}
            onPress={() =>
              router.push({ pathname: "/event/[id]", params: { id: eventItem.id } })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
