import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  SharedValue,
} from "react-native-reanimated";

function SkeletonBlock({
  width,
  height,
  borderRadius = 8,
  opacity,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  opacity: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: "#e5e7eb",
        },
        animatedStyle,
      ]}
    />
  );
}

function SkeletonShieldCard({ opacity }: { opacity: SharedValue<number> }) {
  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 16,
        padding: 16,
      }}
    >
      {/* Top row */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SkeletonBlock width={44} height={44} borderRadius={12} opacity={opacity} />
        <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
          <SkeletonBlock width="50%" height={14} opacity={opacity} />
          <SkeletonBlock width="35%" height={10} opacity={opacity} />
        </View>
        <SkeletonBlock width={44} height={24} borderRadius={12} opacity={opacity} />
      </View>

      {/* Day pills */}
      <View style={{ flexDirection: "row", marginTop: 14, gap: 6 }}>
        {[...Array(7)].map((_, i) => (
          <SkeletonBlock key={i} width={28} height={18} borderRadius={4} opacity={opacity} />
        ))}
      </View>

      {/* Bottom row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 14,
          paddingTop: 14,
          borderTopWidth: 1,
          borderTopColor: "#f9fafb",
        }}
      >
        <SkeletonBlock width={80} height={10} opacity={opacity} />
        <SkeletonBlock width={110} height={28} borderRadius={14} opacity={opacity} />
      </View>
    </View>
  );
}

export default function SkeletonLoader() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1, // repeat forever
      true
    );
  }, []);

  return (
    <>
      <SkeletonShieldCard opacity={opacity} />
      <SkeletonShieldCard opacity={opacity} />
      <SkeletonShieldCard opacity={opacity} />
    </>
  );
}