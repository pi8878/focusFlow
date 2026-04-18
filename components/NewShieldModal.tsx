import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { APP_OPTIONS } from "@/constants";
import { AppName, DayOfWeek, Shield } from "@/types";

interface NewShieldModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateShield: (shield: Shield) => void;
}

const ALL_DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function NewShieldModal({
  visible,
  onClose,
  onCreateShield,
}: NewShieldModalProps) {
  const [selectedApp, setSelectedApp] = useState<AppName>("Instagram");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("05:00 PM");
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([
    "Mon", "Tue", "Wed", "Thu", "Fri",
  ]);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleCreate = () => {
    if (selectedDays.length === 0) {
      Alert.alert("Select Days", "Please select at least one day.");
      return;
    }

    const newShield: Shield = {
      id: Date.now().toString(),
      appName: selectedApp,
      startTime: startTime,
      endTime: endTime,
      days: selectedDays,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    onCreateShield(newShield);
    handleClose();
  };

  const handleClose = () => {
    // Reset form back to defaults when closed
    setSelectedApp("Instagram");
    setStartTime("09:00 AM");
    setEndTime("05:00 PM");
    setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    onClose();
  };

  const selectedAppOption = APP_OPTIONS.find((a) => a.name === selectedApp);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        className="flex-1 bg-black/40"
        activeOpacity={1}
        onPress={handleClose}
      />

      {/* Modal card */}
      <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10 absolute bottom-0 left-0 right-0">

        {/* Modal header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-gray-900">New Shield</Text>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Target App label */}
        <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">
          TARGET APP
        </Text>

        {/* App grid */}
        <View className="flex-row flex-wrap gap-3 mb-5">
          {APP_OPTIONS.map((app) => {
            const isSelected = selectedApp === app.name;
            return (
              <TouchableOpacity
                key={app.name}
                onPress={() => setSelectedApp(app.name)}
                className={`items-center justify-center rounded-2xl p-3 w-24 h-24 ${
                  isSelected ? "border-2 border-green-400 bg-green-50" : "border border-gray-200"
                }`}
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mb-1"
                  style={{ backgroundColor: app.color }}
                >
                  <Ionicons name="lock-closed" size={18} color={app.iconColor} />
                </View>
                <Text className="text-xs text-gray-700 font-medium text-center">
                  {app.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected app name input (read-only display) */}
        <View className="bg-gray-100 rounded-xl px-4 py-3 mb-5">
          <Text className="text-gray-800 text-base">{selectedApp}</Text>
        </View>

        {/* Time row */}
        <View className="flex-row gap-4 mb-5">
          <View className="flex-1">
            <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2">
              START TIME
            </Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
              <TextInput
                value={startTime}
                onChangeText={setStartTime}
                className="flex-1 text-gray-800 text-base"
                placeholder="09:00 AM"
                placeholderTextColor="#9ca3af"
              />
              <Ionicons name="time-outline" size={16} color="#9ca3af" />
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2">
              END TIME
            </Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
              <TextInput
                value={endTime}
                onChangeText={setEndTime}
                className="flex-1 text-gray-800 text-base"
                placeholder="05:00 PM"
                placeholderTextColor="#9ca3af"
              />
              <Ionicons name="time-outline" size={16} color="#9ca3af" />
            </View>
          </View>
        </View>

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
          <Text className="text-white font-bold text-base">Create Shield</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}