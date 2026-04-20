import AsyncStorage from "@react-native-async-storage/async-storage";
import { Shield, UnlockSettings } from "@/types";

const SHIELDS_KEY = "focusflow_shields";
const UNLOCK_SETTINGS_KEY = "focusflow_unlock_settings";
const ONBOARDING_KEY = "focusflow_onboarding_complete";


export const DEFAULT_UNLOCK_SETTINGS: UnlockSettings = {
  cooldownSeconds: 30,
  durationMinutes: 15,
};

// Get all shields from storage
export const getShields = async (): Promise<Shield[]> => {
  try {
    const data = await AsyncStorage.getItem(SHIELDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save the entire shields array to storage
export const saveShields = async (shields: Shield[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(SHIELDS_KEY, JSON.stringify(shields));
  } catch {}
};

// Add a single new shield
export const addShield = async (shield: Shield): Promise<Shield[]> => {
  try {
    const existing = await getShields();
    const updated = [shield, ...existing];
    await saveShields(updated);
    return updated;
  } catch {
    return [];
  }
};

// Toggle a shield's active state
export const toggleShield = async (
  id: string,
  value: boolean
): Promise<Shield[]> => {
  try {
    const existing = await getShields();
    const updated = existing.map((s) =>
      s.id === id ? { ...s, isActive: value } : s
    );
    await saveShields(updated);
    return updated;
  } catch {
    return [];
  }
};

// Delete a shield by id
export const deleteShield = async (id: string): Promise<Shield[]> => {
  try {
    const existing = await getShields();
    const updated = existing.filter((s) => s.id !== id);
    await saveShields(updated);
    return updated;
  } catch {
    return [];
  }
};

// Clear all shields
export const clearShields = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SHIELDS_KEY);
  } catch {}
};

// Get unlock settings
export const getUnlockSettings = async (): Promise<UnlockSettings> => {
  try {
    const data = await AsyncStorage.getItem(UNLOCK_SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_UNLOCK_SETTINGS;
  } catch {
    return DEFAULT_UNLOCK_SETTINGS;
  }
};

// Save unlock settings
export const saveUnlockSettings = async (
  settings: UnlockSettings
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      UNLOCK_SETTINGS_KEY,
      JSON.stringify(settings)
    );
  } catch {}
};


export const getOnboardingComplete = async (): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(ONBOARDING_KEY);
    return data === "true";
  } catch {
    return false;
  }
};

export const setOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch {}
};

export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("focusflow_onboarding_complete");
  } catch {}
};