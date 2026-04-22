import { useEmergencyUnlock } from "@/context/EmergencyUnlockContext";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRef } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUBBLE_SIZE = 64;

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export default function FloatingUnlockBubble() {
  const { session, isExpanded, expand, minimize, endSession } =
    useEmergencyUnlock();

  // Use ref for drag detection — avoids stale closure
  const isDragging = useRef(false);

  const pan = useRef(
    new Animated.ValueXY({
      x: SCREEN_WIDTH - BUBBLE_SIZE - 20,
      y: SCREEN_HEIGHT * 0.6,
    })
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5,

      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
        // Reset drag flag on every new touch
        isDragging.current = false;
      },

      onPanResponderMove: (_, gesture) => {
        if (Math.abs(gesture.dx) > 8 || Math.abs(gesture.dy) > 8) {
          isDragging.current = true;
        }
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(_, gesture);
      },

      onPanResponderRelease: () => {
        pan.flattenOffset();

        // Snap to nearest horizontal edge
        const currentX = (pan.x as any)._value;
        const snapX =
          currentX < SCREEN_WIDTH / 2
            ? 20
            : SCREEN_WIDTH - BUBBLE_SIZE - 20;

        Animated.spring(pan, {
          toValue: { x: snapX, y: (pan.y as any)._value },
          useNativeDriver: false,
          friction: 7,
        }).start();

        // Reset drag flag after release with small delay
        setTimeout(() => {
          isDragging.current = false;
        }, 50);
      },
    })
  ).current;

  if (!session) return null;

  return (
    <>
      {/* Floating bubble — only when minimized */}
      {!isExpanded && (
        <Animated.View
          style={{
            position: "absolute",
            transform: pan.getTranslateTransform(),
            zIndex: 9999,
          }}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            onPress={() => {
              // Only expand if not dragging
              if (!isDragging.current) {
                expand();
              }
            }}
            activeOpacity={0.85}
          >
            {/* Outer pulse ring */}
            <View
              style={{
                position: "absolute",
                top: -4,
                left: -4,
                width: BUBBLE_SIZE + 8,
                height: BUBBLE_SIZE + 8,
                borderRadius: (BUBBLE_SIZE + 8) / 2,
                borderWidth: 2,
                borderColor: "#22c55e",
                opacity: 0.4,
              }}
            />

            {/* Main bubble */}
            <View
              style={{
                width: BUBBLE_SIZE,
                height: BUBBLE_SIZE,
                borderRadius: BUBBLE_SIZE / 2,
                backgroundColor: "#22c55e",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 8,
              }}
            >
              <View
                style={{
                  width: BUBBLE_SIZE - 8,
                  height: BUBBLE_SIZE - 8,
                  borderRadius: (BUBBLE_SIZE - 8) / 2,
                  backgroundColor: "#16a34a",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                >
                  {formatTime(session.secondsLeft)}
                </Text>
                <Text
                  style={{
                    color: "#bbf7d0",
                    fontSize: 8,
                    marginTop: 1,
                  }}
                >
                  {session.appName.split(" ")[0]}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Expanded modal */}
      <Modal
        visible={isExpanded}
        animationType="fade"
        transparent={true}
        onRequestClose={minimize}
      >
        <BlurView
          intensity={60}
          tint="dark"
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          {/* Tap outside to minimize */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            activeOpacity={1}
            onPress={minimize}
          />

          {/* Card */}
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 24,
              width: "100%",
              paddingHorizontal: 24,
              paddingTop: 24,
              paddingBottom: 32,
              alignItems: "center",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons name="lock-open" size={20} color="#16a34a" />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {session.appName} Unlocked
                </Text>
              </View>
              {/* Minimize button */}
              <TouchableOpacity onPress={minimize}>
                <Ionicons
                  name="remove-circle-outline"
                  size={24}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: "#9ca3af",
                fontSize: 12,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Tap outside or the minus icon to minimize
            </Text>

            {/* Timer circle */}
            <View
              style={{
                width: 144,
                height: 144,
                borderRadius: 72,
                borderWidth: 4,
                borderColor: "#22c55e",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "700",
                  color: "#22c55e",
                }}
              >
                {formatTime(session.secondsLeft)}
              </Text>
              <Text
                style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}
              >
                remaining
              </Text>
            </View>

            {/* Reason */}
            <Text
              style={{
                color: "#9ca3af",
                fontSize: 12,
                fontStyle: "italic",
                textAlign: "center",
                paddingHorizontal: 16,
                marginBottom: 24,
              }}
            >
              "{session.reason}"
            </Text>

            {/* End session */}
            <TouchableOpacity
              onPress={endSession}
              style={{
                backgroundColor: "#fee2e2",
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 32,
              }}
            >
              <Text
                style={{
                  color: "#ef4444",
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                End Unlock Early
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </>
  );
}