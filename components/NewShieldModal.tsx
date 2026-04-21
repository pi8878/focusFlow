import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { APP_OPTIONS } from "@/constants";
import { AppName, DayOfWeek, Shield } from "@/types";

interface NewShieldModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateShield: (shield: Shield) => void;
}

const ALL_DAYS: DayOfWeek[] = [
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
];

// Convert a Date object to "HH:MM" 24hr string
const toTimeString = (date: Date): string => {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};

// Convert a Date object to "hh:MM AM/PM" display string
const toDisplayTime = (date: Date): string => {
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

// Default start: 9:00 AM
const defaultStart = (): Date => {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  return d;
};

// Default end: 5:00 PM
const defaultEnd = (): Date => {
  const d = new Date();
  d.setHours(17, 0, 0, 0);
  return d;
};

// Validate that end time is after start time and they are not equal
const validateTimes = (start: Date, end: Date): string | null => {
  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();

  if (startMinutes === endMinutes) {
    return "Start time and end time cannot be the same.";
  }

  if (endMinutes <= startMinutes) {
    return `End time (${toDisplayTime(end)}) must be after start time (${toDisplayTime(start)}). Overnight schedules are not supported — please use two separate shields instead.`;
  }

  return null;
};

export default function NewShieldModal({
  visible,
  onClose,
  onCreateShield,
}: NewShieldModalProps) {
  const [selectedApp, setSelectedApp] = useState<AppName>("Instagram");
  const [startTime, setStartTime] = useState<Date>(defaultStart());
  const [endTime, setEndTime] = useState<Date>(defaultEnd());
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([
    "Mon", "Tue", "Wed", "Thu", "Fri",
  ]);

  // Controls which picker is showing
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleStartChange = (
    event: DateTimePickerEvent,
    selected?: Date
  ) => {
    // On Android the picker closes itself after selection
    if (Platform.OS === "android") setShowStartPicker(false);
    if (selected) setStartTime(selected);
  };

  const handleEndChange = (
    event: DateTimePickerEvent,
    selected?: Date
  ) => {
    if (Platform.OS === "android") setShowEndPicker(false);
    if (selected) setEndTime(selected);
  };

  const handleCreate = () => {
    if (selectedDays.length === 0) {
      Alert.alert("Select Days", "Please select at least one active day.");
      return;
    }

    const validationError = validateTimes(startTime, endTime);
    if (validationError) {
      Alert.alert("Invalid Time Range", validationError);
      return;
    }

    const newShield: Shield = {
      id: Date.now().toString(),
      appName: selectedApp,
      startTime: toTimeString(startTime),
      endTime: toTimeString(endTime),
      days: selectedDays,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    onCreateShield(newShield);
    handleClose();
  };

  const handleClose = () => {
    setSelectedApp("Instagram");
    setStartTime(defaultStart());
    setEndTime(defaultEnd());
    setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    setShowStartPicker(false);
    setShowEndPicker(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
        {/* Tap backdrop to close */}
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={handleClose}
        />

        {/* Modal card */}
        <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">

          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-gray-900">
              New Shield
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Target App */}
          <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">
            TARGET APP
          </Text>

          {/* App grid — scrollable horizontally to fit 8 apps */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-5"
          >
            <View className="flex-row gap-3">
              {APP_OPTIONS.map((app) => {
                const isSelected = selectedApp === app.name;
                return (
                  <TouchableOpacity
                    key={app.name}
                    onPress={() => setSelectedApp(app.name)}
                    className={`items-center justify-center rounded-2xl p-3 w-20 h-20 ${
                      isSelected
                        ? "border-2 border-green-400 bg-green-50"
                        : "border border-gray-200"
                    }`}
                  >
                    <View
                      className="w-9 h-9 rounded-xl items-center justify-center mb-1"
                      style={{ backgroundColor: app.color }}
                    >
                      <Ionicons
                        name="lock-closed"
                        size={16}
                        color={app.iconColor}
                      />
                    </View>
                    <Text
                      className="text-xs text-gray-700 font-medium text-center"
                      numberOfLines={1}
                    >
                      {app.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Time pickers */}
          <View className="flex-row gap-4 mb-5">

            {/* Start time */}
            <View className="flex-1">
              <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2">
                START TIME
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowEndPicker(false);
                  setShowStartPicker(true);
                }}
                className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3"
              >
                <Text className="flex-1 text-gray-800 text-base">
                  {toDisplayTime(startTime)}
                </Text>
                <Ionicons name="time-outline" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* End time */}
            <View className="flex-1">
              <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2">
                END TIME
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowStartPicker(false);
                  setShowEndPicker(true);
                }}
                className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3"
              >
                <Text className="flex-1 text-gray-800 text-base">
                  {toDisplayTime(endTime)}
                </Text>
                <Ionicons name="time-outline" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Inline time pickers — appear below buttons when tapped */}
          {showStartPicker && (
            <View className="mb-4 items-center">
              <DateTimePicker
                value={startTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleStartChange}
                is24Hour={false}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  onPress={() => setShowStartPicker(false)}
                  className="mt-2 bg-green-500 px-6 py-2 rounded-xl"
                >
                  <Text className="text-white font-semibold">Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {showEndPicker && (
            <View className="mb-4 items-center">
              <DateTimePicker
                value={endTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleEndChange}
                is24Hour={false}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  onPress={() => setShowEndPicker(false)}
                  className="mt-2 bg-green-500 px-6 py-2 rounded-xl"
                >
                  <Text className="text-white font-semibold">Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Active days */}
          <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">
            ACTIVE DAYS
          </Text>
          <View className="flex-row justify-between mb-7">
            {ALL_DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    isSelected ? "bg-gray-900" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isSelected ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {day.charAt(0)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Create button */}
          <TouchableOpacity
            onPress={handleCreate}
            className="bg-green-500 rounded-2xl py-4 items-center"
          >
            <Text className="text-white font-bold text-base">
              Create Shield
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}