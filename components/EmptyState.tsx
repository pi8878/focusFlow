// import { View, Text } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// export default function EmptyState() {
//   return (
//     <View className="mx-4 mt-3 border border-dashed border-gray-300 rounded-2xl py-12 items-center justify-center">
//       <Ionicons name="alert-circle-outline" size={36} color="#d1d5db" />
//       <Text className="text-gray-400 text-sm mt-3 text-center px-6">
//         No schedules set yet. Add your first distraction shield!
//       </Text>
//     </View>
//   );
// }

import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function EmptyState() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    // Fade in on mount
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withSpring(0, { damping: 16, stiffness: 100 });

    // Gentle pulse on icon
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          marginHorizontal: 16,
          marginTop: 12,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "#d1d5db",
          borderRadius: 16,
          paddingVertical: 48,
          alignItems: "center",
          justifyContent: "center",
        },
        containerStyle,
      ]}
    >
      <Animated.View style={iconStyle}>
        <Ionicons name="alert-circle-outline" size={36} color="#d1d5db" />
      </Animated.View>
      <Text
        style={{
          color: "#9ca3af",
          fontSize: 14,
          marginTop: 12,
          textAlign: "center",
          paddingHorizontal: 24,
        }}
      >
        No schedules set yet. Add your first distraction shield!
      </Text>
    </Animated.View>
  );
}