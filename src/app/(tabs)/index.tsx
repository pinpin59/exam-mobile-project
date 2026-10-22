import { useLocation } from "@/contexts/LocationContext";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { EmptyDay } from "@/components/EmptyDay";
import { EventCard } from "@/components/EventCard";
import { Segmented } from "@/components/Segmented";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventsContext";
import { useEventsWeather } from "@/hooks/useEventsWeather";
import type { EventItem } from "@/types";
import { distanceKm } from "@/utils/distance";

export default function EventsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { events } = useEvents();
  const { position } = useLocation();
  const weatherById = useEventsWeather();

  // Onglet choisi : tous les événements, ou seulement les miens
  const [filter, setFilter] = useState<"all" | "mine">("all");

  // « Mes événements » = ceux auxquels je participe ou que j'ai créés
  const isMine = (e: EventItem) =>
    !!user && (e.participantIds.includes(user.id) || e.createdBy === user.id);

  const now = new Date();
  const upcomingEvents = events
    .filter((e) => new Date(e.startsAt) > now)
    .filter((e) => filter === "all" || isMine(e))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View className="flex-row items-center justify-between px-xl pt-xl">
        <AppText variant="display" className="text-text">
          {t("tabs.events")}
        </AppText>
        {user?.role === "volunteer" && (
          <Button
            icon="add"
            accessibilityLabel={t("event.create")}
            onPress={() => router.push("/event/create")}
          />
        )}
      </View>

      <View className="px-xl py-md pt-md">
        <Segmented
          options={[
            { value: "all", label: t("event.filter.all") },
            { value: "mine", label: t("event.filter.mine") },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </View>

      <ScrollView contentContainerClassName="gap-md p-xl">
        {upcomingEvents.length === 0 && (
          <EmptyDay message={t("event.filter.empty")} />
        )}
        {upcomingEvents.map((eventItem) => (
          <EventCard
            key={eventItem.id}
            distanceKm={position ? distanceKm(position, eventItem) : undefined}
            weather={weatherById[eventItem.id]}
            event={eventItem}
            joined={!!user && eventItem.participantIds.includes(user.id)}
            onPress={() =>
              router.push({
                pathname: "/event/[id]",
                params: { id: eventItem.id },
              })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
