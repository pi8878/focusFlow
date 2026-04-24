// import { View, Text } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// interface ActiveShieldsBadgeProps {
//   count: number;
// }

// export default function ActiveShieldsBadge({ count }: ActiveShieldsBadgeProps) {
//   return (
//     <View className="flex-row items-center bg-green-100 px-3 py-1.5 rounded-full gap-1">
//       <Ionicons name="flash" size={13} color="#16a34a" />
//       <Text className="text-green-700 text-xs font-medium ml-0.5">
//         {count} Active Shield{count !== 1 ? "s" : ""}
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
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ActiveShieldsBadgeProps {
  count: number;
}

export default function ActiveShieldsBadge({ count }: ActiveShieldsBadgeProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    // Pulse when count changes
    scale.value = withSequence(
      withSpring(1.2, { damping: 6, stiffness: 200 }),
      withTiming(1, { duration: 200 })
    );
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#dcfce7",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          gap: 4,
        }}
      >
        <Ionicons name="flash" size={13} color="#16a34a" />
        <Text
          style={{
            color: "#15803d",
            fontSize: 12,
            fontWeight: "500",
            marginLeft: 2,
          }}
        >
          {count} Active Shield{count !== 1 ? "s" : ""}
        </Text>
      </View>
    </Animated.View>
  );
}