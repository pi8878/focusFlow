import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SettingsRowProps {
  icon: string;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  isLast?: boolean;
}

export default function SettingsRow({
  icon,
  iconBgColor,
  iconColor,
  title,
  subtitle,
  onPress,
  isLast = false,
}: SettingsRowProps) {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center px-4 py-4"
        activeOpacity={0.7}
      >
        {/* Icon */}
        <View
          className="w-9 h-9 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: iconBgColor }}
        >
          <Ionicons name={icon as any} size={18} color={iconColor} />
        </View>

        {/* Text */}
        <View className="flex-1">
          <Text className="text-gray-900 font-medium text-base">{title}</Text>
          <Text className="text-gray-400 text-xs mt-0.5">{subtitle}</Text>
        </View>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
      </TouchableOpacity>

      {/* Divider — hidden on last item */}
      {!isLast && (
        <View className="h-px bg-gray-100 ml-16" />
      )}
    </>
  );
}