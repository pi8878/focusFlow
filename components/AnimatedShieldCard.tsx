import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ShieldCard from "@/components/ShieldCard";
import { Shield } from "@/types";

interface AnimatedShieldCardProps {
  shield: Shield;
  index: number;
  onToggle: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
  onEmergencyUnlock: (shield: Shield) => void;
}

export default function AnimatedShieldCard({
  shield,
  index,
  onToggle,
  onDelete,
  onEmergencyUnlock,
}: AnimatedShieldCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    // Stagger each card by 80ms based on its index
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(
      index * 80,
      withSpring(0, { damping: 18, stiffness: 120 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ShieldCard
        shield={shield}
        onToggle={onToggle}
        onDelete={onDelete}
        onEmergencyUnlock={onEmergencyUnlock}
      />
    </Animated.View>
  );
}