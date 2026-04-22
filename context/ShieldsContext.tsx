import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import { Shield } from "@/types";
import {
  getShields,
  addShield as storeAdd,
  toggleShield as storeToggle,
  deleteShield as storeDelete,
  startCooling,
  isShieldCooling,
  clearExpiredCooling,
} from "@/store/shields";

interface ShieldsContextType {
  shields: Shield[];
  loading: boolean;
  activeCount: number;
  addShield: (shield: Shield) => Promise<void>;
  toggleShield: (id: string, value: boolean) => Promise<void>;
  deleteShield: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

const ShieldsContext = createContext<ShieldsContextType | null>(null);

export function ShieldsProvider({ children }: { children: ReactNode }) {
  const [shields, setShields] = useState<Shield[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const stored = await clearExpiredCooling();
    setShields(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addShield = async (shield: Shield) => {
    const updated = await storeAdd(shield);
    setShields(updated);
  };

  const toggleShield = async (id: string, value: boolean) => {
    const shield = shields.find((s) => s.id === id);
    if (!shield) return;

    // Preset shields — no enforcement, toggle freely
    // if (shield.isPreset) {
    //   const updated = await storeToggle(id, value);
    //   setShields(updated);
    //   return;
    // }

    // Prevent toggling off a cooling shield
    if (isShieldCooling(shield)) {
      Alert.alert(
        "Shield is Cooling",
        "This shield is in a 2-hour cooling period and cannot be toggled off yet.",
        [{ text: "OK" }]
      );
      return;
    }

    // Toggling off an active manual shield starts cooling
    if (value === false && shield.isActive) {
      Alert.alert(
        "Start Cooling Period?",
        `Turning off an active shield starts a 2-hour cooling period for ${shield.appName}. The shield will remain active during this time and automatically turn off after 2 hours.\n\nThis prevents impulsive decisions.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Start Cooling",
            style: "destructive",
            onPress: async () => {
              const updated = await startCooling(id);
              setShields(updated);
            },
          },
        ]
      );
      return;
    }

    const updated = await storeToggle(id, value);
    setShields(updated);
  };

  const deleteShield = async (id: string) => {
    const shield = shields.find((s) => s.id === id);
    if (!shield) return;

    // Preset shields — delete freely with simple confirm
    // if (shield.isPreset) {
    //   Alert.alert(
    //     "Remove Preset Shield",
    //     `Remove ${shield.appName} from your Focus Mode schedule?`,
    //     [
    //       { text: "Cancel", style: "cancel" },
    //       {
    //         text: "Remove",
    //         style: "destructive",
    //         onPress: async () => {
    //           const updated = await storeDelete(id);
    //           setShields(updated);
    //         },
    //       },
    //     ]
    //   );
    //   return;
    // }

    // Prevent deleting a cooling shield
    if (isShieldCooling(shield)) {
      Alert.alert(
        "Shield is Cooling",
        "This shield is in a 2-hour cooling period and cannot be deleted yet.",
        [{ text: "OK" }]
      );
      return;
    }

    // Active manual shield — start cooling
    if (shield.isActive) {
      Alert.alert(
        "Cannot Delete Active Shield",
        `${shield.appName} is currently active. Deleting an active shield starts a 2-hour cooling period. The shield will remain active and automatically be removed after 2 hours.\n\nThis prevents impulsive decisions.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Start Cooling & Remove",
            style: "destructive",
            onPress: async () => {
              const updated = await startCooling(id);
              setShields(updated);
            },
          },
        ]
      );
      return;
    }

    // Inactive manual shield — delete instantly
    const updated = await storeDelete(id);
    setShields(updated);
  };

  const activeCount = shields.filter((s) => s.isActive).length;

  return (
    <ShieldsContext.Provider
      value={{
        shields,
        loading,
        activeCount,
        addShield,
        toggleShield,
        deleteShield,
        reload,
      }}
    >
      {children}
    </ShieldsContext.Provider>
  );
}

export function useShields() {
  const context = useContext(ShieldsContext);
  if (!context) {
    throw new Error("useShields must be used within a ShieldsProvider");
  }
  return context;
}