export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type AppName =
  | "Instagram"
  | "TikTok"
  | "X (Twitter)"
  | "YouTube"
  | "Facebook"
  | "Reddit";

export interface Shield {
  id: string;
  appName: AppName;
  startTime: string;
  endTime: string;
  days: DayOfWeek[];
  isActive: boolean;
  createdAt: string;
}

export interface AppOption {
  name: AppName;
  color: string;
  iconColor: string;
}

export interface Suggestion {
  id: string;
  text: string;
}

export interface WeeklyProgress {
  day: DayOfWeek;
  minutesSaved: number;
}

export interface PredictedShield {
  id: string;
  appName: AppName;
  days: DayOfWeek[];
  startTime: string;
  endTime: string;
  reason: string;
}

export interface UnlockSettings {
  cooldownSeconds: number;
  durationMinutes: number;
}

// New
export interface EmergencyUnlockState {
  shieldId: string;
  appName: AppName;
  phase: "reason" | "countdown" | "unlocked";
  reason: string;
  unlockedUntil?: string; // ISO timestamp
}

export interface DailyRecord {
  date: string; // "2026-04-20"
  wasActive: boolean; // did they have at least one active shield that day
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  history: DailyRecord[]; // last 30 days
}