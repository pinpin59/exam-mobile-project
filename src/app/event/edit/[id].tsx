import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { EventForm } from "@/components/EventForm";
import { useEvents } from "@/contexts/EventsContext";

// Même formulaire que la création, pré-rempli avec l'événement
export default function EditEventScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, updateEvent } = useEvents();

  const event = events.find((e) => e.id === id);
  if (!event) return null;

  return (
    <EventForm
      title={t("event.edit")}
      submitLabel={t("event.form.submitEdit")}
      initial={event}
      onSubmit={(data) => updateEvent(event.id, data)}
    />
  );
}
