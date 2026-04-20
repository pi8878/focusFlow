import AsyncStorage from "@react-native-async-storage/async-storage";
import { StreakData, DailyRecord } from "@/types";

const STREAK_KEY = "focusflow_streak";

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  history: [],
};

// Get today's date as a string "YYYY-MM-DD"
export const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Get the date string for N days ago
export const getDaysAgoString = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
};

// Load streak data from storage
export const getStreakData = async (): Promise<StreakData> => {
  try {
    const data = await AsyncStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : DEFAULT_STREAK;
  } catch {
    return DEFAULT_STREAK;
  }
};

// Save streak data to storage
export const saveStreakData = async (data: StreakData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {}
};

// Called whenever the app checks in — updates streak based on active shields
export const recordDailyActivity = async (
  hasActiveShields: boolean
): Promise<StreakData> => {
  const today = getTodayString();
  const existing = await getStreakData();

  // Check if we already recorded today
  const alreadyRecordedToday = existing.history.some(
    (r) => r.date === today
  );

  if (alreadyRecordedToday) {
    // Update today's record if shield status changed
    const updatedHistory = existing.history.map((r) =>
      r.date === today ? { ...r, wasActive: hasActiveShields } : r
    );
    const updated = { ...existing, history: updatedHistory };
    const recalculated = recalculateStreak(updated);
    await saveStreakData(recalculated);
    return recalculated;
  }

  // Add today's record
  const newRecord: DailyRecord = {
    date: today,
    wasActive: hasActiveShields,
  };

  // Keep only last 30 days
  const updatedHistory = [newRecord, ...existing.history].slice(0, 30);

  const updated: StreakData = {
    ...existing,
    history: updatedHistory,
    lastActiveDate: hasActiveShields ? today : existing.lastActiveDate,
  };

  const recalculated = recalculateStreak(updated);
  await saveStreakData(recalculated);
  return recalculated;
};

// Recalculate current and longest streak from history
const recalculateStreak = (data: StreakData): StreakData => {
  const sorted = [...data.history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = getTodayString();
  const yesterday = getDaysAgoString(1);

  // Current streak — must start from today or yesterday
  const startsFromRecent =
    sorted.length > 0 &&
    (sorted[0].date === today || sorted[0].date === yesterday);

  if (startsFromRecent) {
    for (const record of sorted) {
      if (record.wasActive) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Longest streak — scan entire history
  for (const record of sorted) {
    if (record.wasActive) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  return {
    ...data,
    currentStreak,
    longestStreak: Math.max(longestStreak, data.longestStreak),
  };
};

// Get just the last 7 days for the weekly grid
export const getLast7Days = (
  history: DailyRecord[]
): { date: string; dayLabel: string; wasActive: boolean; isToday: boolean }[] => {
  const days = [];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const date = getDaysAgoString(i);
    const record = history.find((r) => r.date === date);
    const dayOfWeek = new Date(date + "T00:00:00").getDay();

    days.push({
      date,
      dayLabel: dayLabels[dayOfWeek],
      wasActive: record?.wasActive ?? false,
      isToday: i === 0,
    });
  }

  return days;
};