import DatePicker from "@expo/ui/community/datetime-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocation, type Coordinates } from "@/contexts/LocationContext";
import { useTheme } from "@/theme/ThemeContext";
import { radius } from "@/theme/typography";
import type { EventCategory, EventInput, EventItem } from "@/types";
import { formatDate, formatTime, toLocalIso } from "@/utils/date";

import { AppIcon } from "./AppIcon";
import { AppText } from "./AppText";
import { Button } from "./Button";
import { PickerField } from "./PickerField";
import { TextField } from "./TextField";

type Props = {
  title: string;
  submitLabel: string;
  initial?: EventItem; // rempli = modification, vide = création
  onSubmit: (data: EventInput) => Promise<void>;
};

type Errors = Partial<Record<"name" | "date" | "location", string>>;

const categories: EventCategory[] = ["conference", "workshop", "outing"];

// Création : par défaut demain à 18:00
const tomorrowEvening = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(18, 0, 0, 0);
  return d;
};

// Formulaire partagé par les écrans « Créer » et « Modifier »
export function EventForm({ title, submitLabel, initial, onSubmit }: Props) {
  const { t, i18n } = useTranslation();
  const { colors, mode } = useTheme();
  const { position, requestPosition } = useLocation();

  // Valeurs de départ : celles de l'événement à modifier, sinon vide
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  // Date ET heure dans un seul objet Date
  const [startsAt, setStartsAt] = useState(
    initial ? new Date(initial.startsAt) : tomorrowEvening(),
  );
  const [picker, setPicker] = useState<"date" | "time" | null>(null); // sélecteur ouvert
  const [location, setLocation] = useState(initial?.location ?? "");
  const [coords, setCoords] = useState<Coordinates | null>(
    initial
      ? { latitude: initial.latitude, longitude: initial.longitude }
      : null,
  );
  const [category, setCategory] = useState<EventCategory>(
    initial?.category ?? "conference",
  );
  const [errors, setErrors] = useState<Errors>({});
  const [isSaving, setIsSaving] = useState(false);

  // Le lieu tapé à la main n'a plus de coordonnées : on les cherchera à l'envoi
  const onChangeLocation = (text: string) => {
    setLocation(text);
    setCoords(null);
  };

  const useMyPosition = async () => {
    // Pas encore de position (refusée au démarrage…) : on redemande l'autorisation
    const current = position ?? (await requestPosition());
    if (!current) {
      // Après un refus, iOS ne redemande plus : seul le menu Réglages peut l'activer
      Alert.alert(
        t("event.form.locationDeniedTitle"),
        t("event.form.locationDeniedMessage"),
        [
          { text: t("event.cancel"), style: "cancel" },
          {
            text: t("event.form.openSettings"),
            onPress: () => Linking.openSettings(),
          },
        ],
      );
      return;
    }

    setCoords(current);
    try {
      const [place] = await Location.reverseGeocodeAsync(current);
      if (place) {
        setLocation(
          [place.streetNumber, place.street, place.city]
            .filter(Boolean)
            .join(" "),
        );
      }
    } catch {
      // pas de nom trouvé : les coordonnées suffisent, l'utilisateur tape le nom
    }
  };

  // Le sélecteur de date ne change que le jour, celui d'heure que l'heure
  const onPick = (picked: Date) => {
    const next = new Date(startsAt);
    if (picker === "date") {
      next.setFullYear(
        picked.getFullYear(),
        picked.getMonth(),
        picked.getDate(),
      );
    } else {
      next.setHours(picked.getHours(), picked.getMinutes());
    }
    setStartsAt(next);
    // Android : la fenêtre se ferme après un choix.
    // iOS : la modal reste ouverte, on ferme avec OK
    if (Platform.OS === "android") setPicker(null);
  };

  // Appui sur Date ou Heure : ouvre ce sélecteur, ou le ferme s'il l'était déjà
  const togglePicker = (which: "date" | "time") =>
    setPicker((current) => (current === which ? null : which));

  const onSave = async () => {
    setPicker(null);

    const newErrors: Errors = {};
    if (!name.trim()) newErrors.name = t("event.form.errors.required");
    if (startsAt < new Date()) newErrors.date = t("event.form.errors.past");
    if (!location.trim()) newErrors.location = t("event.form.errors.required");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);
    try {
      // Lieu tapé à la main : on cherche ses coordonnées (pour la distance et la météo)
      let place = coords;
      if (!place) {
        const [found] = await Location.geocodeAsync(location);
        if (!found) {
          setErrors({ location: t("event.form.errors.placeNotFound") });
          return;
        }
        place = { latitude: found.latitude, longitude: found.longitude };
      }

      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        startsAt: toLocalIso(startsAt),
        location: location.trim(),
        category,
        ...place,
      });
      router.back(); // ferme la modal
    } catch (e) {
      Alert.alert(t("event.form.saveError"), (e as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  // Le sélecteur natif (null si fermé), affiché différemment selon la plateforme
  const pickerElement = picker && (
    <DatePicker
      value={startsAt}
      mode={picker}
      display={
        Platform.OS === "ios"
          ? picker === "date"
            ? "inline"
            : "spinner"
          : "default"
      }
      minimumDate={picker === "date" ? new Date() : undefined}
      is24Hour
      locale={i18n.language === "fr" ? "fr_FR" : "en_US"}
      themeVariant={mode}
      accentColor={colors.primary}
      onValueChange={(_event, picked) => onPick(picked)}
      onDismiss={() => setPicker(null)}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* iOS : le sélecteur dans une carte au milieu de l'écran, fond assombri.
          Un appui sur le fond ou sur OK ferme */}
      <Modal
        visible={Platform.OS === "ios" && picker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPicker(null)}
      >
        <Pressable
          onPress={() => setPicker(null)}
          // Pas de items-center : la carte s'étire sur toute la largeur
          className="flex-1 justify-center bg-black/40 p-xl"
        >
          {/* Pressable vide : un appui dans la carte ne ferme pas la modal */}
          <Pressable
            className="gap-md bg-surface p-lg"
            style={{ width: "100%", borderRadius: radius.xl }}
          >
            {/* Le sélecteur iOS est dessiné en SwiftUI : React Native ne connaît pas
                sa taille (il annonce 0), on la donne nous-mêmes */}
            <View
              style={{ width: "100%", height: picker === "date" ? 360 : 220 }}
            >
              {pickerElement}
            </View>
            <Button
              label={t("event.form.done")}
              onPress={() => setPicker(null)}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <View className="flex-row items-center justify-between px-xl pt-xl">
        <AppText variant="title" className="text-text">
          {title}
        </AppText>
        <AppIcon
          name="close"
          background="surface"
          border="border"
          boxSize={36}
          onPress={() => router.back()}
          accessibilityLabel={t("event.form.close")}
        />
      </View>

      <ScrollView
        contentContainerClassName="gap-md p-xl"
        keyboardShouldPersistTaps="handled" // un tap sur un bouton marche même clavier ouvert
        automaticallyAdjustKeyboardInsets // iOS : le clavier ne cache pas les champs du bas
      >
        <TextField
          label={t("event.form.name")}
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <TextField
          label={t("event.form.description")}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          style={{ minHeight: 80 }}
        />

        {/* Date et heure côte à côte, chacune prend la moitié */}
        <View className="flex-row gap-md">
          <View className="flex-1">
            <PickerField
              label={t("event.form.date")}
              icon="calendar-outline"
              value={formatDate(startsAt)}
              active={picker === "date"}
              error={errors.date}
              onPress={() => togglePicker("date")}
            />
          </View>
          <View className="flex-1">
            <PickerField
              label={t("event.form.time")}
              icon="time-outline"
              value={formatTime(startsAt)}
              active={picker === "time"}
              onPress={() => togglePicker("time")}
            />
          </View>
        </View>

        {/* Android : le sélecteur s'ouvre tout seul dans une fenêtre centrée */}
        {Platform.OS === "android" && pickerElement}

        <View className="gap-sm">
          <TextField
            label={t("event.form.location")}
            value={location}
            onChangeText={onChangeLocation}
            error={errors.location}
          />

          <Pressable
            onPress={useMyPosition}
            className="flex-row items-center gap-xs self-start active:opacity-70"
          >
            <AppIcon name="navigate-outline" size={14} color="primary" />
            <AppText variant="small" className="text-primary">
              {t("event.form.useMyPosition")}
            </AppText>
          </Pressable>
        </View>

        <View className="gap-xs">
          <AppText variant="small" className="text-textMuted">
            {t("event.form.category")}
          </AppText>
          <View className="flex-row flex-wrap gap-sm">
            {categories.map((c) => {
              const selected = c === category;
              return (
                <Pressable
                  key={c}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => setCategory(c)}
                  className={`flex-row items-center gap-xs rounded-pill border px-md py-xs ${
                    selected
                      ? "border-primary bg-primarySoft"
                      : "border-transparent bg-surfaceAlt"
                  }`}
                >
                  {selected && (
                    <AppIcon name="checkmark" size={14} color="primary" />
                  )}
                  <AppText
                    variant="small"
                    className={selected ? "text-primary" : "text-text"}
                  >
                    {t(`category.${c}`)}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bouton collé en bas, hors du scroll */}
      <View className="px-xl pb-md">
        <Button label={submitLabel} onPress={onSave} disabled={isSaving} />
      </View>
    </SafeAreaView>
  );
}
