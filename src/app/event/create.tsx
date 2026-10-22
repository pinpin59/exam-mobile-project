import { useTranslation } from "react-i18next";

import { EventForm } from "@/components/EventForm";
import { useEvents } from "@/contexts/EventsContext";

export default function CreateEventScreen() {
  const { t } = useTranslation();
  const { createEvent } = useEvents();

  return (
    <EventForm
      title={t("event.create")}
      submitLabel={t("event.form.submitCreate")}
      onSubmit={createEvent}
    />
  );
}
