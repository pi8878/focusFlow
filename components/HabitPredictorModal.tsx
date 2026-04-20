import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { PredictedShield, Shield, DayOfWeek } from "@/types";
import { getPredictedShields } from "@/services/ai";
import { useShields } from "@/context/ShieldsContext";

interface HabitPredictorModalProps {
  visible: boolean;
  onClose: () => void;
  onAddShield: (shield: Shield) => Promise<void>;
}

export default function HabitPredictorModal({
  visible,
  onClose,
  onAddShield,
}: HabitPredictorModalProps) {
  const { shields } = useShields();
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<PredictedShield[]>([]);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      loadPredictions();
    }
  }, [visible]);

  const loadPredictions = async () => {
    setLoading(true);
    setAddedIds([]);
    const results = await getPredictedShields(shields);
    setPredictions(results);
    setLoading(false);
  };

  const handleAdd = async (prediction: PredictedShield) => {
    const newShield: Shield = {
      id: Date.now().toString(),
      appName: prediction.appName,
      startTime: prediction.startTime,
      endTime: prediction.endTime,
      days: prediction.days as DayOfWeek[],
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    await onAddShield(newShield);

    const updatedAddedIds = [...addedIds, prediction.id];
    setAddedIds(updatedAddedIds);

    if (updatedAddedIds.length === predictions.length) {
      Alert.alert(
        "All Shields Added",
        "All suggested shields have been added to your schedules.",
        [{ text: "Great!", onPress: onClose }]
      );
    }
  };

  const formatDays = (days: string[]) => days.join(", ");

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <BlurView
        intensity={60}
        tint="dark"
        style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
      >
        <View className="bg-white rounded-3xl w-full overflow-hidden">

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                <Ionicons name="sparkles" size={20} color="#16a34a" />
              </View>
              <Text className="text-xl font-bold text-gray-900">
                AI Habit Predictor
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="items-center justify-center py-16">
              <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-4">
                <Ionicons name="hardware-chip-outline" size={36} color="#16a34a" />
              </View>
              <Text className="text-gray-400 text-sm">
                Claude is analyzing your digital habits...
              </Text>
            </View>
          ) : (
            <>
              <Text className="text-gray-500 text-sm px-6 pb-4 leading-5">
                Based on your current shields, I've identified some patterns
                that might be affecting your focus.
              </Text>

              <ScrollView
                className="px-6"
                style={{ maxHeight: 380 }}
                showsVerticalScrollIndicator={true}
              >
                {predictions.map((prediction) => {
                  const isAdded = addedIds.includes(prediction.id);
                  return (
                    <View
                      key={prediction.id}
                      className={`border rounded-2xl p-4 mb-3 ${
                        isAdded
                          ? "border-green-200 bg-green-50"
                          : "border-gray-100"
                      }`}
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1 mr-3">
                          <Text className="text-gray-900 font-bold text-base">
                            {prediction.appName}
                          </Text>
                          <Text className="text-gray-400 text-xs mt-0.5">
                            {formatDays(prediction.days)} •{" "}
                            {prediction.startTime} - {prediction.endTime}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => !isAdded && handleAdd(prediction)}
                          disabled={isAdded}
                          className="w-9 h-9 rounded-full items-center justify-center bg-green-500"
                        >
                          <Ionicons
                            name={isAdded ? "checkmark" : "add"}
                            size={20}
                            color="#ffffff"
                          />
                        </TouchableOpacity>
                      </View>
                      <Text className="text-gray-500 text-xs italic mt-3 leading-4">
                        "{prediction.reason}"
                      </Text>
                      {isAdded && (
                        <Text className="text-green-500 text-xs font-medium mt-2">
                          ✓ Added to your schedules
                        </Text>
                      )}
                    </View>
                  );
                })}
              </ScrollView>

              <TouchableOpacity onPress={onClose} className="py-5 items-center">
                <Text className="text-gray-400 text-sm font-medium">
                  Maybe later
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}