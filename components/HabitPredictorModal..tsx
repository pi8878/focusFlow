import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { PredictedShield, Shield, DayOfWeek } from "@/types";
import { getPredictedShields } from "@/services/ai";
import { useShields } from "@/hooks/useShields";

interface HabitPredictorModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HabitPredictorModal({
  visible,
  onClose,
}: HabitPredictorModalProps) {
  const { shields, addShield } = useShields();
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

    await addShield(newShield);
    setAddedIds((prev) => [...prev, prediction.id]);

    Alert.alert(
      "Shield Added",
      `${prediction.appName} has been added to your shields.`,
      [{ text: "OK" }]
    );
  };

  const formatDays = (days: string[]) => days.join(", ");

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <View className="flex-1 bg-black/50 items-center justify-center px-5">
        {/* Modal card */}
        <View className="bg-white rounded-3xl w-full max-h-4/5 overflow-hidden">

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

          {/* Loading state */}
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
              {/* Subtitle */}
              <Text className="text-gray-500 text-sm px-6 pb-4 leading-5">
                Based on your current shields, I've identified some patterns
                that might be affecting your focus.
              </Text>

              {/* Predictions list */}
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
                      className="border border-gray-100 rounded-2xl p-4 mb-3"
                    >
                      {/* App name + add button */}
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1 mr-3">
                          <Text className="text-gray-900 font-bold text-base">
                            {prediction.appName}
                          </Text>
                          <Text className="text-gray-400 text-xs mt-0.5">
                            {formatDays(prediction.days)} • {prediction.startTime} -{" "}
                            {prediction.endTime}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleAdd(prediction)}
                          disabled={isAdded}
                          className={`w-9 h-9 rounded-full items-center justify-center ${
                            isAdded ? "bg-gray-200" : "bg-green-500"
                          }`}
                        >
                          <Ionicons
                            name={isAdded ? "checkmark" : "add"}
                            size={20}
                            color="#ffffff"
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Reason */}
                      <Text className="text-gray-500 text-xs italic mt-3 leading-4">
                        "{prediction.reason}"
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>

              {/* Maybe later */}
              <TouchableOpacity
                onPress={onClose}
                className="py-5 items-center"
              >
                <Text className="text-gray-400 text-sm font-medium">
                  Maybe later
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}